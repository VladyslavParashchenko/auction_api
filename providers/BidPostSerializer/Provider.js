
const { ServiceProvider } = require('@adonisjs/fold')

class BidPostSerializerServiceProvider extends ServiceProvider {
  register () {
    this.app.singleton('BidPostSerializerService', () => {
      const BidListService = use('App/Services/BidPostSerializerService')
      return new BidListService()
    })
  }
}

module.exports = BidPostSerializerServiceProvider
