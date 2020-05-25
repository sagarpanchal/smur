// const debug = require('debug')('app:route:auth')
const config = require('config')
const router = require('express').Router()
const passport = require('passport')
const PassportErrorMiddleware = require('middleware/passportError.middleware')
const AuthMiddleware = require('middleware/auth.middleware')
const TokenInjector = require('middleware/auth.middleware/tokenInjector')
const AuthController = require('controllers/user/auth.controller')

const providers = Object.keys(config.get('oAuth2'))

for (const provider of providers) {
  router.get(`/${provider}`, passport.authenticate(provider), PassportErrorMiddleware)
  router.use(
    `/${provider}/callback`,
    TokenInjector,
    passport.authenticate(provider),
    PassportErrorMiddleware,
    AuthController.signInWithProvider
  )
}

// router.get('/ott', AuthMiddleware, AuthController.getOneTimeToken)

router.get('/logout', AuthMiddleware, AuthController.signOut)

module.exports = router
