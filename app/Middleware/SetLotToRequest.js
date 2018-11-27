'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const Antl = use('Antl')
const Lot = use('App/Models/Lot')
class SetLotToRequest {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, params, response }, next) {
    try {
      const lot = await Lot.findOrFail(params.lot_id)
      request.lot = lot
    } catch (e) {
      return response.status(403).json({ message: Antl.formatMessage('message.LotNotFound') })
    }
    await next()
  }
}

module.exports = SetLotToRequest
