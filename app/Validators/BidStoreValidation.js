'use strict'

const BaseValidator = use('App/Validators/BaseValidator')

class BidStoreValidation extends BaseValidator {
  get rules () {
    const lot = this.ctx.request.lot
    return {
      proposed_price: `required|number|above:${lot.current_price}`
    }
  }
  get sanitizationRules () {
    return {
      start_date: 'to_date',
      end_date: 'to_date'
    }
  }
}

module.exports = BidStoreValidation
