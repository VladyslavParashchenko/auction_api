'use strict'
const Antl = use('Antl')

class BaseController {
  paramsFromRequest (request, paramsList) {
    return request.only(paramsList)
  }

  handleException (response, exception) {
    switch (exception.name) {
      case 'ModelNotFoundException':
        response.status(404).json({ message: Antl.formatMessage('message.ModelNotFoundException') })
        break
      case 'InvalidRefreshToken':
        response.status(401).json({ message: Antl.formatMessage('message.InvalidRefreshToken') })
        break
      default:
        throw exception
    }
  }
}

module.exports = BaseController
