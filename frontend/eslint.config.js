import importHelpers from 'eslint-plugin-import-helpers';
import pluginPrettier from 'eslint-plugin-prettier';
import pluginReact from 'eslint-plugin-react';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

import js from '@eslint/js';

export default defineConfig([
    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        plugins: {
            prettier: pluginPrettier,
            'import-helpers': importHelpers,
            react: pluginReact,
        },
        rules: {
            ...js.configs.recommended.rules,
            ...tseslint.configs.recommended[0].rules,
            ...pluginReact.configs.flat.recommended.rules,

            'react/react-in-jsx-scope': 'off', // para projetos com React 17+
            '@typescript-elint/explicit-function-retunr': 'off',
            '@typescript-eslint/no-non-null-assertion': 'off',
            // Prettier como plugin
            // "prettier/prettier": "error",

            // Import Helpers
            'import-helpers/order-imports': [
                'warn',
                {
                    newlinesBetween: 'always',
                    groups: [
                        '/^react/',
                        'module',
                        '/^@/',
                        ['parent', 'sibling', 'index'],
                    ],
                    alphabetize: { order: 'asc', ignoreCase: true },
                },
            ],
        },
    },
]);
