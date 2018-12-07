'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Antl = use('Antl')

class CheckUser {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ response, request, params, auth }, next) {
    const winnerBid = await request.lot.winnerBid().fetch()
    if (winnerBid.user_id !== auth.user.id) {
      return response.status(403).send({ message: Antl.formatMessage('message.YouNotBoughtThisLot') })
    }
    await next()
  }
}

module.exports = CheckUser
