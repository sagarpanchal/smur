const debug = require('debug')('app:utils:factories:asyncError')
const reportError = require('utils/reportError')(debug)

/**
 * Handles exceptions in async function
 * @param   {Function} func
 * @param   {Object}   options
 * @returns {Promise}
 */
const asyncHandler = async (func, options = {}) => {
  try {
    return await func()
  } catch (error) {
    const { report, reportOptions } = { report: true, ...options }
    return report ? reportError(error, reportOptions) : false
  }
}

module.exports = asyncHandler
