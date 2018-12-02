
const { ServiceProvider } = require('@adonisjs/fold')

class BidPostSerializerServiceProvider extends ServiceProvider {
  register () {
    const uploaders = use('App/Uploader')
    for (let uploaderPath in uploaders) {
      this.app.singleton(uploaders[uploaderPath], () => {
        const Uploader = use(uploaderPath)
        return new Uploader()
      })
    }
  }
}

module.exports = BidPostSerializerServiceProvider
