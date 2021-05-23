const debug = require('debug')('app:error')
const path = require('path')
const chalk = require('chalk')
const logger = require('utils/winston/logger')
const { getFileName } = require('utils/winston/JsonTransport')
const _r = (n) => '-'.repeat(n)

/**
 * Logs and reports exceptions
 * @param {object} _debug debug function
 */
const reportError =
  (_debug = debug) =>
  (error, options = {}) => {
    options = { log: true, return: false, ...options }
    error = typeof error === 'object' ? error : new Error('UndefinedErrorError')
    const returnError = options.return ? error : false

    if (options.log) logger.error('', error)
    if (!debug.enabled) return returnError

    const stackArray = error.stack.split('\n')
    const query = encodeURI(stackArray[0])
    error.stack = stackArray
      .map((line, i) =>
        i == 0 || (!line.includes('node_modules') && line.includes(process.cwd())) ? line : chalk.gray(line)
      )
      .join('\n')

    const msg = [
      chalk.red(_r(60)),
      error,
      chalk.red(`${_r(19)} Something went wrong ${_r(19)}`),
      chalk.red(`${_r(18)} Check logs for details ${_r(18)}`),
      chalk.red(path.join(__dirname, '..', getFileName())),
      chalk.green(`https://stackoverflow.com/search?q=${query}`),
    ]
    msg.forEach((l) => _debug(l))

    return returnError
  }

module.exports = reportError
