// const debug = require('debug')('app:route:auth')
const config = require('config')
const router = require('express').Router()
const passport = require('passport')

const AuthController = require('controllers/auth.controller')
const AuthMiddleware = require('middleware/auth.middleware/auth.middleware')
const AuthInjector = require('middleware/auth.middleware/authInject.middleware')
const PassportErrorMiddleware = require('middleware/passportError.middleware')

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

router.post('/register', AuthController.signUp)
router.post('/login', AuthController.signIn)
router.get('/logout', AuthMiddleware, AuthController.signOut)

router.get('/ott', AuthMiddleware, AuthController.getOneTimeToken)
router.get('/verify-email/:uuid', AuthController.verifyEmail)
router.post('/send-verification-email', AuthController.sendVerificationEmail)

router.post('/forgot-password', AuthController.forgotPassword)
router.post('/reset-password/:uuid', AuthController.resetPassword)

module.exports = router
