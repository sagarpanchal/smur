const config = require('config')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const passport = require('passport')
const json = require('./json.middleware')
const { static } = require('express')

const middleware = []

if (config.get('env') === 'development') {
  const chalk = require('chalk')
  const debug = require('debug')('app:http')
  const writeReq = { write: (m) => debug(chalk.cyan(`▶ ${m.trim()}`)) }
  const writeRes = { write: (m) => debug(chalk.green(`◀ ${m.trim()}`)) }
  middleware.push(morgan('short', { immediate: true, stream: writeReq }))
  middleware.push(morgan('short', { immediate: false, stream: writeRes }))
  middleware.push(cors())
}
middleware.push(helmet())
middleware.push(compression())
middleware.push(json())
middleware.push(passport.initialize())
middleware.push(static('./public'))
middleware.push(
  (req, res, next) => (
    (req.auth = {
      user: undefined,
      session: undefined,
      token: undefined,
    }),
    next()
  )
)

module.exports = middleware
