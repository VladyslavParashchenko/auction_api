
const { ServiceProvider } = require('@adonisjs/fold')

class AuthProvider extends ServiceProvider {
  register () {
    this.app.singleton('AuthService', () => {
      const AuthService = use('App/Services/AuthService')
      return new AuthService()
    })
  }
}

module.exports = AuthProvider
