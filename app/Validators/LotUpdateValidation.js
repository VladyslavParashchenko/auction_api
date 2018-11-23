'use strict'

const BaseValidator = use('App/Validators/BaseValidator')

class LotStoreValidation extends BaseValidator {
  get rules () {
    const params = this.ctx.request.all()
    return {
      start_time: `date|after:${new Date().toISOString()}`,
      end_time: `date|after:${params.start_time}`,
      current_price: 'number|above:0',
      estimated_price: `number|above:${params.current_price}`
    }
  }
  get sanitizationRules () {
    return {
      start_time: 'to_date',
      end_time: 'to_date'
    }
  }
}

module.exports = LotStoreValidation
