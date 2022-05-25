const userTypes = require('utils/constants/userTypes.consts')

const Yup = require('utils/yup')

module.exports = (title = 'Type', required = true) => {
  let schema = Yup.array(
    Yup.string()
      .typeError(`Elements of ${title} must be string`)
      .test('type', `${title} is invalid`, (value) => Object.values(userTypes).includes(value))
  ).typeError(`${title} must be an array`)

  if (required) schema = schema.required(`${title} is required`)

  return schema
}
