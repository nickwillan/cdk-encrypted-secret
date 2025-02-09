import { KMSClient, DecryptCommand } from '@aws-sdk/client-kms'; // ES Modules import
import { SecretsManager } from '@aws-sdk/client-secrets-manager';

interface SecretSetProps {
  secretArn: string;
  cipherText: string;
  kmsKeyArn: string;
}

function isNullOrEmpty(value: string | undefined | null): boolean {
  return value === undefined || value === null || value.trim() === '';
}

class SecretSettingLambda {
  private secretsClient: SecretsManager;
  private kmsClient: KMSClient;

  constructor() {
    this.secretsClient = new SecretsManager({
      region: process.env.AWS_DEFAULT_REGION,
    });
    this.kmsClient = new KMSClient({
      region: process.env.KMS_KEY_REGION, // The region of the KMS key used to encrypt the secret
    });
  }

  /// Handler decrypts the secret and sets it in Secrets Manager
  async handler(props: SecretSetProps): Promise<void> {
    if (isNullOrEmpty(props.secretArn) || isNullOrEmpty(props.cipherText) || isNullOrEmpty(props.kmsKeyArn)) {
      throw new Error('Missing required properties: secretArn, cipherText, and kmsKeyArn are required.');
    }

    try {
      console.log('Decrypting ciphertextBlob');
      // Decrypt Secret
      const response = await this.kmsClient.send(
        new DecryptCommand({
          CiphertextBlob: Buffer.from(props.cipherText, 'base64'),
          KeyId: props.kmsKeyArn,
        }),
      );

      console.log('Setting secret in Secrets Manager');
      // Set Secret in Secrets Manager
      await this.secretsClient.putSecretValue({
        SecretId: props.secretArn,
        SecretString: new TextDecoder().decode(response.Plaintext),
      });
    } catch (error) {
      console.error('Error decrypting and setting secret:', error);
      throw error;
    }
    console.log('Secret decrypted and set successfully');
  }
}
export const handler = (event: SecretSetProps) => new SecretSettingLambda().handler(event);
