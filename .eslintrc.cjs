module.exports = {
  extends: ['mantine', 'plugin:@next/next/recommended', 'prettier'],
  plugins: ['react-hooks'],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'import/extensions': 'off',
    'css/no-global-function-names': 'off',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'off',
  },
  ignorePatterns: ['node_modules/*', 'dist/*', 'public/*'],
};
