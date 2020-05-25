const Yup = require('utils/yup')

module.exports = (field = 'Filename') =>
  Yup.string()
    .trim()
    .min(10, `${field} must be longer than 10 characters`)
    .max(70, `${field} can't be longer than 70 characters`)
    .typeError(`${field} must be a string`)
