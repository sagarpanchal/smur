const Yup = require('yup')
const email = require('utils/yup/rules/email')
const getErrors = require('utils/yup/getErrors')

const schema = Yup.object().shape({ email: email() })

module.exports = (object) => getErrors(schema, object)
