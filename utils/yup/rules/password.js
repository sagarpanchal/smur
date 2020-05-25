const Yup = require('utils/yup')

module.exports = (title = 'Password', required = true) => {
  let schema = Yup.string()
    .min(8, `${title} must be at least 8 characters long`)
    .max(16, `${title} can't be longer than 16 characters`)
    .matches(/[A-Z]/, `${title} must contain at least one uppercase character`)
    .matches(/[a-z]/, `${title} must contain at least one lowercase character`)
    .matches(/\d/, `${title} must contain at least one number`)
    .matches(/\W/, `${title} must contain at least one special character`)
    .typeError(`${title}  must be a string`)

  if (required) schema = schema.required(`${title} is required`)

  return schema
}
