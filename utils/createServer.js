const http = require('http')
const https = require('https')

const config = require('config')
const fse = require('fs-extra')

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
