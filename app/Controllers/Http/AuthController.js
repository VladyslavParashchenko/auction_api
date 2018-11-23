'use strict'

const BaseController = use('App/Controllers/Http/BaseController')
const User = use('App/Models/User')
const Event = use('Event')
const Env = use('Env')
const Antl = use('Antl')

class AuthController extends BaseController {
  async register ({ request, response }) {
    const params = request.only(['email', 'first_name', 'last_name', 'phone', 'birth_day', 'password'])
    params['confirmation_token'] = this.getToken()
    const user = await User.create(params)
    Event.fire('user::new', user)
    return response.json(user)
  }

  async confirmation ({ request, response }) {
    try {
      const user = await User.findByOrFail('confirmation_token', request.get().confirmation_token)
      user.confirmation_token = null
      user.confirmed_at = new Date()
      await user.save()
      return response.redirect(Env.get('CONFIRM_SUCCESS_URL', '/'))
    } catch (e) {
      return response.status(403).json({ message: Antl.formatMessage('message.UserNotFound') })
    }
  }

  async login ({ request, auth, response }) {
    try {
      const { email, password } = request.all()
      const user = await User.findByOrFail({ email: email, confirmation_token: null })
      let tokenObject = await auth.withRefreshToken().attempt(email, password)
      let { token, refreshToken } = tokenObject
      response.header('Authorization', `Bearer ${token}`).header('refreshToken', refreshToken).json(user)
    } catch (e) {
      return response.status(403).json({ message: Antl.formatMessage('message.UserNotFound') })
    }
  }

  async resetPassword ({ request, response, params }) {
    try {
      const user = await User.findByOrFail(request.only(['email']))
      user.restore_password_token = this.getToken()
      await user.save()
      const url = `${request.all()['restore_password_url']}?restore_password_token=${user.restore_password_token}`
      Event.fire('user::restore_password', user, url)
      return response.json({ message: Antl.formatMessage('message.ResetLetterWasSent') })
    } catch (e) {
      return response.status(403).json({ message: Antl.formatMessage('message.UserNotFound') })
    }
  }

  async setNewPassword ({ request, response, auth }) {
    try {
      const user = await User.findByOrFail(request.only(['restore_password_token']))
      const newPassword = request.all()['password']
      user.password = newPassword
      user.restore_password_token = null
      await user.save()
      const { token } = await auth.attempt(user.email, newPassword)
      return response.header('Authorization', `Bearer ${token}`)
        .json({ message: Antl.formatMessage('message.PasswordChanged') })
    } catch (e) {
      return response.status(400).json({ message: Antl.formatMessage('message.PasswordNotChanged') })
    }
  }

  async refresh ({ request, response, auth }) {
    try {
      const { token } = await auth.generateForRefreshToken(request.all()['refresh_token'])
      return response.header('Authorization', `Bearer ${token}`)
        .json({ message: Antl.formatMessage('message.TokenRefresh') })
    } catch (e) {
      return response.status(400).json({ message: e.message })
    }
  }

  async logout ({ request, response, auth }) {
    try {
      await auth.authenticator('jwt').revokeTokens()
      return response.json({ message: Antl.formatMessage('message.Logout') })
    } catch (e) {
      return response.status(400).json({ message: Antl.formatMessage('message.LogoutError') })
    }
  }
}

module.exports = AuthController
