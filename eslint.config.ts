import { defineConfig } from 'eslint/config'
import typescriptEslint from 'typescript-eslint'
import * as nPlugin from 'eslint-plugin-n'
import * as prettier from 'eslint-config-prettier'
import * as importPlugin from 'eslint-plugin-import'
import * as globals from 'globals'

export default defineConfig([
  {
    ignores: ['**/dist/**', '*.config.ts'],
  },
  ...typescriptEslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parser: typescriptEslint.parser,
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslint.plugin,
      import: importPlugin,
      n: nPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    rules: {
      ...prettier.rules,
      ...importPlugin.configs.typescript.rules,
      ...nPlugin.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'n/hashbang': 'off',
      'n/no-process-exit': 'off',
      'n/no-unsupported-features/es-syntax': [
        'error',
        {
          ignores: ['modules'],
        },
      ],
      'no-useless-catch': 'warn',
      'no-unused-vars': 'off',
      'n/no-missing-import': 'off',
    },
  },
])
