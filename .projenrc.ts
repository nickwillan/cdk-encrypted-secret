import { awscdk } from 'projen';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Nick Willan',
  authorAddress: 'https://github.com/nickwillan',
  keywords: ['aws', 'cdk', 'secrets', 'kms'],
  description:
    'CDK Construct that creates an AWS Secret Manager Secret and sets the value from an encrypted Ciphertext.',
  majorVersion: 1,
  cdkVersion: '2.177.0',
  constructsVersion: '10.4.2',
  defaultReleaseBranch: 'main',
  jsiiVersion: '5.8.x',
  name: 'cdk-encrypted-secret',
  projenrcTs: true,
  repositoryUrl: 'https://github.com/nickwillan/cdk-encrypted-secret.git',
  bundledDeps: ['@aws-sdk/util-arn-parser', '@aws-sdk/client-secrets-manager', '@aws-sdk/client-kms'],
  deps: ['@aws-sdk/util-arn-parser', '@aws-sdk/client-secrets-manager', '@aws-sdk/client-kms'],
  /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  devDeps: ['aws-sdk-client-mock'] /* Build dependencies for this module. */,
  // packageName: undefined,  /* The "name" in package.json. */
  eslint: true,
  depsUpgradeOptions: {
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
    },
  },
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
    allowedUsernames: ['nickwillan'],
  },
  gitignore: [
    'cdk.out',
    '.cdk.staging',
    // For Mavn GPG
    'public.pem',
    'private.pem',
    // For Python demo
    '*.swp',
    'package-lock.json',
    '__pycache__',
    '.pytest_cache',
    '.env',
    '.venv',
    '*.egg-info',
    // For Java demo
    '.classpath.txt',
    'target/',
    '.classpath',
    '.project',
    '.idea',
    '.settings',
    '*.iml',
  ],
  releaseToNpm: true,
});
project.synth();
