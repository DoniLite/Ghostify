// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import tailwind from 'eslint-plugin-tailwindcss';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  ...tailwind.configs['flat/recommended'],
  {
    ignores: [
      // Ignorer completement le dossier .venv
      '.venv/',
      '.venv/**',
      '**/.venv/',
      '**/.venv/**',
      'python/',
      'python/**',

      // Autres fichiers à ignorer
      '**/*.d.ts',
      '**/*.config.ts',
      '**/*.config.js',
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/python/**',
    ],
    rules: {
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true,
        },
      ],
    },
    settings: {
      tailwindcss: {
        callees: ['classnames', 'clsx', 'ctl', 'class'],
        config: 'tailwind.config.js',
        cssFiles: [
          '**/*.css',
          '**/*.ejs',
          '!**/node_modules',
          '!**/.*',
          '!**/dist',
          '!**/build',
        ],
        cssFilesRefreshRate: 5_000,
        removeDuplicates: true,
        skipClassAttribute: false,
        whitelist: [],
        tags: [], // can be set to e.g. ['tw'] for use in tw`bg-blue`
        classRegex: '^class', // can be modified to support custom attributes. E.g. "^tw$" for `twin.macro`
      },
    },
  }
);
