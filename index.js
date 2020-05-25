require('dotenv').config()
const debug = require('debug')('app:index.js')
const http = require('http')
const config = require('config')
const express = require('express')
const mongoose = require('mongoose')
require('express-async-errors')

const models = require('models')
const routes = require('routes')
const middleware = require('middleware')
const errorMiddleware = require('middleware/error.middleware')

const passportUtils = require('utils/passport')
const asyncHandler = require('utils/factories/asyncError')
const reportError = require('utils/reportError')(debug)
const cli = require('utils/cli')

const app = express()
const server = http.createServer(app)

const DB = config.get('mongodb.db')
const PORT = config.get('port')

const stop = (...args) => {
  debug(`${args.join(' ')}`)
  mongoose.disconnect()
  server.close()
}

const start = () =>
  asyncHandler(async () => {
    // connect to database
    await mongoose.connect(DB, {
      ...config.get('mongodb.options'),
      ...config.get('mongoose'),
    })
    models.preload()
    passportUtils.setup()

    // Required middlewares
    app.use(middleware)

    // Api Routes
    app.use('/api', routes)

    // Error handling middleware
    app.use(errorMiddleware)

    // Redirect to frontend located in 'public/'
    app.get('*', (req, res) => res.sendFile('index.html', { root: './public' }))

    // Start listening to requests
    server.listen(config.get('port'))
  })

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
      require('open')(`${config.get('publicUrl')}/api/docs`)
    })
  }
}

start()
