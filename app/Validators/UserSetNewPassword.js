'use strict'

const BaseValidator = use('App/Validators/BaseValidator')

class UserSetNewPassword extends BaseValidator {
  get rules () {
    return {
      password: 'required|confirmed',
      restore_password_token: 'required|string'
    }
  }
}

module.exports = UserSetNewPassword
