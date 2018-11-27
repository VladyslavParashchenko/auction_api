'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Event = use('Event')
const Antl = use('Antl')

class Bid extends Model {
  static boot () {
    super.boot()

    // this.addHook('afterSave', async (bidInstance) => {
    //   const lot = await bidInstance.lot().fetch()
    //   const estimatedPrice = lot.estimated_price
    //   if (estimatedPrice < bidInstance.proposed_price) {
    //
    //   }
    // })
  }

  lot () {
    return this.belongsTo('App/Models/Lot')
  }

  user () {
    return this.belongsTo('App/Models/User')
  }
}

module.exports = Bid
