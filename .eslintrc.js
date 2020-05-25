module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
    jest: true,
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    'no-console': 1,
    'no-unused-vars': 1,
    'no-useless-escape': 0,
    'require-atomic-updates': 0,
  },
}
