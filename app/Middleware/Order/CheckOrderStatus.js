'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Antl = use('Antl')

class CheckOrderStatus {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ response, request, params, auth }, next) {
    const order = await request.lot.order().fetch()
    const { lot } = request
    const { status } = request.all()
    switch (status) {
      case 'sent':
        if ((order.status !== 'pending') || (lot.user_id !== auth.user.id)) {
          return response.status(403).send({ message: Antl.formatMessage('message.PermissionDenied') })
        }
        break
      case 'delivered':
        if ((order.status !== 'sent') || (order.user_id !== auth.user.id)) {
          return response.status(403).send({ message: Antl.formatMessage('message.PermissionDenied') })
        }
        break
    }
    await next()
  }
}

module.exports = CheckOrderStatus
