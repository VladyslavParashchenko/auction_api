'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddFieldsToOrderSchema extends Schema {
  up () {
    this.table('orders', (table) => {
      table.dropForeign('bid_id')
      table.string('arrivalLocation')
      table.enu('arrivalType', ['pickup', 'deliveryCompany'])
      table.enu('status', ['pending', 'sent', 'delivered'])
      table.integer('lot_id').unsigned().index().references('id').inTable('lots').onDelete('CASCADE')
    })
  }

  down () {
    this.table('orders', (table) => {
      table.dropColumn('arrivalLocation')
      table.dropColumn('arrivalType')
      table.dropColumn('status')
      table.dropForeign('lot_id')
    })
  }
}

module.exports = AddFieldsToOrderSchema
