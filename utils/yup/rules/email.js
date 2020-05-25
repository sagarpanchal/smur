const Yup = require('utils/yup')

module.exports = (title = 'Email', required = true) => {
  let schema = Yup.string().email(`${title} is invalid`)

  if (required) schema = schema.required(`${title} is required`)

  schema = schema.typeError(`${title} must be a string`)

  return schema
}
