require('dotenv').config()
const config = require('config')
const debug = require('debug')('app:index.js')
const express = require('express')
const mongoose = require('mongoose')
const open = require('open')
require('express-async-errors')

const errorMiddleware = require('middleware/error.middleware')
const middleware = require('middleware/middleware')
const preloadModels = require('models/preloadModels')
const routes = require('routes/routes')
const cli = require('utils/cli')
const createServer = require('utils/createServer')
const asyncHandler = require('utils/factories/asyncError')
const setupPassport = require('utils/passport/setupPassport')
const reportError = require('utils/reportError')(debug)
const { isFunction } = require('utils/utils')

const app = express()
const server = createServer(app)

const DB = config.get('mongodb.db')
const PORT = config.get('port')

const stop = (...args) => {
  debug(`${args.join(' ')}`)
  if (isFunction(mongoose?.disconnect)) mongoose.disconnect()
  if (isFunction(server?.close)) server.close()
}

const start = () => {
  asyncHandler(async () => {
    // connect to database
    await mongoose.connect(DB, {
      ...config.get('mongodb.options'),
      ...config.get('mongoose'),
    })
    preloadModels()
    setupPassport()

    // Required middlewares
    app.use(middleware())

    // Api Routes
    app.use('/api', routes)

    // Ping
    app.use('/ping', (req, res) => res.send('pong'))

    // Error handling middleware
    app.use(errorMiddleware)

    // Redirect to frontend located in 'public/'
    app.get(express.static('./public'))
    app.get('*', (req, res) => res.sendFile('index.html', { root: './public' }))

    // Start listening to requests
    server.listen(config.get('port'))
  })
}

mongoose.connection
  .on('connected', () => debug(cli.messages.databaseConnected(DB)))
  .on('disconnected', () => debug(cli.messages.databaseDisconnected(DB)))

server
  .on('listening', () => debug(cli.messages.serverListening(PORT)))
  .on('close', () => debug(cli.messages.serverClosed(PORT)))

process
  .on('SIGHUP', stop)
  .on('SIGINT', stop)
  .on('SIGTERM', stop)
  .on('beforeExit', stop)
  .on('uncaughtException', reportError)
  .on('unhandledRejection', reportError)

if (config.get('env') === 'development') {
  if (process.env.INIT === '0') {
    server.on('listening', () => {
      // Serve openapi docs in browser
      open(`${config.get('publicUrl')}/api/docs`)
    })
  }
}

start()
