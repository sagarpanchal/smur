const { Schema, model, models } = require('mongoose')

const userRoles = require('utils/constants/userRoles.consts')

if (!models.User) {
  const userSchema = new Schema(
    {
      email: { type: String, required: true, min: 6, max: 255 },
      roles: { type: [String], default: [userRoles.user] },
      name: { type: String, required: true, min: 2, max: 70 },
      avatar: { type: String, default: undefined },
      password: { type: String, required: false, max: 70 },
      verified: { type: Boolean, default: false },
      passwdResetKey: { type: String, default: null },
      verificationKey: { type: String, default: null },
    },
    { timestamps: true, versionKey: false }
  )
  userSchema.index({ email: 1 })

  model('User', userSchema)
}

module.exports = model('User')
