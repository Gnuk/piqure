import * as eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import { importX } from 'eslint-plugin-import-x';
import * as tseslint from 'typescript-eslint';

export default defineConfig({ ignores: ['dist/**'] }, eslint.configs.recommended, tseslint.configs.recommended, {
  plugins: { 'import-x': importX },
  settings: {
    'import-x/resolver-next': [
      createTypeScriptImportResolver({
        alwaysTryTypes: true,
      }),
    ],
  },
  rules: {
    '@typescript-eslint/consistent-type-imports': 'error',
    'import-x/order': ['error', { alphabetize: { order: 'asc', caseInsensitive: true }, 'newlines-between': 'always' }],
  },
});
