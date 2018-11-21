'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class BidSchema extends Schema {
  up () {
    this.create('bids', (table) => {
      table.increments();
      table.timestamps();
      table.integer('user_id').unsigned();
      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
      table.integer('lot_id').unsigned();
      table.foreign('lot_id').references('id').inTable('lots');
    });
  }

  down () {
    this.drop('bids');
  }
}

module.exports = BidSchema;
