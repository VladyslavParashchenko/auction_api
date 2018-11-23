'use strict'

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
const Factory = use('Factory')
const dayjs = require('dayjs')

Factory.blueprint('App/Models/User', async (faker, i, data) => {
  return {
    first_name: faker.first(),
    last_name: faker.last(),
    birth_day: faker.date({ year: 1990 }),
    email: faker.email(),
    phone: faker.phone(),
    confirmation_token: null,
    password: 'password',
    restore_password_token: data.restore_password_token || ''

  }
})

Factory.blueprint('App/Models/Token', async (faker, i, data) => {
  return {
    is_revoked: false,
    type: 'jwt_refresh_token',
    token: data.token || '1111111111111111.111111111111.11111111'
  }
})

Factory.blueprint('App/Models/Lot', async (faker, i, data) => {
  return {
    title: 'new_title',
    current_price: 2000,
    estimated_price: 3000,
    description: 'text',
    user_id: data.user_id,
    start_time: dayjs().add(7, 'day'),
    end_time: dayjs().add(10, 'day')
  }
})
