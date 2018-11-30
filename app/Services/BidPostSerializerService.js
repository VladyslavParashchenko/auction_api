class BidPostSerializerService {
  reformatBids (lotObject, userId) {
    let mapWithUsers = new Map()
    let i = 1
    for (let bid of lotObject['bids']) {
      if (bid['user_id'] === userId) {
        bid['customer'] = 'You'
      } else {
        if (!mapWithUsers.has(bid['user_id'])) {
          mapWithUsers.set(bid['user_id'], i++)
        }
        bid['customer'] = `Customer ${mapWithUsers.get(bid['user_id'])}`
      }
      delete bid['user_id']
    }
    return lotObject
  }
}

module.exports = BidPostSerializerService
