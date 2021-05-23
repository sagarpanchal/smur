const jwt = require('utils/jwt')
const User = require('models/user.model')
const Session = require('models/session.model')
const { isString } = require('utils/utils')

module.exports = async (bearerToken) => {
  if (isString(bearerToken)) return false

  const auth = bearerToken.split(' ')
  if (auth.length < 2) return false
  if (auth[0] !== 'Bearer') return false

  const token = await jwt.verify(auth[1])
  if (!token) return false

  const user = await User.findById(token.uid)
  if (!user) return false

  const { uid, sid } = token
  const session = await Session.findOne({ user: uid, uuid: sid })
  if (!session) return false

  return { user, session, token }
}
