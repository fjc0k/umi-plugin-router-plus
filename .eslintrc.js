/** @type import('haoma').ESLintConfig */
module.exports = {
  ...require('haoma').getESLintConfig(),
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
  },
}
