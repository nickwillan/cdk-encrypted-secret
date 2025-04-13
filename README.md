# CDK Encrypted Secret

[![State: GA](https://img.shields.io/badge/state-GA-22BC22?logo=npm)](https://github.com/nickwillan/cdk-secret/pkgs/npm/cdk-secret)
[![Maintainer: Nick Willan](https://img.shields.io/badge/maintainer-%40nick_willan-0046FF?&logo=github)](https://github.com/nickwillan)
[![AWS: CDK Construct](https://img.shields.io/badge/aws-cdk_construct-FF9900?&logo=AmazonAWS)](.)
[![Test Coverage](https://img.shields.io/badge/coverage-100%25-22BC22?style=flat&logo=jest)](.)

The `cdk-encrypted-secret` is a CDK (AWS Cloud Development Kit) Construct that allows users to encrypt secrets for their application and securely store it in their code repository.

### EncryptedSecret

This CDK Construct creates an AWS Secrets Manager Secret from a KMS (Key Management Service) encrypted CipherText. This construct simplifies the process of creating and managing secrets in AWS by automating the decryption and storage of secrets, during the application deployment.

Managing Secrets in AWS can be a complex task. By securely storing secrets in your repository, you can ensure that your secrets are safe and auditable. This construct is designed to be used in a CI/CD pipeline, where the secrets are decrypted and stored in AWS Secrets Manager during the deployment process. While generally, storing secrets in your repository is not recommended, by encrypting the secrets with a KMS Key, you can ensure that the secrets are safe and secure, even if your source code is compromised.

## Table of Contents

- [CDK Encrypted Secret](#cdk-encrypted-secret)
  - [EncryptedSecret](#encryptedsecret)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Configuration Options](#configuration-options)
    - [EncryptedSecret](#encryptedsecret-1)
  - [Prerequisite](#prerequisite)
    - [Create KMS Key for the Secret](#create-kms-key-for-the-secret)
    - [Encrypt Script via AWS CLI](#encrypt-script-via-aws-cli)
  - [Construct Details](#construct-details)
  - [FAQs](#faqs)
  - [Contributing](#contributing)

## Installation

```bash
npm i cdk-encrypted-secret --save-dev
```

## Usage

In your CDK application, you can create an `EncryptedSecret` using the a KMS encrypted Ciphertext, KMS Key Id (from prerequisite), and SecretProps (or an existing Secret object).:

```typescript
const mySecret = new EncryptedSecret(this, 'MySecret', {
  secretProps: {
    description: 'My Secret description',
  },
  ciphertextBlob: 'AQICAHhFR8...',
  keyId: 'arn:aws:kms:us-west-2:012345678901:key/483291fd-92ad-4dde-af8b-e4203b013258',
});
```

You can then use the `mySecret.secret` directly to assign read permissions to different parts of your infrastructure.

**Note:** You may want to inject a hard CloudFormation Dependency against this custom construct, if you need to ensure the value is set before using it. This can be like:

```typescript
myOtherCDKObject.node.addDependency(mySecret.secret);
```

## Configuration Options

### EncryptedSecret

The `EncryptedSecret` supports the following configuration options in `EncryptedSecretProps`:

- secretProps: [SecretProps](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_secretsmanager.SecretProps.html) - The SecretProps for the Secret to be created. If `existingSecretObj` is provided, this property is ignored.
- existingSecretObj: [ISecret](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_secretsmanager.ISecret.html) - An existing Secret object to be used instead of creating a new Secret.
- ciphertextBlob: string - The cipherText to be decrypted and stored in the Secret.
- keyId: string - The KMS Key ARN to be used to decrypt the cipherText.
- logRetentionDays: [aws-cdk-lib.aws_logs.RetentionDays](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_logs.RetentionDays.html) (optional) - The retention period for logs of the Lambda function and custom resource. Defaults to one week (`RetentionDays.ONE_WEEK`) if not specified.
## Prerequisite

### Create KMS Key for the Secret

In order use this CDK Construct, you must first create a KMS Key that will be used encrypt the secret value. Ensure that the KMS Key can be decrypted by the AWS Account where the Secret will be created.

### Encrypt Script via AWS CLI

To encrypt a value using the KMS key can be easily done via an AWS CLI command. First, create a file to store the secret in:

```bash
touch ~/my-secret
```

Next, open `~/my-secret` with a text editor, paste the secret value into the file, save the file and then run the below command (changing the values as needed):

```bash
aws kms encrypt \
--key-id arn:aws:kms:us-west-2:274513454540:key/383291fd-92ad-4ede-af8d-e4203b013258 \
--plaintext fileb://~/my-secret
```

Note that, since we're using the `fileb` prefix, the contents of the `my-secret` file doesn't have to be encoded into base64.

Here's an example of the `my-secret` file value for an RDS database:

```json
{
  "dbClusterIdentifier": "my-db-cluster",
  "password": "my-password",
  "dbname": "my-db",
  "engine": "postgres",
  "port": "5432",
  "host": "my-db-cluster.crz4b94wfw5n.us-west-2.rds.amazonaws.com",
  "username": "my-username"
}
```

Please be sure to delete the file after use:

```bash
rm ~/my-secret
```

## Construct Details

This construct creates a Secret, a Singleton Lambda and an AWSCustomResource to invoke the lambda. The lambda then decrypts the `CipherText` and sets the value of the Secret.

## FAQs

1.  **Why is my CloudFormation Stack failing to deploy?**

    The common reason for failure is that the AWS Account where the CloudFormation stack is deploying to, does not have the permission to the KMS key. Look at the KMS Key Policy, and verify the permissions. The Lambda also produces a Log in CloudWatch, which should contain more information about the failure.

2.  **Why is the Lambda implemented as a SingletonFunction?**

    Lambda that will only ever be added to a stack once. This construct is a way to guarantee that the lambda function will be guaranteed to be part of the stack, once and only once, irrespective of how many times the construct is declared to be part of the stack. This is guaranteed as long as the uuid property and the optional lambdaPurpose property stay the same whenever they’re declared into the stack.

3.  **How can I use the Secret created by this construct in my stack?**

    You can use the Construct's exported member `secret` to get access to the Secret Construct that was created. You can use this like you'd use any AWS Secrets Manager Secret created within your stack.

    e.g. `mySecret.secret`

4.  **Why is storing the encrypted secret in the repository better than creating a CDK Secret with a dummy-value, and setting the value manually?**

    By storing the encrypted secret in the repository, you can ensure that the secret is auditable and application deployment is repeatable. The value of the Secret will be set during the deployment process, allowing your application to work immedately after deployment. This is especially useful in a disaster recovery scenario, where you can deploy your application without needing to manually set the secret value after deployment. By using a pull-request to update the secret, the rotation of the secret can be audited and approved by the team.

5.  **Is the secret value ever logged or sent to any other AWS Service?**

    No. The secret value is only decrypted within the Lambda function, and is never logged or sent to any other AWS Service. The lambda function will execute within your AWS Account, and the decrypted value will be set directly into the Secret. This project will remain open-source, and the code can be reviewed to ensure that the secret value is not sent to any other service.

## Contributing

I :heart: contributions!

Please refer to the [Contributing Guide](contributing.md)
