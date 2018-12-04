'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const Antl = use('Antl')
const Lot = use('App/Models/Lot')
class CheckBidProposedPrice {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, params, response }, next) {
    try {
      const lot = await Lot.findOrFail(params.lot_id)
      if (lot.current_price > request.all().proposed_price) {
        return response.status(400).json({ message: Antl.formatMessage('message.ProposedPriceError') })
      }
    } catch (e) {
      return response.status(404).json({ message: Antl.formatMessage('message.LotNotFound') })
    }
    await next()
  }
}

module.exports = CheckBidProposedPrice
