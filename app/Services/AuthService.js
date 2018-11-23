'use strict'
const crypto = require('crypto')
const Event = use('Event')

class AuthService {
  constructor () {
    this.Config = use('Adonis/Src/Config')
    this.user = use(this.get('userModel'))
  }

  get (name) {
    return this.Config.get(`authProvider.${name}`)
  }

  async login (auth, authParams) {
    const { email, password } = authParams
    let tokenObject = await auth.withRefreshToken().attempt(email, password)
    return tokenObject
  }

  generateToken () {
    crypto.randomBytes(24).toString('hex')
  }

  async resetPassword (request, user) {
    user.restore_password_token = this.generateToken()
    await user.save()
    await this.sendRestorePasswordLetter(request, user)
  }

  async sendRestorePasswordLetter (request, user) {
    const url = this.generateRestoreUrl(request.all().restore_password_url, user.restore_password_token)
    Event.fire('user::restore_password', user, url)
  }

  generateRestoreUrl (restorePasswordUrl, restorePasswordToken) {
    return `${restorePasswordUrl}?restore_password_token=${restorePasswordToken}`
  }

  async setNewPassword (request, user, auth) {
    const newPassword = request.all()['password']
    user.password = newPassword
    user.restore_password_token = null
    await user.save()
    const tokenObject = await auth.withRefreshToken().attempt(user.email, newPassword)
    return tokenObject
  }
  async confirmAccount (user) {
    user.confirmation_token = null
    user.confirmed_at = new Date()
    await user.save()
  }

  async sendConfirmationLetter (user) {
    user.merge({ confirmation_token: this.generateToken() })
    Event.fire('user::new', user)
  }

  frontAppUrl () {
    return this.get('confirmSuccessUrl')
  }
}

module.exports = AuthService
