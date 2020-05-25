const Yup = require('yup')
const name = require('utils/yup/rules/name')
const email = require('utils/yup/rules/email')
const password = require('utils/yup/rules/password')
const getErrors = require('utils/yup/getErrors')

const schema = Yup.object().shape({
  firstName: name(),
  lastName: name(),
  email: email(),
  password: password(),
})

module.exports = (object) => getErrors(schema, object)
