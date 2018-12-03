'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Event = use('Event')
const Model = use('Model')

class Bid extends Model {
  static boot () {
    super.boot()
    this.addHook('afterSave', async (bidInstance) => {
      const lot = await bidInstance.lot().fetch()
      if (lot.estimated_price < bidInstance.proposed_price) {
        Event.fire('lot::foundWinner', lot)
      }
    })
  }

  lot () {
    return this.belongsTo('App/Models/Lot')
  }

  user () {
    return this.belongsTo('App/Models/User')
  }

  static get visible () {
    return ['created_at', 'proposed_price', 'user_id']
  }
}

module.exports = Bid
