'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class OrderItemSchema extends Schema {
  up () {
    this.create('order_items', (table) => {
      table.increments();
      table.timestamps();
      table.integer('bid_id').unsigned();
      table.foreign('bid_id').references('id').inTable('bids');
      table.integer('user_id').unsigned();
      table.foreign('user_id').references('id').inTable('users');
    });
  }

  down () {
    this.drop('order_items');
  }
}

module.exports = OrderItemSchema;