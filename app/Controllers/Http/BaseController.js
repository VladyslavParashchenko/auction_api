'use strict'

const crypto = require('crypto')

class BaseController {
  getToken () {
    crypto.randomBytes(24).toString('hex')
  }

  paramsFromRequest (request) {
    return request.only(this.requiredParams)
  }

  paginationParams (params) {
    const page = params['page'] || 1
    const perPage = params['per_page'] || 10
    return [page, perPage]
  }
}

module.exports = BaseController
