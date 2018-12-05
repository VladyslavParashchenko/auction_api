'use strict'

const BaseValidator = use('App/Validators/BaseValidator')

class BidStoreValidation extends BaseValidator {
  get rules () {
    return {
      proposed_price: `required|number`
    }
  }
}

module.exports = BidStoreValidation
