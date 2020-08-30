const { Schema, model, models } = require('mongoose')

if (!models.OAuth) {
  const profile = {
    provider: { type: String, required: true },
    id: { type: String, required: true },
    email: { type: String, default: undefined },
    _meta: { type: Object, default: undefined },
  }

  // const profileToken = {
  //   accessToken: { type: Object, default: undefined },
  //   refreshToken: { type: Object, default: undefined },
  //   params: { type: Object, default: undefined },
  // }

  const oAuthSchema = new Schema(
    {
      user: { type: Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
      profiles: {
        primary: { type: String, required: true },
        google: { type: profile, default: undefined },
        facebook: { type: profile, default: undefined },
      },
      // params: {
      //   google: { type: profileToken, default: undefined },
      //   facebook: { type: profileToken, default: undefined },
      // },
    },
    { collection: 'oauth', timestamps: true, versionKey: false }
  )
  oAuthSchema.index({ user: 1 })

  model('OAuth', oAuthSchema)
}

module.exports = model('OAuth')
