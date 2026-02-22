/** @type {import('eslint').FlatConfig[]} */
module.exports = [
  // base configuration object
  {
    plugins: {
      // prettier plugin for formatting
      prettier: require('eslint-plugin-prettier'),
    },
    rules: {
      'prettier/prettier': 'error',
      'consistent-return': 'error',
      'no-implicit-coercion': 'error',
      'no-empty-function': 'warn',
      'prefer-template': 'error',
      'no-prototype-builtins': 'error',
      'no-duplicate-imports': 'error',
      'prefer-arrow-callback': 'error',
      'func-style': ['error', 'expression'],
      'arrow-body-style': ['error', 'as-needed'],
      'eqeqeq': ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',
      'curly': ['error', 'all'],
      'no-console': 'warn',
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
  },
  {
    ignores: ['node_modules/**', '.git/**', 'frontend/dist/**', 'dist/**'],
  },
];
