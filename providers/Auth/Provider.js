
const { ServiceProvider } = require('@adonisjs/fold')

class AuthProvider extends ServiceProvider {
  register () {
    this.app.singleton('AuthService', () => {
      const Config = this.app.use('Adonis/Src/Config')
      const AuthService = use('App/Services/AuthService')
      return new AuthService(Config)
    })
  }
}

module.exports = AuthProvider
