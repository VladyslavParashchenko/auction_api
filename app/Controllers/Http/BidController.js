'use strict'
const BaseController = use('App/Controllers/Http/BaseController')
const Lot = use('App/Models/Lot')

class BidController extends BaseController {
  async store ({ request, response, auth, params }) {
    try {
      const lot = await Lot.findOrFail(params.lot_id)
      const bid = await lot.bids().create(await this._bidParams(request, auth))
      response.json(bid)
    } catch (e) {
      this.handleException(e, response)
    }
  }

  _bidParams (request, auth) {
    const bidParams = request.only(['proposed_price'])
    bidParams.user_id = auth.user.id
    return bidParams
  }
}

module.exports = BidController
