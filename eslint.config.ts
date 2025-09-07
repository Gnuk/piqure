import * as eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import * as tseslint from 'typescript-eslint';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';

export default defineConfig({ ignores: ['dist/**'] }, eslint.configs.recommended, tseslint.configs.recommended, {
  settings: {
    'import/resolver': [
      createTypeScriptImportResolver({
        alwaysTryTypes: true,
      }),
    ],
    rules: {
      'import/order': ['error', { alphabetize: { order: 'asc', caseInsensitive: true }, 'newlines-between': 'always' }],
    },
  },
});
