const debug = require('debug')('app:middleware:error:multer')
const MulterError = require('multer').MulterError
const httpErrors = require('utils/httpErrors')
const reportError = require('utils/reportError')(debug)

module.exports = (err, req, res, next) => {
  err instanceof MulterError
    ? (reportError(err, { log: false }), httpErrors.sendError(res, err.message))
    : next()
}
