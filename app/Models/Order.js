'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Order extends Model {
  user () {
    this.belongsTo('App/Models/User')
  }

  bid () {
    this.belongsTo('App/Models/Bid')
  }
}

module.exports = Order
