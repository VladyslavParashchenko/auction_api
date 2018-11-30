'use strict'
const BaseController = use('App/Controllers/Http/BaseController')

const Bid = use('App/Models/Bid')

class BidController extends BaseController {
  async store ({ request, response, auth }) {
    try {
      const bid = await Bid.create(this._bidParams(request, auth))
      await bid.lot().update({ 'current_price': bid.proposed_price })
      response.json(bid)
    } catch (e) {
      this.handleException(response, e)
    }
  }

  _bidParams (request, auth) {
    const bidParams = this.paramsFromRequest(request, ['proposed_price'])
    bidParams.user_id = auth.user.id
    bidParams.lot_id = request.lot.id
    return bidParams
  }
}

module.exports = BidController
