import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config({ ignores: ['node_modules', 'dist'] }, js.configs.recommended, ...tseslint.configs.recommended, {
  rules: {
    'no-restricted-syntax': ['error', { selector: 'ClassDeclaration', message: 'Use factories, not classes.' }],
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
  },
});
