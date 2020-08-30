const Yup = require('utils/yup')

module.exports = (title = 'number', options = {}, required = true) => {
  const defaultOptions = { min: undefined, max: undefined }
  const { min, max } = { ...defaultOptions, ...options }

  let schema = Yup.number()
    .typeError(`${title} must be a number`)
    .matches(/^[0-9]*$/, `${title} must be a number`)

  if (min) schema = schema.min(min, `${title} too low (${min} minimum)`)

  if (max) schema = schema.max(max, `${title} too high (${max} maximum)`)

  if (required) schema = schema.required(`${title} is required`)

  return schema
}
