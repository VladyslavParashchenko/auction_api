
const { ServiceProvider } = require('@adonisjs/fold')

class LotStatusJobProvider extends ServiceProvider {
  register () {
    this.app.singleton('LotStatusJob', () => {
      const LotStatusJob = use('App/Jobs/LotStatusJob')
      return new LotStatusJob()
    })
  }
}

module.exports = LotStatusJobProvider
