const debug = require('debug')('app:middleware:error')

const { wentWrong } = require('utils/httpErrors')
const reportError = require('utils/reportError')(debug)

module.exports = (err, req, res, next) => {
  reportError(err)
  wentWrong(res)
  next()
}
