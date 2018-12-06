const Ws = use('Ws')

const Lot = use('App/Models/Lot')
class BidSockets {
  async broadcastBid ({ bidId, proposedPrice, lotId, userId, createdAt }) {
    const channel = Ws.getChannel('lots:*').topic(`lots:lot${lotId}`)
    if (channel !== null) {
      const message = await this._buildMessage(lotId, proposedPrice, createdAt)
      channel.broadcastToAll('new:bid', message)
    }
  }

  async _buildMessage (lotId, proposedPrice, createdAt) {
    const customerName = await this._buildCustomerName(lotId)
    return {
      customer: customerName,
      proposed_price: proposedPrice,
      created_at: createdAt
    }
  }

  async _buildCustomerName (lotId) {
    const lot = await Lot.find(lotId)
    const userCount = await lot.bids().countDistinct('user_id')
    return `Customer ${userCount[0]['count']}`
  }
}

module.exports = BidSockets
