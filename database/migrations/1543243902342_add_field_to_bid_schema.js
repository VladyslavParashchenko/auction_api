'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddFieldToBidSchema extends Schema {
  up () {
    this.table('bids', (table) => {
      table.float('proposed_price').notNullable()
    })
  }

  down () {
    this.table('bids', (table) => {
      table.dropColumn('proposed_price')
    })
  }
}

module.exports = AddFieldToBidSchema
