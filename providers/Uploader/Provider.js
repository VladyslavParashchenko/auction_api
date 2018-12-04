
const { ServiceProvider } = require('@adonisjs/fold')

class UploaderProvider extends ServiceProvider {
  register () {
    this.app.singleton('Uploader', () => {
      const Uploader = use('App/Uploaders/Uploader')
      return new Uploader()
    })
  }
}

module.exports = UploaderProvider
