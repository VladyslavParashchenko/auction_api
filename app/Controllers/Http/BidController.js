'use strict'
const BaseController = use('App/Controllers/Http/BaseController')
const Lot = use('App/Models/Lot')
const Bid = use('App/Models/Bid')

class BidController extends BaseController {
  constructor () {
    super()
    this.requiredParams = ['proposed_price']
  }

  async store ({ request, response, params, auth }) {
    try {
      const bid = await Bid.create(this.paramsFromRequest(request, params, auth))
      bid.lot().update({ 'current_price': bid.proposed_price })
      response.json(bid)
    } catch (e) {
      response.status(400).json({ message: e.message })
    }
  }

  paramsFromRequest (request, params, auth) {
    const bidParams = super.paramsFromRequest(request)
    bidParams.user_id = auth.user.id
    bidParams.lot_id = params.lot_id
    return bidParams
  }
}

module.exports = BidController
