// const debug = require('debug')('app:utils:yup:getErrors')

/**
 * Validate and get error using yup
 *
 * @param {Object} schema yup schema
 * @param {Object} object object to validate against schema
 */
const getErrors = async (schema, object) => {
  if (await schema.isValid(object, { strict: true })) return false
  try {
    await schema.validate(object, { abortEarly: false, strict: true })
  } catch (error) {
    const res = { message: error.message, errors: {} }
    error.inner.forEach(({ path, message }) => {
      if (!Object.prototype.hasOwnProperty.call(res.errors, path)) res.errors[path] = []
      res.errors[path].push(message)
    })
    return res
  }
  return { message: 'Unknown validation error' }
}

module.exports = getErrors
