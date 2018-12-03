'use strict'

const BaseController = use('App/Controllers/Http/BaseController')
const Uploader = use('Uploader')
const Lot = use('App/Models/Lot')
const BidPostSerializer = use('BidPostSerializerService')
const Event = use('Event')
class LotController extends BaseController {
  async store ({ response, request, auth }) {
    try {
      const lot = await new Lot()
      lot.fill(this._lotParams(request))
      lot.image = await this.saveFile(request, 'image')
      await auth.user.lots().save(lot)
      return response.json(lot)
    } catch (e) {
      this.handleException(e, response)
    }
  }

  async update ({ response, request, auth, params }) {
    try {
      const lot = await auth.user.lots().pending().where('id', params.id).firstOrFail()
      lot.merge(this._lotParams(request))
      const filePath = await this.saveFile(request, 'image')
      lot.image = filePath || lot.image
      await lot.save()
      Event.fire('lot::updated', { lotId: lot.id, lotUpdatedField: this._lotParams(request) })
      return response.json(lot)
    } catch (e) {
      this.handleException(e, response)
    }
  }

  async destroy ({ response, request, auth, params }) {
    try {
      const lot = await auth.user.lots().pending().where('id', params.id).firstOrFail()
      await lot.delete()
      return response.json(lot)
    } catch (e) {
      this.handleException(e, response)
    }
  }

  async show ({ response, request, auth, params }) {
    try {
      const lot = await Lot.query().lotAvailableToUser({ userId: auth.user.id, lotId: params.id }).with('bids').firstOrFail()
      let serializedLot = lot.toJSON()
      serializedLot = BidPostSerializer.markBids(serializedLot, auth.user.id)
      return response.json(serializedLot)
    } catch (e) {
      this.handleException(e, response)
    }
  }

  async index ({ response, request, auth }) {
    try {
      const lots = await Lot.query().filter({ filter: request.all(), userId: auth.user.id })
        .paginate(...this.paginationParams(request.all()))
      return response.status(200).json(lots)
    } catch (e) {
      this.handleException(e, response)
    }
  }

  async saveFile (request, fieldName) {
    const file = request.file(fieldName)
    if (file !== null) {
      const filePath = await Uploader.uploadFile(file)
      return filePath
    } else {
      return ''
    }
  }

  _lotParams (request) {
    return request.only(['title', 'image', 'description', 'start_time', 'end_time', 'current_price',
      'estimated_price'])
  }
}

module.exports = LotController
