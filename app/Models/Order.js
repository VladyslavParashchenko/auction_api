'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Order extends Model {
  static get table () {
    return 'order_items'
  }

  user () {
    return this.belongsTo('App/Models/User')
  }

  bid () {
    return this.belongsTo('App/Models/Bid')
  }
}

module.exports = Order
