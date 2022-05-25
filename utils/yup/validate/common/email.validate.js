const Yup = require('yup')

const getErrors = require('utils/yup/getErrors')
const email = require('utils/yup/rules/email')

const schema = Yup.object().shape({ email: email() })

module.exports = (object) => getErrors(schema, object)
