const fse = require('fs-extra')
const http = require('http')
const https = require('https')
const config = require('config')

module.exports = (app) =>
  config.get('tls')
    ? https.createServer(
        {
          key: fse.readFileSync(config.get('ssl.key')),
          cert: fse.readFileSync(config.get('ssl.cert')),
        },
        app
      )
    : http.createServer(app)
