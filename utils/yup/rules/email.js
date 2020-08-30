const Yup = require('utils/yup')

module.exports = (title = 'Email', required = true) => {
  let schema = Yup.string() //
    .typeError(`${title} must be a string`)
    .email(`${title} is invalid`)

  if (required) schema = schema.required(`${title} is required`)

  return schema
}
