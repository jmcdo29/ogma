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
    // 'max-len': ['error', { code: 80, ignoreTemplateLiterals: true }],
    'no-control-regex': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
  },
  ignorePatterns: ['*.d.ts', 'dist/*'],
  globals: {
    WeakSet: 'readonly',
    Promise: 'readonly',
  },
};
