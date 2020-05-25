const Yup = require('utils/yup')

module.exports = (title = 'number', required = true) => {
  let schema = Yup.date()

  if (required) schema = schema.required(`${title} is required`)

  schema = schema.typeError(`${title} must be a date`)

  return schema
}
