const Yup = require('utils/yup')

module.exports = (title = 'Username', required = true) => {
  let schema = Yup.string()
    .typeError(`${title} must be a string`)
    .trim()
    .matches(/^[0-9a-zA-Z]*$/, `${title} Username cannot include special characters`)
    .min(5, `${title} too short (5 character minimum)`)
    .max(16, `${title} too long (16 character maximum)`)

  if (required) schema = schema.required(`${title} is required`)

  return schema
}
