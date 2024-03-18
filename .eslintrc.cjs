module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: ['plugin:svelte/base', 'standard-with-typescript'],
	plugins: ['@typescript-eslint'],
	overrides: [{ files: ['*.svelte'], parser: 'svelte-eslint-parser', parserOptions: { parser: '@typescript-eslint/parser' } }],
  rules: {
    'import/first': 'off',
		'no-multiple-empty-lines': 'off',
    'no-undef-init': 'off',
		'no-unused-vars': 'off',
		'no-use-before-define': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/array-type': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/no-unsafe-argument': 'off', // too many false positives in svelte
    '@typescript-eslint/no-unused-vars': 'off', // typescript does this better
    '@typescript-eslint/require-await': 'off',
		'@typescript-eslint/prefer-nullish-coalescing': 'off', // not compatible with strictNullChecks disabled
    '@typescript-eslint/return-await': ['error', 'always'],
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/prefer-readonly': ['off']
  },
	parserOptions: {
		project: './tsconfig.json',
		sourceType: 'module',
		extraFileExtensions: ['.svelte'],
		ecmaVersion: 2020
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	}
};
