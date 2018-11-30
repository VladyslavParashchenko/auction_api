'use strict'

const Mail = use('Mail')
const Env = use('Env')
const User = exports = module.exports = {}

User.new = async (user) => {
  const link = `${Env.get('APP_URL')}/api/auth/confirmation?confirmation_token=${user.confirmation_token}`
  await Mail.send('emails.user_register', { user, link }, (message) => {
    message.to(user.email)
    message.from(Env.get('EMAIL_SENDER_EMAIL'))
  })
}

User.restore_password = async (user, link) => {
  await Mail.send('emails.user_restore_password', { user, link }, (message) => {
    message.to(user.email)
    message.from(Env.get('EMAIL_SENDER_EMAIL'))
  })
}
