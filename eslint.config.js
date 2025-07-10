import globals from 'globals';
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';

export default [
  {
    ignores: ['**/__tests__/*', '**/*.test.js'],
  },
  js.configs.recommended,
  prettier,
  {
    files: ['src/**/*.js', 'functions/**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        google: 'readonly',
        Chart: 'readonly',
        lucide: 'readonly',
      },
    },
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
    },
  },
  {
    files: ['**/*.test.js', '**/__tests__/*'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
  },
];