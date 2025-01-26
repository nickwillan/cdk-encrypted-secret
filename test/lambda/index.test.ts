import { KMSClient, DecryptCommand } from '@aws-sdk/client-kms';
import { SecretsManager, PutSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { mockClient } from 'aws-sdk-client-mock';
import { handler } from '../../src/lambda/index';

const SECRET = 'This is a secret';

const lambdaEvent = {
  secretArn: 'arn:secret-arn',
  cipherText: 'VGhpcyBpcyBhIHNlY3JldA==',
  kmsKeyArn: 'arn:kms-key-arn',
};

const kmsMock = mockClient(KMSClient);
const secretsMock = mockClient(SecretsManager);

beforeEach(() => {
  kmsMock.reset();
  secretsMock.reset();
});

it('should decrypt and put the secret', async () => {
  // Simulating the KMS client returning the decrypted secret
  kmsMock.on(DecryptCommand).resolves({
    Plaintext: new TextEncoder().encode(SECRET),
  });

  // Simulating the Secrets Manager client returning the secret ARN after putting the secret
  secretsMock.on(PutSecretValueCommand).resolves({
    ARN: lambdaEvent.secretArn,
  });

  await handler(lambdaEvent);

  // Verify that the KMS client was called with the correct parameters
  expect(kmsMock.calls()[0].firstArg.input).toEqual({
    CiphertextBlob: Buffer.from(lambdaEvent.cipherText, 'base64'),
    KeyId: lambdaEvent.kmsKeyArn,
  });

  // Verify that the decrypted secret is returned
  expect(await kmsMock.calls()[0].returnValue).toEqual({
    Plaintext: new TextEncoder().encode(SECRET),
  });

  // Verify that the Secrets Manager client was called with the correct parameters
  expect(secretsMock.calls()[0].firstArg.input).toEqual({
    SecretId: lambdaEvent.secretArn,
    SecretString: SECRET,
  });

  // Verify that the secret ARN is returned after the secret is put
  expect(await secretsMock.calls()[0].returnValue).toEqual({
    ARN: lambdaEvent.secretArn,
  });
});

it('should catch and throw KMS error', async () => {
  // Simulating error decrypting the secret
  kmsMock.on(DecryptCommand).rejects('Error decrypting secret');

  await expect(handler(lambdaEvent)).rejects.toThrow('Error decrypting secret');
});

it('should catch and throw Secrets Manager error', async () => {
  // Simulating the KMS client returning the decrypted secret
  kmsMock.on(DecryptCommand).resolves({
    Plaintext: new TextEncoder().encode(SECRET),
  });

  // Simulating error putting the secret
  secretsMock.on(PutSecretValueCommand).rejects('Error putting secret');

  await expect(handler(lambdaEvent)).rejects.toThrow('Error putting secret');
});
