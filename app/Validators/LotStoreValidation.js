'use strict'

const BaseValidator = use('App/Validators/BaseValidator')

class LotStoreValidation extends BaseValidator {
  get rules () {
    const params = this.ctx.request.all()
    return {
      title: 'required',
      start_time: `required|date|after:${new Date().toISOString()}`,
      end_time: `required|date|after:${params.start_time}`,
      current_price: 'required|number|above:0',
      estimated_price: `required|number|above:${params.current_price}`
    }
  }
  get sanitizationRules () {
    return {
      start_date: 'to_date',
      end_date: 'to_date'
    }
  }

  get messages () {
    const baseMessage = super.messages
    const currentMessage = {
      'above': '{{field}} have to be greater than'
    }
    return { ...baseMessage, ...currentMessage }
  }
}

module.exports = LotStoreValidation
