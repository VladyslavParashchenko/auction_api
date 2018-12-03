'use strict'
const crypto = require('crypto')
const Event = use('Event')
const Config = use('Adonis/Src/Config')

class AuthService {
  async login (auth, { email, password }) {
    let tokenObject = await auth.withRefreshToken().attempt(email, password)
    return tokenObject
  }

  generateToken () {
    return crypto.randomBytes(24).toString('hex')
  }

  async resetPassword (restorePasswordUrl, user) {
    user.restore_password_token = this.generateToken()
    await user.save()
    await this.sendRestorePasswordLetter(restorePasswordUrl, user)
  }

  async sendRestorePasswordLetter (restorePasswordUrl, user) {
    const url = this.generateRestoreUrl(restorePasswordUrl, user.restore_password_token)
    Event.fire('user::restore_password', user, url)
  }

  generateRestoreUrl (restorePasswordUrl, restorePasswordToken) {
    return `${restorePasswordUrl}?restore_password_token=${restorePasswordToken}`
  }

  async setNewPassword (user, auth, { password }) {
    user.password = password
    user.restore_password_token = null
    await user.save()
    const tokenObject = await auth.withRefreshToken().attempt(user.email, password)
    return tokenObject
  }
  async confirmAccount (user) {
    user.confirmation_token = null
    user.confirmed_at = new Date()
    await user.save()
  }

  async sendConfirmationLetter (user) {
    user.confirmation_token = this.generateToken()
    user = await user.save()
    Event.fire('user::new', user)
  }

  get FRONT_APP_URL () {
    return Config.get(`authProvider.confirmSuccessUrl`)
  }
}

module.exports = AuthService
