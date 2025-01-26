import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Key } from 'aws-cdk-lib/aws-kms';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { EncryptedSecret } from '../src/index';

let stack: Stack;

beforeEach(() => {
  stack = new Stack();
});

it('create a EncryptedSecret', () => {
  // WHEN
  new EncryptedSecret(stack, 'MyConstruct', {
    ciphertextBlob: 'foobar',
    keyId: 'arn:aws:kms:us-west-2:012345678901:key/483291fd-92ad-4dde-af8b-e4203b013258',
    secretProps: {
      description: 'ABCD',
      encryptionKey: new Key(stack, 'MyKey'),
    },
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('Custom::AWS', {});
  Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::Secret', { Description: 'ABCD' });
});

it('create a EncryptedSecret with existing secret object', () => {
  // WHEN
  const existingSecretObj = new Secret(stack, 'MyExistingSecret', {
    description: 'ABCD',
    encryptionKey: new Key(stack, 'MyKey'),
  });
  new EncryptedSecret(stack, 'MyConstruct', {
    ciphertextBlob: 'foobar',
    keyId: 'arn:aws:kms:us-west-2:012345678901:key/483291fd-92ad-4dde-af8b-e4203b013258',
    existingSecretObj: existingSecretObj,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('Custom::AWS', {});
  Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::Secret', { Description: 'ABCD' });
});

it('Creates when encryption key is not provided', () => {
  // WHEN

  new EncryptedSecret(stack, 'MyConstruct', {
    ciphertextBlob: 'foobar',
    keyId: 'arn:aws:kms:us-west-2:012345678901:key/483291fd-92ad-4dde-af8b-e4203b013258',
    secretProps: {
      description: 'ABCD',
    },
  });
  // THEN
  Template.fromStack(stack).hasResourceProperties('Custom::AWS', {});
  Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::Secret', { Description: 'ABCD' });
});

it('Fails when kmsKeyArn is invalid', () => {
  // WHEN
  expect(() => {
    new EncryptedSecret(stack, 'MyConstruct', {
      ciphertextBlob: 'foobar',
      keyId: 'asdfasdf',
      secretProps: {
        description: 'ABCD',
        encryptionKey: new Key(stack, 'MyKey'),
      },
    });
  }).toThrow(Error);
});
it('Fails when cipherText is not provided', () => {
  // WHEN
  expect(() => {
    new EncryptedSecret(stack, 'MyConstruct', {
      keyId: 'arn:aws:kms:us-west-2:012345678901:key/483291fd-92ad-4dde-af8b-e4203b013258',
      secretProps: {
        description: 'ABCD',
        encryptionKey: new Key(stack, 'MyKey'),
      },
      ciphertextBlob: '',
    });
  }).toThrow(Error);
});
