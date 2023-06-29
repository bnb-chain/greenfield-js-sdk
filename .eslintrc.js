module.exports = {
  root: true,
  extends: ['plugin:@typescript-eslint/recommended'],
  rules: {
    'no-console': 2,
    'react/react-in-jsx-scope': ['off'],
    '@typescript-eslint/ban-ts-comment': 'off',
  },
  plugins: ['prettier', '@typescript-eslint'],
};
