'use strict';

const BaseValidator = use('App/Validators/BaseValidator');

class UserLogin extends BaseValidator {
  get rules () {
    return {
      email: 'required|email',
      password: 'required'
    };
  }
}

module.exports = UserLogin;
