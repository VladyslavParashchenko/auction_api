'use strict'

const BaseController = use('App/Controllers/Http/BaseController')
const User = use('App/Models/User')
const AuthService = use('AuthService')
const Antl = use('Antl')

class AuthController extends BaseController {
  async register ({ request, response }) {
    try {
      const params = this._userParams(request)
      const user = await User.create(params)
      await AuthService.sendConfirmationLetter(user)
      return response.send(user)
    } catch (e) {
      this.handleException(response, e)
    }
  }

  async confirmation ({ request, response }) {
    try {
      const user = await User.findByOrFail(request.only(['confirmation_token']))
      await AuthService.confirmAccount(user)
      return response.redirect(AuthService.frontAppUrl())
    } catch (e) {
      this.handleException(response, e)
    }
  }

  async login ({ request, auth, response }) {
    try {
      const params = this._userCredentials(request)
      const user = await User.findByOrFail({ email: params.email, confirmation_token: null })
      const { token, refreshToken } = await AuthService.login(auth, params)
      response.header('Authorization', `Bearer ${token}`).header('refreshToken', refreshToken).send(user)
    } catch (e) {
      this.handleException(response, e)
    }
  }

  async resetPassword ({ request, response }) {
    try {
      const user = await User.findByOrFail(request.only(['email']))
      await AuthService.resetPassword(request, user)
      return response.json({ message: Antl.formatMessage('message.ResetLetterWasSent') })
    } catch (e) {
      this.handleException(response, e)
    }
  }

  async setNewPassword ({ request, response, auth }) {
    try {
      const user = await User.findByOrFail(request.only(['restore_password_token']))
      const tokenObject = await AuthService.setNewPassword(user, auth, request.all())
      this._returnTokenToUser(response, user, tokenObject)
    } catch (e) {
      this.handleException(response, e)
    }
  }

  async refresh ({ request, response, auth }) {
    try {
      const tokenObject = await auth.generateForRefreshToken(this._refreshToken(request))
      this._returnTokenToUser(response, { message: Antl.formatMessage('message.TokenRefresh') }, tokenObject)
    } catch (e) {
      this.handleException(response, e)
    }
  }

  async logout ({ request, response, auth }) {
    try {
      await auth.authenticator('jwt').revokeTokens()
      return response.json({ message: Antl.formatMessage('message.Logout') })
    } catch (e) {
      this.handleException(response, e)
    }
  }

  _userParams (request) {
    return request.only(['email', 'first_name', 'last_name', 'phone', 'birth_day', 'password'])
  }

  _userCredentials (request) {
    return request.only(['email', 'password'])
  }

  _refreshToken (request) {
    return request.only(['refresh_token'])['refresh_token']
  }

  _returnTokenToUser (response, body, { token, refreshToken }) {
    response.header('Authorization', `Bearer ${token}`).header('refreshToken', refreshToken).send(body)
  }
}

module.exports = AuthController
