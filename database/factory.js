'use strict';

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory');
const Hash = use('Hash');

Factory.blueprint('App/Models/User', async (faker, i, data) => {
  return {
    first_name: faker.first(),
    last_name: faker.last(),
    birth_day: faker.date({ year: 1990 }),
    email: faker.email(),
    phone: faker.phone(),
    password: await Hash.make('password'),
    restore_password_token: data.restore_password_token || ''
  };
});
