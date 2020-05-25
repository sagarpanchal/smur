const config = require('config')
const winston = require('winston')
const logTo = config.get('logger')
const transports = []

if (config.get('mongodb.db') && logTo.includes('database')) {
  const { MongoDB } = require('winston-mongodb')
  transports.push(new MongoDB(config.get('mongodb')))
}

if (logTo.includes('json')) {
  const { JsonTransport } = require('./JsonTransport')
  transports.push(new JsonTransport())
}

module.exports = winston.createLogger({ transports })
