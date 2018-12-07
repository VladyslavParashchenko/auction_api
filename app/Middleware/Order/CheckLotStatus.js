'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Antl = use('Antl')

class CheckLotStatus {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ response, request, params, auth }, next) {
    if (request.lot.status !== 'closed') {
      return response.status(400).formatMessage({ message: Antl.formatMessage('message.LotIsNotClosedYet') })
    }
    await next()
  }
}

module.exports = CheckLotStatus
