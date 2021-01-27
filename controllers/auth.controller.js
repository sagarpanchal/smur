const Debug = require('debug')
const bcrypt = require('bcryptjs')
const uuid = require('uuid').v4
const User = require('models/user.model')
const Session = require('models/session.model')
const validateSignUp = require('utils/yup/validate/auth/signUp.validate')
const validateSignIn = require('utils/yup/validate/auth/signIn.validate')
const validateEmail = require('utils/yup/validate/common/email.validate')
const validatePassword = require('utils/yup/validate/common/email.validate')
const sendVerificationEmail = require('utils/email/sendVerificationEmail')
const sendPasswordResetEmail = require('utils/email/sendPasswordResetEmail')
const httpErrors = require('utils/httpErrors')
const { isArray } = require('utils/utils')
const jwt = require('utils/jwt')

exports.signInWithProvider = async (req, res) => {
  const debug = Debug('app:controllers:auth:signIn')
  debug({ signin: req.user, auth: req.auth, errors: req.errors })
  if (req.errors) return httpErrors.sendError(res, req.errors)

  const userFound = req.auth.user || req.user
  if (!userFound) return httpErrors.wentWrong(res)
  if (req.auth.token) return res.status(204)

  const sessionSaved = await new Session({ user: userFound._id, uuid: uuid() }).save()
  if (!sessionSaved) return httpErrors.wentWrong(res)

  const accessToken = await jwt.generate({
    uid: userFound._id,
    sid: sessionSaved.uuid,
  })
  const { avatar, firstName, lastName, email, roles } = userFound
  return accessToken ? res.json({ avatar, firstName, lastName, email, roles, accessToken }) : httpErrors.wentWrong(res)
}

exports.signUp = async (req, res) => {
  const errors = await validateSignUp(req.body)
  if (errors) return httpErrors.sendError(res, errors)

  if (await User.countDocuments({ email: req.body.email }))
    return httpErrors.conflict(res, { errors: { email: ['Email is already registered'] } })

  const { firstName, lastName, email } = req.body
  const verificationKey = uuid()
  if (!(await sendVerificationEmail(email, firstName, { key: verificationKey })))
    return httpErrors.sendError(res, {
      errors: { email: ["Couldn't send verification email"] },
    })

  const password = await bcrypt.hash(req.body.password, 10)
  await new User({ firstName, lastName, email, password, verificationKey }).save()
  return res.json({ message: 'Check your email for verification' })
}

exports.signIn = async (req, res) => {
  const errors = await validateSignIn(req.body)
  if (errors) return httpErrors.sendError(res, errors)

  const { password: rawPassword } = req.body
  const userFound = await User.findOne({ email: req.body.email })
  if (!userFound) return httpErrors.sendError(res, { errors: { login: ['Invalid Email or Password'] } })
  if (!userFound.verified) return httpErrors.sendError(res, { errors: { email: ['Please verify your email'] } })

  const passwordMatched = await bcrypt.compare(rawPassword, userFound.password)
  if (!passwordMatched) return httpErrors.sendError(res, { errors: { login: ['Invalid Email or Password'] } })

  const sessionSaved = await new Session({ user: userFound._id, uuid: uuid() }).save()
  if (!sessionSaved) return httpErrors.wentWrong(res)

  const accessToken = await jwt.generate({ uid: userFound._id, sid: sessionSaved.uuid })
  const { avatar, firstName, lastName, email, roles } = userFound
  return accessToken ? res.json({ avatar, firstName, lastName, email, roles, accessToken }) : httpErrors.wentWrong(res)
}

exports.verifyEmail = async (req, res) => {
  const userUpdated = await User.findOneAndUpdate(
    { verificationKey: req.params.uuid },
    { verificationKey: null, verified: true }
  )

  return userUpdated ? res.json({ message: 'Email verified' }) : httpErrors.sendError(res, 'Verification link expired')
}

exports.sendVerificationEmail = async (req, res) => {
  const errors = await validateEmail(req.body)
  if (errors) return httpErrors.sendError(res, errors)

  const userFound = await User.findOne({ email: req.body.email })
  if (!userFound) return httpErrors.sendError(res, { errors: { email: ['User not found'] } })
  if (userFound.verified) return httpErrors.sendError(res, { errors: { email: ['Your email is already verified'] } })

  userFound.verificationKey = uuid()
  await userFound.save()

  const { firstName, email, verificationKey } = userFound
  if (!(await sendVerificationEmail(email, firstName, { key: verificationKey })))
    return httpErrors.wentWrong(res, { errors: { email: ["Couldn't send verification email"] } })

  return res.json({ message: 'Check your email for verification' })
}

exports.forgotPassword = async (req, res) => {
  const errors = await validateEmail(req.body)
  if (errors) return httpErrors.sendError(res, errors)

  const userFound = await User.findOne({ email: req.body.email })
  if (!userFound) return httpErrors.sendError(res, { errors: { email: ['User not found'] } })
  if (!userFound.verified) return httpErrors.sendError(res, { errors: { email: ['Please verify your email'] } })

  userFound.passwdResetKey = uuid()
  if (!(await userFound.save())) return httpErrors.wentWrong(res)

  const { firstName, email, passwdResetKey } = userFound
  if (!(await sendPasswordResetEmail(firstName, email, passwdResetKey)))
    return httpErrors.wentWrong(res, {
      errors: { email: ["Couldn't send password reset email"] },
    })

  return res.json({ message: 'Check your email for password reset link' })
}

exports.resetPassword = async (req, res) => {
  const errors = await validatePassword(req.body)
  if (errors) return httpErrors.sendError(res, errors)

  const { uuid: passwdResetKey } = req.params
  const userFound = await User.findOne({ passwdResetKey, verified: true })
  if (!userFound) return httpErrors.sendError(res, 'Password reset link expired')

  userFound.password = await bcrypt.hash(req.body.password, 10)
  userFound.passwdResetKey = null
  await Session.deleteMany({ user: userFound._id })
  await userFound.save()

  return res.json({ message: 'Your password has been updated' })
}

exports.getOneTimeToken = async (req, res) => {
  const debug = Debug('app:controllers:auth:getChatToken')
  debug({ auth: req.auth })

  const { user, session } = req.auth
  const sessionSaved = await session.set({ otid: uuid() }).save()

  const wsAccessToken = await jwt.generate({
    uid: user._id,
    oid: sessionSaved.chat,
  })
  return res.json({ wsAccessToken })
}

exports.signOut = async (req, res) => {
  const debug = Debug('app:controllers:auth:signOut')
  debug({ auth: req.auth })

  const { uid: user, sid: uuid } = req.auth.token
  await Session.deleteOne({ user, uuid })

  const sessions = await req.io.users.getUser(user, {})
  if (isArray(sessions?.[uuid])) sessions[uuid].forEach((socketId) => req.io.to(socketId).emit('logout'))

  return res.json({ signedOut: true })
}
