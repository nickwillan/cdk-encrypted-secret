import { KMSClient, DecryptCommand } from '@aws-sdk/client-kms'; // ES Modules import
import { SecretsManager } from '@aws-sdk/client-secrets-manager';

interface SecretSetProps {
  secretArn: string;
  cipherText: string;
  kmsKeyArn: string;
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

  /// Hander decrypts the secret and sets it in Secrets Manager
  async handler(props: SecretSetProps): Promise<void> {
    try {
      // Decrypt Secret
      const response = await this.kmsClient.send(
        new DecryptCommand({
          CiphertextBlob: Buffer.from(props.cipherText, 'base64'),
          KeyId: props.kmsKeyArn,
        }),
      );

      // Set Secret in Secrets Manager
      await this.secretsClient.putSecretValue({
        SecretId: props.secretArn,
        SecretString: new TextDecoder().decode(response.Plaintext),
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
export const handler = (event: SecretSetProps) => new SecretSettingLambda().handler(event);
