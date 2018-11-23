'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class LotSchema extends Schema {
  up () {
    this.create('lots', (table) => {
      table.increments()
      table.integer('user_id').unsigned()
      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.timestamps()
    })
  }

  down () {
    this.dropIfExists('users')
  }
}

module.exports = LotSchema
