'use strict';

const Schema = use('Schema');

class UserSchema extends Schema {
  up () {
    this.create('users', table => {
      table.increments();
      table.string('first_name', 80).notNullable();
      table.string('last_name', 80).notNullable();
      table.string('email', 254).notNullable().unique();
      table.string('password', 60).notNullable();
      table.string('phone', 20).notNullable();
      table.date('birth_day').notNullable();
      table.string('confirmation_token');
      table.date('confirmed_at');
      table.date('confirmation_sent_at');
      table.timestamps();
    });
  }

  down () {
    this.drop('users');
  }
}

module.exports = UserSchema;
