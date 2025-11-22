import globals from 'globals';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import stylistic from '@stylistic/eslint-plugin';
import hooksPlugin from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import pluginQuery from '@tanstack/eslint-plugin-query';
import perfectionist from 'eslint-plugin-perfectionist';

const rules = {
  'max-params': ['warn', 3],
  'max-lines': ['warn', 500],
  '@stylistic/jsx-indent': ['error', 2],
  '@stylistic/function-paren-newline': 0,
  'react/jsx-no-useless-fragment': 'off',
  '@stylistic/jsx-indent-props': ['error', 2],
  '@stylistic/max-len': ['error', { code: 140 }],
  '@stylistic/jsx-closing-tag-location': 'error',

  'no-console': ['warn', { allow: ['warn', 'error'] }],
  '@stylistic/comma-dangle': ['error', 'always-multiline'],
  // jsx
  '@stylistic/jsx-first-prop-new-line': ['error', 'multiline-multiprop'],
  'no-underscore-dangle': [
    2,
    {
      allowAfterThis: true,
    },
  ],
  '@stylistic/jsx-max-props-per-line': ['error', { maximum: 1, when: 'always' }],
  '@stylistic/jsx-closing-bracket-location': ['error', { selfClosing: 'line-aligned' }],

  '@stylistic/indent': [
    'error',
    2,
    {
      MemberExpression: 1,
      VariableDeclarator: 'first',
      FunctionDeclaration: { body: 1, parameters: 1 },
    },
  ],
  '@typescript-eslint/member-ordering': [
    'warn',
    {
      default: [
        'private-field',
        '#private-field',
        'public-field',
        'constructor',
        'public-method',
        'private-method',
        '#private-method',
      ],
    },
  ],
  '@typescript-eslint/explicit-member-accessibility': [
    'error',
    {
      accessibility: 'explicit',
      overrides: {
        properties: 'off',
        methods: 'explicit',
        accessors: 'explicit',
        constructors: 'no-public',
        parameterProperties: 'explicit',
      },
    },
  ],
};

export default tseslint.config(
    ...tseslint.config(eslint.configs.recommended, ...tseslint.configs.recommended),
    stylistic.configs.customize({
      jsx: true,
      indent: 2,
      semi: true,
    }),
    {
      plugins: {
        react: reactPlugin,
      },
      languageOptions: {
        ecmaVersion: 'latest',
        globals: {
          ...globals.browser,
        },
      },
    },
    {
      rules: hooksPlugin.configs.recommended.rules,
      plugins: {
        'react-hooks': hooksPlugin,
      },
    },
    {
      files: ['**/*.{js,ts}'],
      rules: {
        'prefer-const': 'error',
        ...rules,
      },
    },
    {
      files: ['**/*.{jsx,tsx}'],
      rules: {
        ...rules,
        'max-lines': ['warn', 200],
      },
    },
    {
      ignores: ['dist'],
    },
    { ignores: ['build'] },
    {
      plugins: {
        perfectionist,
        'react-refresh': reactRefresh,
        '@tanstack/query': pluginQuery,
      },
    },
    {
      rules: {
        'max-lines': 'off',
        'import/order': 'off',
        '@stylistic/max-len': 'off',
        '@stylistic/jsx-curly-brace-presence': 'off',

        'react-refresh/only-export-components': [
          'warn',
          { allowConstantExport: true },
        ],

        'perfectionist/sort-enums': [
          'error',
          {
            order: 'asc',
            type: 'line-length',
          },
        ],
        'perfectionist/sort-objects': [
          'error',
          {
            order: 'asc',
            type: 'line-length',
          },
        ],
        'perfectionist/sort-exports': [
          'error',
          {
            order: 'asc',
            type: 'line-length',
          },
        ],
        'perfectionist/sort-jsx-props': [
          'error',
          {
            order: 'asc',
            type: 'line-length',
          },
        ],
        'perfectionist/sort-interfaces': [
          'error',
          {
            order: 'asc',
            type: 'line-length',
          },
        ],
        'perfectionist/sort-union-types': [
          'error',
          {
            order: 'asc',
            type: 'line-length',
          },
        ],
        'perfectionist/sort-object-types': [
          'error',
          {
            order: 'asc',
            type: 'line-length',
          },
        ],
        'perfectionist/sort-named-exports': [
          'error',
          {
            order: 'asc',
            type: 'line-length',
          },
        ],
        'perfectionist/sort-named-imports': [
          'error',
          {
            order: 'asc',
            type: 'line-length',
          },
        ],
        'perfectionist/sort-astro-attributes': [
          'error',
          {
            order: 'asc',
            type: 'line-length',
          },
        ],
        'perfectionist/sort-array-includes': [
          'error',
          {
            'order': 'asc',
            'spread-last': true,
            'type': 'line-length',
          },
        ],
        'perfectionist/sort-imports': [
          'error',
          {
            'order': 'asc',
            'type': 'line-length',
            'internal-pattern': ['@/**'],
            'newlines-between': 'always',
            'groups': [
              ['react', 'react-type'], // (react, react-type, react-*),
              ['builtin', 'external'], // other libs
              ['internal', 'internal-type'], // other files
              ['app', 'app-type'],
              ['pages', 'pages-type'],
              ['widgets', 'widgets-type'],
              ['features', 'features-type'],
              ['entities', 'entities-type'],
              ['shared', 'shared-type'],
              'parent', // (../ ../../) ...
              'sibling', // (./)
              'side-effect', // ???
              'style', // (css, scss)
            ],
            'custom-groups': {
              value: {
                react: ['react'],
                app: ['@/app/**'],
                pages: ['@/pages/**'],
                shared: ['@/shared/**'],
                widgets: ['@/widgets/**'],
                features: ['@/features/**'],
                entities: ['@/entities/**'],
              },
              type: {
                'react-type': ['react'],
                'app-type': ['@/app/**'],
                'pages-type': ['@/pages/**'],
                'shared-type': ['@/shared/**'],
                'widgets-type': ['@/widgets/**'],
                'features-type': ['@/features/**'],
                'entities-type': ['@/entities/**'],
              },
            },
          },
        ],
      },
    },
);
