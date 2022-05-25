const config = require('config')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy

const handleOAuth = require('middleware/passport.middleware')

exports.useStrategy = () =>
  passport.use(
    new GoogleStrategy(
      {
        callbackURL: `${config.get('publicUrl')}/api/auth/google/callback`,
        ...config.get('oAuth2.google'),
        passReqToCallback: true,
      },
      handleOAuth
    )
  )
