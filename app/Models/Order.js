'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Order extends Model {
  static boot () {
    super.boot()
    this.addHook('beforeCreate', async (orderInstance) => {
      orderInstance.status = 'pending'
    })
  }

  user () {
    return this.belongsTo('App/Models/User')
  }

  lot () {
    return this.belongsTo('App/Models/Lot')
  }
}

module.exports = Order
