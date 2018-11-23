'use strict'

const BaseController = use('App/Controllers/Http/BaseController')
const User = use('App/Models/User')
const AuthService = use('AuthService')
const Antl = use('Antl')

class AuthController extends BaseController {
  async register ({ request, response }) {
    const params = this._userParams(request)
    const user = new User()
    user.fill(params)
    await AuthService.sendConfirmationLetter(user)
    await user.save()
    return response.json(user)
  }

  async confirmation ({ request, response }) {
    try {
      const user = await User.findByOrFail(this.paramsFromRequest(request, ['confirmation_token']))
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
      response.header('Authorization', `Bearer ${token}`).header('refreshToken', refreshToken).json(user)
    } catch (e) {
      this.handleException(response, e)
    }
  }

  async resetPassword ({ request, response }) {
    try {
      const user = await User.findByOrFail(this.paramsFromRequest(request, ['email']))
      await AuthService.resetPassword(request, user)
      return response.json({ message: Antl.formatMessage('message.ResetLetterWasSent') })
    } catch (e) {
      this.handleException(response, e)
    }
  }

  async setNewPassword ({ request, response, auth }) {
    try {
      const user = await User.findByOrFail(this.paramsFromRequest(request, ['restore_password_token']))
      const { token, refreshToken } = await AuthService.setNewPassword(request, user, auth)
      response.header('Authorization', `Bearer ${token}`).header('refreshToken', refreshToken).json(user)
    } catch (e) {
      this.handleException(response, e)
    }
  }

  async refresh ({ request, response, auth }) {
    try {
      const { token } = await auth.generateForRefreshToken(this._refreshToken(request))
      return response.header('Authorization', `Bearer ${token}`)
        .json({ message: Antl.formatMessage('message.TokenRefresh') })
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
    return this.paramsFromRequest(request, ['email', 'first_name', 'last_name', 'phone', 'birth_day', 'password'])
  }

  _userCredentials (request) {
    return this.paramsFromRequest(request, ['email', 'password'])
  }

  _refreshToken (request) {
    return this.paramsFromRequest(request, ['refresh_token'])['refresh_token']
  }
}

module.exports = AuthController
