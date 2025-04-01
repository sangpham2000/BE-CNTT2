// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';
// Sửa cách import cho eslint-plugin-import
import * as importPlugin from 'eslint-plugin-import';
// Sửa cách import cho eslint-plugin-nestjs (nếu có lỗi tương tự)
import * as nestPlugin from 'eslint-plugin-nestjs';

export default tseslint.config(
  // Ignore build files and config files
  {
    ignores: [
      'eslint.config.mjs',
      'dist/**',
      'node_modules/**',
      'coverage/**',
      '**/*.js',
    ],
  },
  
  // Base configurations
  eslint.configs.recommended,
  
  // TypeScript configurations
  ...tseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  
  // Prettier integration
  prettierConfig,
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
  
  // Import plugin
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/order': [
        'error',
        {
          'groups': [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling'],
            'index',
          ],
          'newlines-between': 'always',
          'alphabetize': { order: 'asc', caseInsensitive: true },
        },
      ],
    }
  },
  
  // NestJS specific rules
  {
    plugins: {
      nestjs: nestPlugin,
    },
    rules: {
      'nestjs/use-validation-pipe': 'error',
      'nestjs/controller-methods-should-be-guarded': 'warn',
    }
  },
  
  // Language options
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      // Sử dụng phiên bản ECMAScript hiện đại hơn để hỗ trợ các tính năng mới
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          impliedStrict: true,
        },
      },
    },
  },
  
  // Custom rules
  {
    rules: {
      // TypeScript rules
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/explicit-function-return-type': ['warn', {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
      }],
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      
      // General rules
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'max-len': ['warn', { 
        code: 100, 
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreComments: true,
      }],
      'complexity': ['warn', 10],
    },
  },
  
  // File-specific overrides
  {
    files: ['**/*.spec.ts', '**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'max-len': 'off',
    },
  },
  {
    files: ['**/main.ts'],
    rules: {
      'no-console': 'off',
    },
  },
);