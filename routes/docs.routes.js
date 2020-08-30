// const debug = require('debug')('app:routes:docs')
const config = require('config')
const router = require('express').Router()

if (config.get('apiDocs')) {
  const swaggerUI = require('swagger-ui-express')
  const openApiDoc = require('api-docs')
  router.use('/', swaggerUI.serve, swaggerUI.setup(openApiDoc))
}

module.exports = router
