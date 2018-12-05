class BidPostSerializerService {
  markBids (lotObject, userId) {
    let mapWithUsers = new Map()
    let i = 1
    for (let bid of lotObject.bids) {
      if (bid.user_id === userId) {
        bid.customer = this._currentUserLabel()
      } else {
        if (!mapWithUsers.has(bid.user_id)) {
          mapWithUsers.set(bid.user_id, i++)
        }
        bid.customer = this._makeCustomerName(mapWithUsers.get(bid.user_id))
      }
      delete bid.user_id
    }
    return lotObject
  }

  _makeCustomerName (id) {
    return `Customer ${id}`
  }

  _currentUserLabel () {
    return 'You'
  }
}

module.exports = BidPostSerializerService
