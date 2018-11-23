'use strict'

const BaseValidator = use('App/Validators/BaseValidator')

class UserResetPassword extends BaseValidator {
  get rules () {
    return {
      email: 'required|email',
      restore_password_url: 'required|string'
    }
  }
}

module.exports = UserResetPassword
