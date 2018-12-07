'use strict'
const BaseController = use('App/Controllers/Http/BaseController')
const Lot = use('App/Models/Lot')
const BidSocket = use('BidSocket')
class BidController extends BaseController {
  async store ({ request, response, auth, params }) {
    try {
      const lot = await Lot.findOrFail(params.lot_id)
      const bid = await lot.bids().create(await this._bidParams(request, auth))
      await this._broadcastBid(bid)
      response.send(bid)
    } catch (e) {
      this.handleException(e, response)
    }
  }

  _bidParams (request, auth) {
    const bidParams = request.only(['proposed_price'])
    bidParams.user_id = auth.user.id
    return bidParams
  }

  async _broadcastBid (bid) {
    await BidSocket.broadcastBid({
      bidId: bid.id,
      lotId: bid.lot_id,
      userId: bid.user_id,
      proposedPrice: bid.proposed_price,
      createdAt: bid.created_at
    })
  }
}

module.exports = BidController
