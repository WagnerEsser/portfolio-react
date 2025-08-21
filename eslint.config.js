import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { globalIgnores } from 'eslint/config';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import prettierPlugin from 'eslint-plugin-prettier';

export default tseslint.config([
  globalIgnores(['dist']),
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    plugins: {
      react,
      prettier: prettierPlugin,
      'jsx-a11y': jsxA11y,
      'simple-import-sort': simpleImportSort,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Geral
      eqeqeq: 'warn',
      'no-console': ['error', { allow: ['warn', 'clear', 'info', 'error', 'dir', 'trace'] }],
      'no-restricted-imports': ['warn', { patterns: ['../*'] }],
      'no-cond-assign': ['error', 'always'],

      // React
      'react/prop-types': 'off',
      'react/jsx-uses-vars': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'react/hook-use-state': 'error',
      'react/destructuring-assignment': 'off',
      'react/jsx-boolean-value': 'error',
      'react/jsx-curly-brace-presence': 'error',
      'react/jsx-no-constructed-context-values': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-target-blank': 'error',
      'react/jsx-no-useless-fragment': 'error',
      'react/display-name': 'off',
      'react/jsx-sort-props': [
        'error',
        {
          shorthandFirst: true,
          multiline: 'last',
          callbacksLast: true,
          noSortAlphabetically: true,
          reservedFirst: true,
        },
      ],
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
      'react/jsx-pascal-case': [
        'error',
        {
          allowAllCaps: false,
          allowLeadingUnderscore: false,
          allowNamespace: false,
        },
      ],

      // Prettier
      'prettier/prettier': ['error', { endOfLine: 'auto', arrowParens: 'avoid' }],

      // Acessibilidade
      'jsx-a11y/anchor-is-valid': 'error',

      // Imports
      'simple-import-sort/imports': [
        'error',
        {
          groups: [['^react(.*)$'], ['^(?!@|^./|^../).*'], ['@(.*)'], ['^[../]'], ['^[./]']],
        },
      ],

      // Variáveis
      '@typescript-eslint/no-unused-vars': ['error'],
      '@typescript-eslint/no-use-before-define': ['error'],
    },
  },
]);
