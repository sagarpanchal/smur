const passport = require('passport')

exports.setup = () => {
  passport.serializeUser((user, done) => done(null, user))
  passport.deserializeUser((user, done) => done(null, user))

  require('utils/passport/strategies/facebook').useStrategy()
  require('utils/passport/strategies/google').useStrategy()
}
