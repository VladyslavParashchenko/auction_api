'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddWinnerBidToLotSchema extends Schema {
  up () {
    this.table('lots', (table) => {
      table.integer('winner_bid_id').unsigned().index().references('id').inTable('bids').onDelete('SET NULL')
    })
  }

  down () {
    this.table('lots', (table) => {
      table.dropForeign('winner_bid_id')
    })
  }
}

module.exports = AddWinnerBidToLotSchema
