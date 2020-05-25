const fs = require('fs')
const jwt = require('jsonwebtoken')
const debug = require('debug')('app:utils:jwt')
const reportError = require('utils/reportError')(debug)

const rsaPrivatePath = './.keys/jwt_rsa.key'
const rsaPublicPath = './.keys/jwt_rsa.key.pub'
const rsaPrivate = fs.readFileSync(rsaPrivatePath)
const rsaPublic = fs.readFileSync(rsaPublicPath)

/**
 * Generate jsonwebtoken from object
 *
 * @param {Object} object object
 */
const generate = async (object) => {
  try {
    return jwt.sign(object, rsaPrivate, { algorithm: 'RS256' })
  } catch (error) {
    return reportError(error.message)
  }
}

/**
 * Verify jsonwebtoken token
 *
 * @param {string} token jsonwebtoken token
 */
const verify = async (token) => {
  try {
    return jwt.verify(token, rsaPublic, { algorithm: 'RS256' })
  } catch (error) {
    return reportError(error.message)
  }
}

module.exports = { rsaPrivatePath, rsaPublicPath, generate, verify }
