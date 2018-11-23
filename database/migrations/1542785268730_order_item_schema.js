'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class OrderItemSchema extends Schema {
  up () {
    this.create('orders', (table) => {
      table.increments()
      table.timestamps()
      table.integer('bid_id').unsigned().index().references('id').inTable('bids').onDelete('CASCADE')
      table.integer('user_id').unsigned().index().references('id').inTable('users').onDelete('CASCADE')
    })
  }

  down () {
    this.drop('orders')
  }
}

module.exports = OrderItemSchema
