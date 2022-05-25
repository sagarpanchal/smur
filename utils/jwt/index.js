const debug = require('debug')('app:utils:jwt')
const fse = require('fs-extra')
const jwt = require('jsonwebtoken')

const reportError = require('utils/reportError')(debug)
const { catchError } = require('utils/utils')

const rsaPrivatePath = './.keys/jwt_rsa.key'
const rsaPublicPath = './.keys/jwt_rsa.key.pub'

const rsaPrivate = catchError(() => fse.readFileSync(rsaPrivatePath))
const rsaPublic = catchError(() => fse.readFileSync(rsaPublicPath))

/**
 * Generate jsonwebtoken from object
 *
 * @param {Object} object object
 */
const generate = async (object, options) => {
  const secret = rsaPrivate ?? options?.secret
  try {
    return jwt.sign(object, secret, { algorithm: 'RS256' })
  } catch (error) {
    return reportError(error.message)
  }
}

/**
 * Verify jsonwebtoken token
 *
 * @param {string} token jsonwebtoken token
 */
const verify = async (token, options) => {
  const secret = rsaPublic ?? options?.secret
  try {
    return jwt.verify(token, secret, { algorithm: 'RS256' })
  } catch (error) {
    return reportError(error.message)
  }
}

module.exports = { rsaPrivatePath, rsaPublicPath, generate, verify }
