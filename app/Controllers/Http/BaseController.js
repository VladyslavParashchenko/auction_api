'use strict'
const Antl = use('Antl')

class BaseController {
  handleException (response, exception) {
    switch (exception.name) {
      case 'ModelNotFoundException':
        response.status(404).send({ message: Antl.formatMessage('message.ModelNotFoundException') })
        break
      case 'InvalidRefreshToken':
        response.status(401).send({ message: Antl.formatMessage('message.InvalidRefreshToken') })
        break
      default:
        throw exception
    }
  }
}

module.exports = BaseController
