'use strict'
const Antl = use('Antl')

class BaseController {
  handleException (exception, response) {
    switch (exception.name) {
      case 'ModelNotFoundException':
        response.status(404).send({ message: Antl.formatMessage('message.ModelNotFoundException') })
        break
      case 'InvalidRefreshToken':
        response.status(401).send({ message: Antl.formatMessage('message.InvalidRefreshToken') })
        break
      case 'FileUploaderException':
        response.status(400).send({ message: exception.message })
        break
      default:
        throw exception
    }
  }

  paginationParams ({ page = 1, perPage = 10 }) {
    return [page, perPage]
  }
}
module.exports = BaseController
