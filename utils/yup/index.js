const Yup = require('yup')
const ObjectId = require('bson/lib/objectid')
const { isArray } = require('utils/utils')

Yup.addMethod(Yup.array, 'unique', function (message = 'Array items must be unique') {
  return this.test('unique', message, function (value) {
    return typeof isArray(value) && value.length === new Set(value)?.size
  })
})

Yup.addMethod(Yup.string, 'objectId', function (message = 'Invalid ObjectId') {
  return this.test('objectId', message, function (value) {
    return ObjectId.isValid(value)
  })
})

module.exports = Yup
