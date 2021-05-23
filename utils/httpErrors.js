const debug = require('debug')('app:utils:httpErrors')
const { isObject } = require('./utils')

/**
 * 400 - BadRequest
 *
 * @param {Object} res express reponse object
 * @param {*} message response message
 */
exports.badRequest = (res, message = 'Bad request') => {
  message = isObject(message) ? message : { message }
  debug(message)
  return res.status(400).json(message)
}

/**
 * 401 - Unauthorized
 *
 * @param {Object} res express reponse object
 * @param {*} message response message
 */
exports.unauthorized = (res, message = 'Unauthorized') => {
  message = isObject(message) ? message : { message }
  debug(message)
  return res.status(401).json(message)
}

/**
 * 401 - Invalid Token
 *
 * @param {Object} res express reponse object
 * @param {*} message response message
 */
exports.invalidToken = (res) => module.exports.unauthorized(res, 'Invalid Token')

/**
 * 403 - AccessDenied
 *
 * @param {Object} res express reponse object
 * @param {*} message response message
 */
exports.accessDenied = (res, message = 'Forbidden') => {
  message = isObject(message) ? message : { message }
  debug(message)
  return res.status(403).json(message)
}

/**
 * 404 - NotFound
 *
 * @param {Object} res express reponse object
 * @param {String} resourceName response message
 */
exports.notFound = (res, resourceName = undefined) => {
  const message = resourceName ? `${resourceName} not found` : 'Not Found'
  return res.status(404).json({ message })
}

/**
 * 409 - Conflict
 *
 * @param {Object} res express reponse object
 * @param {*} message response message
 */
exports.conflict = (res, message = 'Conflict') => {
  message = isObject(message) ? message : { message }
  debug(message)
  return res.status(409).json(message)
}

/**
 * 413 - PayloadTooLarge
 *
 * @param {Object} res express reponse object
 * @param {*} message response message
 */
exports.payloadTooLarge = (res, message = undefined) => {
  message = typeof message === 'object' ? message : { message: message ? `${message} too large` : 'Payload too large' }
  debug(message)
  return res.status(413).json(message)
}

/**
 * 415 - UnsupportedMediaType
 *
 * @param {Object} res express reponse object
 * @param {*} message response message
 */
exports.unsupportedMediaType = (res, message = 'Unsupported media type') => {
  message = isObject(message) ? message : { message }
  debug(message)
  return res.status(415).json(message)
}

/**
 * Send any error (default status is 422)
 *
 * @param {Object} res express reponse object
 * @param {*} message response message
 * @param {Number} status response status
 */
exports.sendError = (res, message = 'Unprocessable entity', status = 422) => {
  message = isObject(message) ? message : { message }
  debug(message)
  return res.status(status).json(message)
}

/**
 * 500 - InternalServerError
 *
 * @param {Object} res express reponse object
 * @param {*} message response message
 */
exports.wentWrong = (res, message = 'Something went wrong') => {
  message = isObject(message) ? message : { message }
  debug(message)
  return res.status(500).json(message)
}
