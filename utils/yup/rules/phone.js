const Yup = require('utils/yup')

module.exports = (title = 'Phone number', required = true) => {
  let schema = Yup.string().matches(/^(\+1\s)?([\d]{3}-{1}){2}(\d){4}$/, `${title} is invalid`)

  if (required) schema = schema.required(`${title} is required`)

  schema = schema.typeError(`${title} must be a string`)

  return schema
}
