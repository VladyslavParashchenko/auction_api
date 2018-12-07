'use strict'

const BaseController = use('App/Controllers/Http/BaseController')

class OrderController extends BaseController {
  async store ({ request, response, auth, params }) {
    try {
      const order = await request.lot.order().create(this._orderParams(request, auth))
      return response.send(order)
    } catch (e) {
      this.handleException(e, response)
    }
  }

  async update ({ request, response }) {
    try {
      const order = await request.lot.order().fetch()
      order.merge(this._orderParamsForUpdate(request))
      order.save()
      return response.send(order)
    } catch (e) {
      this.handleException(e, response)
    }
  }

  _orderParams (request, auth) {
    const params = request.only(['arrivalType', 'arrivalLocation'])
    params.user_id = auth.user.id
    return params
  }

  _orderParamsForUpdate (request) {
    return request.only(['arrivalType', 'arrivalLocation', 'status'])
  }
}

module.exports = OrderController
