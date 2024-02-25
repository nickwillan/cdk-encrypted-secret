import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Architecture, Code, Runtime, SingletonFunction } from 'aws-cdk-lib/aws-lambda';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { AwsCustomResource, AwsCustomResourcePolicy, PhysicalResourceId } from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';
import * as path from 'path';
import * as crypto from 'crypto';
import { RemovalPolicy, Stack } from 'aws-cdk-lib';
import { Secret, SecretProps } from 'aws-cdk-lib/aws-secretsmanager';
import { ARN, parse, validate } from '@aws-sdk/util-arn-parser';

/**
 * EncryptedSecretProps defines the properties for the EncryptedSecret construct
 *
 * @interface EncryptedSecretProps
 * @member {aws-cdk-lib/aws-secretsmanager » SecretProps} secretProps is the SecretProps for the Secret to be created and set the decrypted value in.
 * @member {aws-cdk-lib/aws-secretsmanager » Secret} existingSecretObj is the existing Secret to be used to set the decrypted value in.
 * @member {string} ciphertextBlob is the ciphertext to be decrypted and stored in the Secret.
 * @member {string} keyId is the KMS Key ARN to be used to decrypt the ciphertext.
 */

export interface EncryptedSecretProps {
  secretProps?: SecretProps;
  existingSecretObj?: Secret;
  ciphertextBlob: string;
  keyId: string;
}

/**
 * EncryptedSecret is a custom construct that creates a Secret in Secrets Manager and decrypts the ciphertext
 * using the KMS Key ARN provided and stores the decrypted value in the Secret.
 *
 * @class EncryptedSecret
 * @extends {Construct}
 * @member {Construct} scope is the scope of the construct.
 * @member {string} id is the id of the construct.
 * @member {EncryptedSecretProps} props is the EncryptedSecretProps for the EncryptedSecret construct.
 */
export class EncryptedSecret extends Construct {
  public secret: Secret;
  constructor(scope: Construct, id: string, props: EncryptedSecretProps) {
    super(scope, id);

    // Ensure keyId is valid
    if (!validate(props.keyId)) {
      throw new Error('Invalid keyId.');
    }
    // Parse keyId as ARN
    const kmsKey: ARN = parse(props.keyId);

    // Ensure ciphertextBlob is non empty
    if (!props.ciphertextBlob.length) {
      throw new Error('ciphertextBlob cannot be empty');
    }

    if (props.existingSecretObj) {
      // If existingSecretObj is provided, use it
      this.secret = props.existingSecretObj;
    } else {
      // create a secret with the secretProps provided
      this.secret = new Secret(this, 'Secrets', props.secretProps);
    }
    // Create the Lambda Function to decrypt the ciphertext and store the value in the Secret
    const decryptSecretFunction = new SingletonFunction(this, 'DecryptSecretFunction', {
      lambdaPurpose: 'DecryptSecret',
      uuid: crypto.createHash('md5').update(Stack.of(this).stackName).digest('hex'),
      runtime: Runtime.NODEJS_20_X,
      architecture: Architecture.ARM_64,
      code: Code.fromAsset(path.join(__dirname, 'lambda')),
      handler: 'index.handler',
      memorySize: 128,
      environment: {
        KMS_KEY_REGION: kmsKey.region,
      },
      logGroup: new LogGroup(this, 'DecryptSecretFunctionLogGroup', {
        removalPolicy: RemovalPolicy.DESTROY,
        retention: RetentionDays.ONE_WEEK,
      }),
    });

    // Add to the Policy Statement the ability to decrypt the cipherText with KMS against the kmsKeyArn in the props
    decryptSecretFunction.addToRolePolicy(
      new PolicyStatement({
        actions: ['kms:Decrypt'],
        resources: [props.keyId],
      }),
    );

    // Add to the Policy Statement the ability to put the secret value into Secrets Manager
    decryptSecretFunction.addToRolePolicy(
      new PolicyStatement({
        actions: ['secretsmanager:PutSecretValue'],
        resources: [this.secret.secretArn],
      }),
    );

    if (this.secret.encryptionKey) {
      // Add to the Lambda Function Policy Statement the ability to encrypt using the encryption key of the secret
      decryptSecretFunction.addToRolePolicy(
        new PolicyStatement({
          actions: ['kms:Encrypt'],
          resources: [this.secret.encryptionKey.keyArn],
        }),
      );

      // Modify Key Policy to allow the Lambda to use the KMS Key to encrypt the Secret
      this.secret.encryptionKey.grantEncrypt(decryptSecretFunction);
    }

    // Create the custom resource
    const lambdaInvokeAwsCustomResource = new AwsCustomResource(this, 'CustomResourceSecretLambdaInvoke', {
      onCreate: {
        service: 'Lambda',
        action: 'invoke',
        parameters: {
          FunctionName: decryptSecretFunction.functionName,
          Payload:
            '{"secretArn": "' +
            this.secret.secretArn +
            '","keyId": "' +
            props.keyId +
            '", "cipherText": "' +
            props.ciphertextBlob +
            '"}',
        },
        physicalResourceId: PhysicalResourceId.of('CustomResourceSecretLambdaInvoke'),
      },
      onUpdate: {
        service: 'Lambda',
        action: 'invoke',
        parameters: {
          FunctionName: decryptSecretFunction.functionName,
          Payload:
            '{"secretArn": "' +
            this.secret.secretArn +
            '","keyId": "' +
            props.keyId +
            '", "cipherText": "' +
            props.ciphertextBlob +
            '"}',
        },
        physicalResourceId: PhysicalResourceId.of('CustomResourceSecretLambdaInvoke'),
      },
      policy: AwsCustomResourcePolicy.fromSdkCalls({
        resources: [decryptSecretFunction.functionArn],
      }),
      logGroup: new LogGroup(this, 'CustomResourceSecretLambdaInvokeLogGroup', {
        removalPolicy: RemovalPolicy.DESTROY,
        retention: RetentionDays.ONE_WEEK,
      }),
    });

    // Grant the Lambda Invoke permissions to the lambdaInvoke custom resource
    decryptSecretFunction.grantInvoke(lambdaInvokeAwsCustomResource);
  }
}
