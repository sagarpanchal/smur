// const debug = require('debug')('app:route:auth')
const config = require('config')
const router = require('express').Router()
const passport = require('passport')
const PassportErrorMiddleware = require('middleware/passportError.middleware')
const AuthMiddleware = require('middleware/auth.middleware/auth.middleware')
const AuthInjector = require('middleware/auth.middleware/authInject.middleware')
const AuthController = require('controllers/auth.controller')

const providers = Object.keys(config.get('oAuth2'))

for (const provider of providers) {
  router.get(`/${provider}`, passport.authenticate(provider), PassportErrorMiddleware)
  router.use(
    `/${provider}/callback`,
    AuthInjector,
    passport.authenticate(provider),
    PassportErrorMiddleware,
    AuthController.signInWithProvider
  )
}

// router.get('/ott', AuthMiddleware, AuthController.getOneTimeToken)

router.get('/logout', AuthMiddleware, AuthController.signOut)

module.exports = router
