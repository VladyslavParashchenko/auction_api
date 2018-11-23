'use strict'
const Antl = use('Antl')

class BaseController {
  getToken () {
    crypto.randomBytes(24).toString('hex');
  }

  handleException (response, exception) {
    switch (exception.name) {
      case 'ModelNotFoundException':
        response.status(404).json({ message: Antl.formatMessage('message.ModelNotFoundException') })
        break
      case 'InvalidRefreshToken':
        response.status(401).json({ message: Antl.formatMessage('message.InvalidRefreshToken') })
        break
      case 'FileUploaderException':
        response.status(400).json({ message: exception.message })
        break
      default:
        throw exception
    }
  }

  paginationParams (request) {
    const params = request.all()
    const page = params['page'] || 1
    const perPage = params['per_page'] || 10
    return [page, perPage]
  }
}
module.exports = BaseController
