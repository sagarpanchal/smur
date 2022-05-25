const config = require('config')
const nodemailer = require('nodemailer')

const asyncHandler = require('utils/factories/asyncError')

const from = `${config.get('mailFrom')} <${config.get('mailer.auth.user')}>`
const transport = nodemailer.createTransport(config.get('mailer'))

/**
 * Send email
 *
 * @param {string} to      email id of the receiver
 * @param {string} subject email subject
 * @param {string} html    email content (must be html)
 */
const sendMail = async (to, subject, html) =>
  asyncHandler(() => transport.sendMail({ from, to, subject, html }), { report: false })

module.exports = sendMail
