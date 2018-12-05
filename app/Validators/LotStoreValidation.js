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
      estimated_price: `required|number|above:${params.current_price}`,
      image: 'file_ext:png,jpg|file_types:image|file_size:2mb'
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
      'above': '{{field}} have to be greater than',
      'file_ext': 'Invalid {{field}} extension txt. Only {{argument.0}} are allowed',
      'file_type': 'Invalid {{field}} file type. Only {{argument.0}} are allowed',
      'file_size': '{{field}} have to be less than {{ argument.0 }}'
    }
    return { ...baseMessage, ...currentMessage }
  }
}

module.exports = LotStoreValidation
