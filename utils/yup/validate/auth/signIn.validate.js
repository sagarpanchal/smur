const Yup = require('yup')

const getErrors = require('utils/yup/getErrors')
const email = require('utils/yup/rules/email')
const password = require('utils/yup/rules/password')

const schema = Yup.object().shape({
  email: email(),
  password: password(),
})

module.exports = (object) => getErrors(schema, object)
