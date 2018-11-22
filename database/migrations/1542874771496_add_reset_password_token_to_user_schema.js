'use strict';

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema');

class AddResetPasswordTokenToUserSchema extends Schema {
  up () {
    this.table('users', (table) => {
      table.string('restore_password_token', 255);
    });
  }

  down () {
    this.table('users', (table) => {
      table.dropColumn('restore_password_token');
    });
  }
}

module.exports = AddResetPasswordTokenToUserSchema;
