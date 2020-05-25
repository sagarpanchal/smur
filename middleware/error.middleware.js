const debug = require('debug')('app:middleware:error')
const reportError = require('utils/reportError')(debug)
const { wentWrong } = require('utils/httpErrors')

module.exports = (err, req, res, next) => {
  reportError(err)
  wentWrong(res)
  next()
}
