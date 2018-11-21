'use strict';

const BaseValidator = use('App/Validators/BaseValidator');

class UserRegistration extends BaseValidator {
  get validateAll () {
    return true;
  }

  get rules () {
    return {
      email: 'required|email|unique:users',
      password: 'required|confirmed',
      birth_day: 'required|date|before_offset_of:21,years',
      phone: 'required',
      first_name: 'required',
      last_name: 'required'
    };
  }
}

module.exports = UserRegistration;
