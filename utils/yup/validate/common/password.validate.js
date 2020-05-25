const Yup = require('yup')
const password = require('utils/yup/rules/password')
const getErrors = require('utils/yup/getErrors')

const schema = Yup.object().shape({ password: password() })

module.exports = (object) => getErrors(schema, object)
