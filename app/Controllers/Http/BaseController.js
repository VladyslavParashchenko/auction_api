'use strict';

const crypto = require('crypto');

class BaseController {
  getToken () {
    crypto.randomBytes(24).toString('hex');
  }
}

module.exports = BaseController;
