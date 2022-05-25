const config = require('config')
const htmlMinifier = require('html-minifier')
const pug = require('pug')

const sendMail = require('utils/email/sendEmail')

const host = config.get('publicUrl')
const subject = `${config.get('companyName')} - ${config.get('appName')} | Verify your email`
const renderTemplate = pug.compileFile('./views/mail/password-reset.pug')

/**
 * Send verification email
 *
 * @param {string} email  email of the receiver
 * @param {string} name   name of the receiver
 * @param {object} params key - password-reset key
 */
const sendPasswordResetEmail = (email, name, key) => {
  const variables = { subject, name, link: `${host}/reset-password/${key}` }
  const html = htmlMinifier.minify(renderTemplate(variables))
  return sendMail(email, subject, html)
}

module.exports = sendPasswordResetEmail
