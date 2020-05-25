const Yup = require('utils/yup')

module.exports = (title = 'number', options = {}, required = true) => {
  const defaultOptions = { min: 0 }
  const { min, max } = { ...defaultOptions, ...options }

  let schema = Yup.number().min(min, `${title} too low (${min} minimum)`)

  if (max) schema = schema.max(max, `${title} too high (${max} maximum)`)

  if (required) schema = schema.required(`${title} is required`)

  schema = schema.typeError(`${title} must be a string`)

  return schema
}
