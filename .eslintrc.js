module.exports = {
  extends: [
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  rules: {
    'no-unused-vars': ['warn', { args: 'none' }],
  },
  /**
   * Default ESLint for TypeScript will complain about .js files not having types, which is a clearly problematic
   * default behaviour. We have to do this override mechanism to be able to specify the specific files we want
   * TypeScript linting to apply to. This overcomes the issue, while maintaining Prettier's default for `.js` files.
   *
   * If in the future ESLint fixes itself, we can remove this override capability and revert back to a simpler setup.
   */
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser', // Specifies the ESLint parser
      extends: [
        'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
        'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
      ],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off', // Provide convenience to use `any`
        '@typescript-eslint/no-unused-vars': ['warn', { args: 'none', ignoreRestSiblings: true }],
        'prefer-const': 0,
        '@typescript-eslint/no-non-null-assertion': 'off',
        'react/prop-types': 0, // Far less valuable in TypeScript
        '@typescript-eslint/explicit-module-boundary-types': 0,
        '@typescript-eslint/no-namespace': 'off',
      },
    },
  ],
};
