'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const Antl = use('Antl')
const Lot = use('App/Models/Lot')
class CheckBidCreator {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, response, auth, params }, next) {
    try {
      const lot = await Lot.findOrFail(params.lot_id)
      if (lot.user_id === auth.user.id) {
        return response.status(403).send({ message: Antl.formatMessage('message.YouCanNotAddBidForYourOwnLot') })
      }
    } catch (e) {
      return response.status(404).send({ message: Antl.formatMessage('message.LotNotFound') })
    }

    await next()
  }
}

module.exports = CheckBidCreator
