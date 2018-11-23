'use strict'

const BaseValidator = use('App/Validators/BaseValidator')

class UserRegistration extends BaseValidator {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      email: 'required|email|unique:users',
      password: 'required|confirmed',
      birth_day: 'required|date|before_offset_of:21,years',
      phone: 'required',
      first_name: 'required|string',
      last_name: 'required|string'
    }
  }

  get messages () {
    const baseMessage = super.messages
    const currentMessage = {
      'birth_day.before_offset_of': 'You have to be older than 21 years'
    }
    return { ...baseMessage, ...currentMessage }
  }
}

module.exports = UserRegistration
