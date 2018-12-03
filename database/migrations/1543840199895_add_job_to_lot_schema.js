'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddJobToLotSchema extends Schema {
  up () {
    this.table('lots', (table) => {
      table.integer('lot_start_job_id')
      table.integer('lot_end_job_id')
    })
  }

  down () {
    this.table('lots', (table) => {
      table.dropColumn('lot_start_job_id')
      table.dropColumn('lot_end_job_id')
    })
  }
}

module.exports = AddJobToLotSchema
