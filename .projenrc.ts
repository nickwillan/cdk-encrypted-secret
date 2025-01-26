import { awscdk } from 'projen';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Nick Willan',
  authorAddress: 'nickwillan@gmail.com',
  majorVersion: 1,
  cdkVersion: '2.177.0',
  constructsVersion: '10.4.2',
  defaultReleaseBranch: 'main',
  jsiiVersion: '~5.7.2',
  name: 'cdk-encrypted-secret',
  projenrcTs: true,
  repositoryUrl: 'https://github.com/nickwillan/cdk-encrypted-secret.git',
  bundledDeps: ['@aws-sdk/util-arn-parser', '@aws-sdk/client-secrets-manager', '@aws-sdk/client-kms'],
  deps: ['@aws-sdk/util-arn-parser', '@aws-sdk/client-secrets-manager', '@aws-sdk/client-kms'],
  /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  devDeps: ['aws-sdk-client-mock'] /* Build dependencies for this module. */,
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();
