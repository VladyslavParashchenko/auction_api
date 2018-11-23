'use strict'

const BaseValidator = use('App/Validators/BaseValidator')

class UserConfirmation extends BaseValidator {
  get rules () {
    return {
      confirmation_token: 'required|string'
    }
  }
}

module.exports = UserConfirmation
