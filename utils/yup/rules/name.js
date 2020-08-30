const Yup = require('utils/yup')

module.exports = (title = 'Name', required = true) => {
  const min = 2
  const max = 70

  let schema = Yup.string()
    .typeError(`${title} must be a string`)
    .trim()
    .matches(/^[\S]*$/, `${title} must not contain any white space`)
    .min(min, `${title} must be longer than ${min} characters`)
    .max(max, `${title} can't be longer than ${max} characters`)

  if (required) schema = schema.required(`${title} is required`)

  return schema
}
