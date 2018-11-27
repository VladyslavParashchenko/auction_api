'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const Antl = use('Antl')

class CheckBidCreator {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, response, auth }, next) {
    if (request.lot.user_id === auth.user.id) {
      return response.status(400).json({ message: Antl.formatMessage('message.YouCanNotAddBidForYourOwnLot') })
    }
    await next()
  }
}

module.exports = CheckBidCreator
