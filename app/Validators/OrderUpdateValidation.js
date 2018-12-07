'use strict'

const BaseValidator = use('App/Validators/BaseValidator')

class OrderUpdateValidation extends BaseValidator {
  get rules () {
    return {
      arrivalType: 'in:pickup,deliveryCompany',
      arrivalLocation: 'string',
      status: 'in:sent,delivered'
    }
  }

  get messages () {
    const baseMessage = super.messages
    const currentMessage = {
      'arrivalType.in': 'Ensures the value of {{field}} matches one of expected values.',
      'status.in': 'Ensures the value of {{field}} matches one of expected values.'
    }
    return { ...baseMessage, ...currentMessage }
  }
}

module.exports = OrderUpdateValidation
