const fs = require('fs')
const http = require('http')
const https = require('https')
const config = require('config')

module.exports = (app) =>
  config.get('tls')
    ? https.createServer(
        {
          key: fs.readFileSync(config.get('ssl.key')),
          cert: fs.readFileSync(config.get('ssl.cert')),
        },
        app
      )
    : http.createServer(app)
