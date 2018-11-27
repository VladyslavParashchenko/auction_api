'use strict'

const BaseController = use('App/Controllers/Http/BaseController')
const UploadService = use('App/Uploader/LotImageUploader')
const Lot = use('App/Models/Lot')
const Antl = use('Antl')

class LotController extends BaseController {
  constructor () {
    super()
    this.requiredParams = ['title', 'image', 'description', 'start_time', 'end_time', 'current_price',
      'estimated_price']
  }

  async store ({ response, request, auth }) {
    try {
      const lot = await new Lot()
      lot.fill(this.paramsFromRequest(request))
      const filePath = await this.saveFile(request, 'image')
      lot.image = filePath
      await auth.user.lots().save(lot)
      return response.json(lot)
    } catch (e) {
      response.status(400).json({ message: e.message })
    }
  }

  async update ({ response, request, auth, params }) {
    try {
      const lot = await auth.user.lots().pending().where('id', params.id).first()
      lot.merge(this.paramsFromRequest(request))
      const filePath = await this.saveFile(request, 'image')
      lot.image = filePath || lot.image
      await lot.save()
      return response.status(200).json(lot)
    } catch (e) {
      return response.status(403).json({ message: Antl.formatMessage('message.LotNotFound') })
    }
  }

  async destroy ({ response, request, auth, params }) {
    try {
      const lot = await auth.user.lots().where('id', params.id).first()
      await lot.delete()
      return response.status(200).json(lot)
    } catch (e) {
      return response.status(403).json({ message: Antl.formatMessage('message.LotNotFound') })
    }
  }

  // TODO: rewrite method when bids will be realize
  async my ({ response, request, auth }) {
    try {
      const lots = await auth.user.lots().paginate(...this.paginationParams(request.all()))
      return response.status(200).json(lots)
    } catch (e) {
      return response.status(403).json({ message: e.message })
    }
  }

  async show ({ response, request, auth, params }) {
    try {
      const lot = await Lot.query().inProcessOrUserLot(auth.user.id).where('id', params.id).firstOrFail()
      return response.status(200).json(lot)
    } catch (e) {
      return response.status(403).json({ message: Antl.formatMessage('message.LotNotFound') })
    }
  }

  async index ({ response, request }) {
    try {
      const lots = await Lot.query().inProcess().paginate(...this.paginationParams(request.all()))
      return response.status(200).json(lots)
    } catch (e) {
      return response.status(403).json({ message: e.message })
    }
  }

  async saveFile (request, fieldName) {
    const uploader = new UploadService(request)
    const filePath = await uploader.uploadFile(fieldName)
    return filePath
  }
}

module.exports = LotController
