const package = require('package')
const paths = require('./paths')

module.exports = {
  openapi: '3.0.1',
  info: {
    title: package.name,
    contact: { email: 'panchal.sagar@outlook.com' },
    version: package.version,
  },
  servers: [{ url: 'https://localhost/api' }],
  tags: [{ name: 'Authentication' }],
  paths,
  components: {
    securitySchemes: {
      BearerToken: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
}
