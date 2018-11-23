'use strict'

const factory = async (faker, i, data) => {
  return {
    first_name: data.first_name || faker.first(),
    last_name: data.last_name || faker.last(),
    birth_day: data.birth_day || faker.date({ year: 1990 }),
    email: data.email || faker.email(),
    phone: data.phone || faker.phone(),
    confirmation_token: data.confirmation_token || null,
    password: data.password || 'password',
    restore_password_token: data.restore_password_token || ''
  }
}

module.exports = factory
