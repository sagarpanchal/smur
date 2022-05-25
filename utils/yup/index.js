const ObjectId = require('bson/lib/objectid')
const Yup = require('yup')

const { isArray } = require('utils/utils')

Yup.addMethod(Yup.array, 'unique', function (message = 'Array items must be unique') {
  return this.test('unique', message, (value) => {
    return typeof isArray(value) && value.length === new Set(value)?.size
  })
})

Yup.addMethod(Yup.string, 'objectId', function (message = 'Invalid ObjectId') {
  return this.test('objectId', message, (value) => {
    return ObjectId.isValid(value)
  })
})

module.exports = Yup
