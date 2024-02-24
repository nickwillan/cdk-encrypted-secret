# CDK Encrypted Secret (cdk-encrypted-secret)

[![State: GA](https://img.shields.io/badge/state-GA-22BC22?logo=npm)](https://github.com/nickwillan/cdk-secret/pkgs/npm/cdk-secret)
[![Maintainer: Nick Willan](https://img.shields.io/badge/maintainer-%40nick_willan-0046FF?&logo=github)](https://github.com/nickwillan)
[![AWS: CDK Construct](https://img.shields.io/badge/aws-cdk_construct-FF9900?&logo=AmazonAWS)](.)
[![Test Coverage](https://img.shields.io/badge/coverage-100%25-22BC22?style=flat&logo=jest)](.)

The `cdk-encrypted-secret` is set of CDK (AWS Cloud Development Kit) Constructs that allows users to encrypt secrets for their application and store it in their code repository.

### EncryptedSecret

This CDK Construct creates an AWS Secrets Manager Secret from a KMS (Key Management Service) encrypted CipherText. This construct simplifies the process of creating and managing secrets in AWS by automating the decryption and storage of secrets, during the application deployment.

## Table of Contents

- [CDK Encrypted Secret (cdk-encrypted-secret)](#cdk-encrypted-secret-cdk-encrypted-secret)
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
npm i @nick-willan/cdk-encrypted-secret
```

## Usage

In your CDK application, you can create an `EncryptedSecret` using the a KMS encrypted Cipher text, KMS Key Id (from prerequisite), and SecretProps:

```typescript
const mySecret = new EncryptedSecret(this, 'my-secret', {
  secretProps: {
    description: 'A Super Secret Secret',
    encryptionKey: kmsSecretKey, // Optional, if not provided, an AWS Managed Key will be used
  },
  cipherText: 'AQICAHhFR8...',
  kmsKeyArn: 'arn:aws:kms:us-west-2:012345678901:key/483291fd-92ad-4dde-af8b-e4203b013258',
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

- secretProps: [SecretProps](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_secretsmanager.SecretProps.html) - The SecretProps for the Secret to be created.
- cipherText: string - The cipherText to be decrypted and stored in the Secret.
- kmsKeyArn: string - The KMS Key ARN to be used to decrypt the cipherText.

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

4.  **Do I have to provide a KMS Key for my Secret in AWS?**

    For compliance reasons, it may is required that all Secrets in AWS are encrypted with a CMK, not an AWS Managed Key.
    To create a KMS CMK in your application, add the following to your stack:

    ```typescript
    // Create a KMS Key for the Secret Manager Secret created below
    const kmsSecretKey = new Key(this, `AppSecretEncryptionKey`, {
      alias: 'alias/my-key',
      enableKeyRotation: true, // Rotate the key every year
      removalPolicy: RemovalPolicy.DESTROY, // Remove the key when the stack is destroyed, Retain is default
      pendingWindow: Duration.days(7), // Allow 7 days for key deletion
    });
    ```

    **Note:** You may use the same CMK for multiple secrets.

5.  **Why not use the CMK that was used to encrypt the secret, for the Secret's CMK?**

    Ideally, your production application doesn't rely on any KMS key used for the cdk deloyment account for anything other than deployment. Doing so would have a strange runtime dependency and also may have cross region dependency.

## Contributing

We :heart: contributions!

Please refer to the [Contributing Guide](contributing.md)
