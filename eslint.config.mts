import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginJson from '@eslint/json';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  { ignores: ['**/dist/*'] },
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.node } },
  pluginJson.configs.recommended,
  pluginJs.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
  stylistic.configs.customize({
    semi: true,
    braceStyle: '1tbs',
  }),
  { rules: {
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
    '@typescript-eslint/require-await': 'off',
    '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
  } },
]);
