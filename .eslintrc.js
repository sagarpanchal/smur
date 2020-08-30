module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': 1,
    'no-unused-vars': 1,
  },
}
