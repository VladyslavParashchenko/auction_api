'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Lot = use('App/Models/Lot')
const Antl = use('Antl')
class StoreLotToRequest {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ response, request, params, auth }, next) {
    try {
      const lot = await Lot.findOrFail(params.lot_id)
      request.lot = lot
    } catch (e) {
      return response.status(404).send({ message: Antl.formatMessage('message.LotNotFound') })
    }
    await next()
  }
}

module.exports = StoreLotToRequest
