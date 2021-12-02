module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'react-app', // extends Create React App eslint config
    'plugin:@typescript-eslint/recommended', // Plugin to use typescript with eslint
    'prettier', // Add prettier rules to eslint
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
  },
};
