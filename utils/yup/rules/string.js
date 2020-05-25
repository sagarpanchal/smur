const Yup = require('utils/yup')

module.exports = (title = 'String', options = {}, required = true) => {
  const { min, max } = options

  let schema = Yup.string().typeError(`${title} must be a string`).trim()

  if (min) schema = schema.min(min, `${title} must be longer than ${min} characters`)

  if (max) schema = schema.max(max, `${title} can't be longer than ${max} characters`)

  if (required) schema = schema.required(`${title} is required`)

  return schema
}
