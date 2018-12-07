'use strict'

class BaseValidator {
  get validateAll () {
    return true
  }

  get messages () {
    let messages = {
      'required': '{{field}} is required',
      'confirmed': '{{field}} have to be confirmed',
      'date': '{{field}} have to be valid date',
      'email': '{{field}} have to be valid email',
      'unique': 'The value of {{field}} have to be required',
      'string': '{{field}} gave to be string'

    }
    return messages
  }
}

module.exports = BaseValidator
