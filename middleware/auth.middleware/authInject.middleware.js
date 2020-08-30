// const debug = require('debug')('app:middleware:auth:token-injector')
const verifySession = require('./_verifySession')

module.exports = async (req, res, next) => {
  const auth = await verifySession(req.header('authorization'))
  if (auth) req.auth = { ...req.auth, ...auth }

  next()
}
