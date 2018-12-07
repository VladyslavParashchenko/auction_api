'use strict'

const BaseValidator = use('App/Validators/BaseValidator')

class OrderValidation extends BaseValidator {
  get rules () {
    return {
      arrivalType: 'required|in:pickup,deliveryCompany',
      arrivalLocation: 'required|string'
    }
  }

  get messages () {
    const baseMessage = super.messages
    const currentMessage = {
      'arrivalType.in': 'Ensures the value of {{field}} matches one of expected values.'
    }
    return { ...baseMessage, ...currentMessage }
  }
}

module.exports = OrderValidation
