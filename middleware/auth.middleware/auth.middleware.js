// const debug = require('debug')('app:middleware:auth')
const httpErrors = require('utils/httpErrors')

const verifySession = require('./_verifySession')

module.exports = async (req, res, next) => {
  if (!req.header('authorization')) return httpErrors.unauthorized(res)

  const auth = await verifySession(req.header('authorization'))
  if (!auth) return httpErrors.invalidToken(res)

  req.auth = { ...req.auth, ...auth }
  next()
}
