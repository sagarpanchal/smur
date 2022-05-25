const Yup = require('utils/yup')

const objectIdSchema = require('./objectId')

module.exports = (title = 'ObjectId', required = true) => {
  let schema = Yup.array(objectIdSchema(title, required))
    .unique(`All ${title} must be unique`)
    .typeError(`${title} must be an array`)

  if (required) schema = schema.required(`${title} is required`)

  return schema
}
