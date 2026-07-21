const tsPlugin = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  {
    ignores: ['lib/**', 'node_modules/**']
  },
  ...tsPlugin.configs['flat/recommended'],
  {
    languageOptions: {
      parser: tsParser,
      sourceType: 'module',
      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname
      },
      globals: {
        browser: true,
        es6: true
      }
    },
    rules: {
      '@typescript-eslint/adjacent-overload-signatures': 'error',
      '@typescript-eslint/no-empty-function': 'error',
      '@typescript-eslint/no-empty-interface': 'warn',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-namespace': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/prefer-for-of': 'warn',
      '@typescript-eslint/triple-slash-reference': 'error',
      '@typescript-eslint/unified-signatures': 'warn',
      'comma-dangle': 'warn',
      'constructor-super': 'error',
      eqeqeq: ['warn', 'always'],
      'no-cond-assign': 'error',
      'no-duplicate-case': 'error',
      'no-duplicate-imports': 'error',
      'no-empty': [
        'error',
        {
          allowEmptyCatch: true
        }
      ],
      'no-invalid-this': 'error',
      'no-new-wrappers': 'error',
      'no-redeclare': 'error',
      'no-sequences': 'error',
      'no-shadow': [
        'error',
        {
          hoist: 'all'
        }
      ],
      'no-throw-literal': 'error',
      'no-unsafe-finally': 'error',
      'no-unused-labels': 'error',
      'no-var': 'warn',
      'no-void': 'error',
      'prefer-const': 'warn'
    }
  },
  prettierConfig
];
