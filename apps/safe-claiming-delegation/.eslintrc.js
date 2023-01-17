module.exports = {
  extends: ['../../.estlint.js', 'next/core-web-vitals'],
  rules: {
    '@next/next/no-img-element': 'off',
    '@typescript-eslint/consistent-type-imports': 'error',
    'no-constant-condition': 'warn',
  },
  ignorePatterns: ['node_modules/', '.next/', '.github/', 'src/types/contracts'],
}
