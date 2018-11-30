'use strict'

const BaseController = use('App/Controllers/Http/BaseController')
const UploadService = use('LotImageUploader')
const Lot = use('App/Models/Lot')
const BidPostSerializer = use('BidPostSerializerService')
class LotController extends BaseController {
  async store ({ response, request, auth }) {
    try {
      const lot = await new Lot()
      lot.fill(this._lotParams(request))
      lot.image = await this.saveFile(request, 'image')
      await auth.user.lots().save(lot)
      return response.json(lot)
    } catch (e) {
      this.handleException(response, e)
    }
  }

  async update ({ response, request, auth, params }) {
    try {
      const lot = await auth.user.lots().pending().where('id', params.id).firstOrFail()
      lot.merge(this._lotParams(request))
      const filePath = await this.saveFile(request, 'image')
      lot.image = filePath || lot.image
      await lot.save()
      return response.json(lot)
    } catch (e) {
      this.handleException(response, e)
    }
  }

  async destroy ({ response, request, auth, params }) {
    try {
      const lot = await auth.user.lots().where('id', params.id).firstOrFail()
      await lot.delete()
      return response.json(lot)
    } catch (e) {
      this.handleException(response, e)
    }
  }

  async my ({ response, request, auth }) {
    try {
      const lots = await Lot.query().myLots(auth.user).paginate(...this.paginationParams(request))
      return response.json(lots)
    } catch (e) {
      this.handleException(response, e)
    }
  }

  async show ({ response, request, auth, params }) {
    try {
      const lot = await Lot.query().inProcessOrUserLot(auth.user.id).where('id', params.id).with('bids').firstOrFail()
      let serializedLot = lot.toJSON()
      serializedLot = BidPostSerializer.reformatBids(serializedLot, auth.user.id)
      return response.json(serializedLot)
    } catch (e) {
      this.handleException(response, e)
    }
  }

  async index ({ response, request }) {
    try {
      const lots = await Lot.query().inProcess().paginate(...this.paginationParams(request))
      return response.status(200).json(lots)
    } catch (e) {
      this.handleException(response, e)
    }
  }

  async saveFile (request, fieldName) {
    UploadService.setRequest(request)
    const filePath = await UploadService.uploadFile(fieldName)
    return filePath
  }

  _lotParams (request) {
    return this.paramsFromRequest(request, ['title', 'image', 'description', 'start_time', 'end_time', 'current_price',
      'estimated_price'])
  }
}

module.exports = LotController
