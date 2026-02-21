import { defineConfig } from 'eslint/config';
import checkFile from 'eslint-plugin-check-file';

const eslintConfig = defineConfig([
  // Base project rules for a Node.js repository
  {
    extends: ['plugin:prettier/recommended'],
    plugins: {
      'check-file': checkFile,
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
    rules: {
      'prettier/prettier': 'error',
      // Best-practice rules
      'consistent-return': 'error',
      'no-implicit-coercion': 'error',
      'no-magic-numbers': ['warn', { ignore: [0, 1, -1], ignoreArrayIndexes: true }],
      'complexity': ['warn', { max: 12 }],
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
  },
  // Global ignore patterns
  {
    ignores: ['node_modules/**', '.git/**', 'dist/**'],
  },
]);

export default eslintConfig;
