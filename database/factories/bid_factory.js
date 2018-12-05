'use strict'

const factory = async (faker, i, data) => {
  const currentPrice = data['lot']['current_price'] || 0
  const priceStep = data['step'] || 100
  const proposedPrice = currentPrice + (i + 1) * priceStep
  return {
    proposed_price: proposedPrice,
    user_id: data.user.id,
    lot_id: data.lot.id
  }
}

module.exports = factory
