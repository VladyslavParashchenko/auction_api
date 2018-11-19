'use strict';

class UserRegistration {
  get rules () {
    return {
      email: 'required|email|unique:users',
      password: 'required|confirmed',
      birth_day: 'required|date|before_offset_of:4,months',
      phone: 'required'
    };
  }
}

module.exports = UserRegistration;
