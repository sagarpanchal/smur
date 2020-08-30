const { model, models, Schema } = require('mongoose')

if (!models.Session) {
  const sessionSchema = new Schema(
    {
      user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      uuid: { type: String, required: true },
      // otid: { type: String, required: false },
    },
    { timestamps: true, versionKey: false }
  )
  sessionSchema.index({ user: 1, uuid: 1 })

  model('Session', sessionSchema)
}

module.exports = model('Session')
