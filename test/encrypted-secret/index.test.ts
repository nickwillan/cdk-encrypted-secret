import { Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { EncryptedSecret } from '../../src/index';
import { Key } from 'aws-cdk-lib/aws-kms';

let stack: Stack;

beforeEach(() => {
  stack = new Stack();
});

it('create a EncryptedSecret', () => {
  // WHEN
  new EncryptedSecret(stack, 'MyConstruct', {
    cipherText: 'foobar',
    kmsKeyArn: 'arn:aws:kms:us-west-2:012345678901:key/483291fd-92ad-4dde-af8b-e4203b013258',
    secretProps: {
      description: 'ABCD',
      encryptionKey: new Key(stack, 'MyKey'),
    },
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('Custom::AWS', {});
  Template.fromStack(stack).hasResourceProperties('AWS::SecretsManager::Secret', { Description: 'ABCD' });
});

it('Creates when encryption key is not provided', () => {
  // WHEN

  new EncryptedSecret(stack, 'MyConstruct', {
    cipherText: 'foobar',
    kmsKeyArn: 'arn:aws:kms:us-west-2:012345678901:key/483291fd-92ad-4dde-af8b-e4203b013258',
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
      cipherText: 'foobar',
      kmsKeyArn: 'asdfasdf',
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
      kmsKeyArn: 'arn:aws:kms:us-west-2:012345678901:key/483291fd-92ad-4dde-af8b-e4203b013258',
      secretProps: {
        description: 'ABCD',
        encryptionKey: new Key(stack, 'MyKey'),
      },
      cipherText: '',
    });
  }).toThrow(Error);
});
