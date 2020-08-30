const Yup = require('utils/yup')

module.exports = (title = 'number', required = true) => {
  let schema = Yup.date().typeError(`${title} must be a date`)

  if (required) schema = schema.required(`${title} is required`)

  return schema
}
