'use strict'

const factory = async (faker, i, data) => {
  return {
    arrivalLocation: faker.address(),
    arrivalType: 'pickup',
    user_id: data.user_id,
    lot_id: data.lot_id
  }
}

module.exports = factory
