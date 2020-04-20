module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:sonarjs/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint', 'sonarjs'],
  parserOptions: {
    source: 'module',
    ecmaVersion: 2018,
  },
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    'no-control-regex': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    'sonarjs/cognitive-complexity': ['error', 20],
    'sort-imports': [
      'error',
      { ignoreDeclarationSort: true, ignoreCase: true },
    ],
    'prettier/prettier': 'warn',
  },
  ignorePatterns: ['*.d.ts', 'dist/*', '**/node_modules/*', 'lib/*', '*.js'],
  globals: {
    WeakSet: 'readonly',
    Promise: 'readonly',
    Reflect: 'readonly',
  },
};
