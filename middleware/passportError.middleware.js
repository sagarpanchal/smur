const debug = require('debug')('app:middleware:error:passport')
const passportOAuth2 = require('passport-oauth2')

const httpErrors = require('utils/httpErrors')
const reportError = require('utils/reportError')(debug)

module.exports = (err, req, res, next) => {
  err instanceof passportOAuth2.TokenError ||
  err instanceof passportOAuth2.AuthorizationError ||
  err instanceof passportOAuth2.InternalOAuthError
    ? (reportError(err, { log: false }), httpErrors.sendError(res, err.message))
    : next()
}
