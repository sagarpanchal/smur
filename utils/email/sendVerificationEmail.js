const config = require('config')
const pug = require('pug')
const sendMail = require('utils/email/sendEmail')

const host = config.get('publicUrl')
const subject = `${config.get('companyName')} - ${config.get('appName')} | Verify your email`
const renderTemplate = pug.compileFile('./views/mail/verify-email.pug')

/**
 * Send verification email
 *
 * @param {string} email  email of the receiver
 * @param {string} name   name of the receiver
 * @param {object} params key - email-verification key
 */
const sendVerificationEmail = (email, name, { key }) => {
  const params = {
    link: `${host}/verify-email/${key}`,
  }
  return sendMail(email, subject, renderTemplate({ subject, name, ...params }))
}

module.exports = sendVerificationEmail
