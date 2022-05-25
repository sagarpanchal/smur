const Yup = require('yup')

const getErrors = require('utils/yup/getErrors')
const password = require('utils/yup/rules/password')

const schema = Yup.object().shape({ password: password() })

module.exports = (object) => getErrors(schema, object)
