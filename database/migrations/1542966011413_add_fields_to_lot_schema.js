'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddFieldsToLotSchema extends Schema {
  up () {
    this.table('lots', (table) => {
      table.string('title').notNullable()
      table.text('description')
      table.string('image')
      table.float('current_price').notNullable()
      table.enu('status', ['pending', 'inProcess', 'closed']).notNullable()
      table.float('estimated_price').notNullable()
      table.date('start_time').notNullable()
      table.date('end_time').notNullable()
    })
  }

  down () {
    this.table('lots', (table) => {
      table.dropColumn('title')
      table.dropColumn('description')
      table.dropColumn('image')
      table.dropColumn('current_price')
      table.dropColumn('estimated_price')
      table.dropColumn('status')
      table.dropColumn('start_time')
      table.dropColumn('end_time')
    })
  }
}

module.exports = AddFieldsToLotSchema
