const Yup = require('yup')

const getErrors = require('utils/yup/getErrors')
const email = require('utils/yup/rules/email')
const name = require('utils/yup/rules/name')
const password = require('utils/yup/rules/password')

const schema = Yup.object().shape({
  firstName: name(),
  lastName: name(),
  email: email(),
  password: password(),
})

module.exports = (object) => getErrors(schema, object)
