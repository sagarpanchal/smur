const Yup = require('yup')
const ObjectId = require('bson/lib/objectid')

Yup.addMethod(Yup.array, 'unique', function (message = 'Array items must be unique') {
  return this.test('unique', message, function (array) {
    return typeof array === 'object' && array.constructor.name === 'Array' && array.length === new Set(array).size
  })
})

Yup.addMethod(Yup.string, 'objectId', function (message = 'Invalid ObjectId') {
  return this.test('objectId', message, function (value) {
    return ObjectId.isValid(value)
  })
})

module.exports = Yup
