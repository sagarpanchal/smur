const debug = require('debug')('app:middleware:passport:verify')

const OAuth = require('models/oauth.model')
const User = require('models/user.model')
const reportError = require('utils/reportError')(debug)
const validateEmail = require('utils/yup/validate/common/email.validate')

const formatUserData = (profile) => {
  if (profile.provider === 'facebook') {
    // prettier-ignore
    return { id: profile._json.id, name: `${profile._json.first_name} ${profile._json.last_name}`, firstName: profile._json.first_name, lastName: profile._json.last_name, avatar: profile._json.picture.data.url, email: profile._json.email, verified: profile._json.email_verified, locale: profile._json.locale }
  }

  if (profile.provider === 'google') {
    // prettier-ignore
    return { id: profile._json.sub, name: profile._json.name, firstName: profile._json.given_name, lastName: profile._json.family_name, avatar: profile._json.picture, email: profile._json.email, verified: profile._json.verified, locale: profile._json.locale }
  }

  return profile
}

/** Passport Strategy verify */
const verifyAuth = async (req, accessToken, refreshToken, params, profile, done) => {
  try {
    const signIn = !req.auth.token
    debug({ signIn, user: req.auth.user, accessToken, refreshToken, params, profile })

    // Format data gathered from different providers
    const userData = formatUserData(profile)
    debug({ userData })
    const errors = await validateEmail({ email: userData.email })
    if (errors) {
      req.errors = errors
      return done(null, {})
    }

    // data gathered from provider
    const providerData = { id: profile.id, email: userData.email, _meta: profile }

    // Find or create oAuth
    const oAuth = signIn
      ? (await OAuth.findOne({ [`profiles.${profile.provider}.id`]: profile.id })) || new OAuth({})
      : await OAuth.findOne({ user: req.auth.user._id })

    // Find or create user
    const user = signIn ? (await User.findById(oAuth.user)) || new User({}) : req.auth.user

    oAuth.set({
      // Link user to oAuth
      user: oAuth.user || user._id,

      // Save or udate profile retrieved from auth provider
      profiles: {
        ...(oAuth.profiles || {}),
        [profile.provider]: providerData,
        primary: profile.provider,
      },

      // Save or udate auth provider tokens
      // profileTokens: {
      //   ...(oAuth.profileTokens || {}),
      //   [profile.provider]: { accessToken, refreshToken, params },
      // },
    })

    user.set({
      // Create or update user profile
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      avatar: user.avatar || userData.avatar,
    })

    // Save Data
    debug({ user, oAuth })
    await user.save()
    await oAuth.save()

    done(null, { ...user._doc, oAuth: oAuth._doc })
  } catch (error) {
    done(reportError(error, { return: true }), null)
  }
}

module.exports = verifyAuth
