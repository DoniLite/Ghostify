import { fixupConfigRules, fixupPluginRules } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import typescriptEslint from '@typescript-eslint/eslint-plugin'
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
})

export default defineConfig([
  globalIgnores([
    '**/tests',
    '**/static',
    '**/node_modules',
    '**/build',
    '**/dist',
    '**/dist-ssr',
    '**/.vscode',
    '**/public',
    '**/*.test.js',
    '**/*.test.jsx',
    '**/*.test.ts',
    '**/*.test.tsx'
  ]),
  {
    extends: fixupConfigRules(
      compat.extends(
        'plugin:react/recommended',
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'plugin:prettier/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:react/jsx-runtime'
      )
    ),

    plugins: {
      react: fixupPluginRules(react),
      '@typescript-eslint': fixupPluginRules(typescriptEslint),
      'react-hooks': fixupPluginRules(reactHooks)
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest
      },

      ecmaVersion: 12,
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },

    settings: {
      'import/resolver': {
        typescript: true,
        node: true
      },
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          alwaysTryTypes: true, // Always try to resolve types under `<root>@types` directory even if it doesn't contain any source code, like `@types/unist`

          bun: true, // Resolve Bun modules (https://github.com/import-js/eslint-import-resolver-typescript#bun)

          // Choose from one of the "project" configs below or omit to use <root>/tsconfig.json or <root>/jsconfig.json by default

          // Use <root>/path/to/folder/tsconfig.json or <root>/path/to/folder/jsconfig.json
          project: './tsconfig.json'
        })
      ]
    },

    rules: {
      'no-use-before-define': 'off',
      '@typescript-eslint/no-use-before-define': ['error'],

      'react/jsx-filename-extension': [
        'warn',
        {
          extensions: ['.tsx']
        }
      ],

      'import/extensions': [
        'error',
        'ignorePackages',
        {
          ts: 'never',
          tsx: 'never'
        }
      ],

      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': ['error'],

      //   '@typescript-eslint/explicit-function-return-type': [
      //     'error',
      //     {
      //       allowExpressions: true
      //     }
      //   ],

      'max-len': [
        'warn',
        {
          code: 100,
          ignoreComments: true,
          ignoreUrls: true
        }
      ],

      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'import/prefer-default-export': 'off',
      'react/prop-types': 'off',

      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto'
        }
      ]
    }
  }
])
