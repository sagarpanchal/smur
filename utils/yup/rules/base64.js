const Yup = require('utils/yup')

module.exports = (title = 'File', required = true) => {
  let schema = Yup.string()
    .typeError(`${title} must be a string`)
    .matches(
      /^(data:){1}([-\w.]+\/[-\w.]+)+(;base64,){1}([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/,
      `${title} is invalid`
    )

  if (required) schema = schema.required(`${title} is required`)

  return schema
}
