const config = require('config')
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const handleOAuth = require('middleware/passport.middleware')

exports.useStrategy = () =>
  passport.use(
    new FacebookStrategy(
      {
        callbackURL: `${config.get('publicUrl')}/api/auth/facebook/callback`,
        ...config.get('oAuth2.facebook'),
        passReqToCallback: true,
      },
      handleOAuth
    )
  )
