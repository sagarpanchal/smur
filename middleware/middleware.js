const compression = require('compression')
const config = require('config')
const cors = require('cors')
const helmet = require('helmet')
const passport = require('passport')

const { isArray, isEmpty } = require('utils/utils')

const json = require('./json.middleware')

const middleware = []

if (config.get('env') === 'development') {
  const morgan = require('morgan')
  const chalk = require('chalk')
  const debug = require('debug')('app:http')

  const writeReq = { write: (m) => debug(chalk.cyan(`▶ ${m.trim()}`)) }
  const writeRes = { write: (m) => debug(chalk.green(`◀ ${m.trim()}`)) }

  middleware.push(morgan('short', { immediate: true, stream: writeReq }))
  middleware.push(morgan('short', { immediate: false, stream: writeRes }))
  middleware.push(cors())
}

if (config.get('env') === 'production') {
  const corsOrigins = config.get('corsOrigins')

  if (isArray(corsOrigins) && !isEmpty(corsOrigins)) {
    const origin = (origin, callback) => {
      corsOrigins.includes(origin)
        ? callback(null, true)
        : callback(new Error('Resource Sharing Not allowed by CORS Policy'))
    }
    middleware.push(cors({ origin }))
  }
}

middleware.push(helmet())
middleware.push(compression())
middleware.push(json())
middleware.push(passport.initialize())
middleware.push((req, res, next) => {
  req.auth = {
    user: undefined,
    session: undefined,
    token: undefined,
  }
  next()
})

module.exports = () => middleware
