const Yup = require('utils/yup')

module.exports = (title = 'ObjectId', required = true) => {
  let schema = Yup.string() //
    .objectId(`Invalid ${title}`)
    .typeError(`${title} must be a string`)

  if (required) schema = schema.required(`${title} is required`)

  return schema
}
