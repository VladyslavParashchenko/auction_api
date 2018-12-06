
const { ServiceProvider } = require('@adonisjs/fold')

class BidSocketProvider extends ServiceProvider {
  register () {
    this.app.singleton('BidSocket', () => {
      const Uploader = use('App/Sockets/BidSocket')
      return new Uploader()
    })
  }
}

module.exports = BidSocketProvider
