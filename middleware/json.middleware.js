const { json } = require('express')
const { badRequest } = require('utils/httpErrors')

/**
 * Json json middleware
 *
 * @param {bodyParser.Options} options
 */
const jsonMiddleware = (options = null) => [
  json(options),
  (err, req, res, next) => (err instanceof SyntaxError ? badRequest(res, 'Invalid request body') : next()),
]

module.exports = jsonMiddleware
