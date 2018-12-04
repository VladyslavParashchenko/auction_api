'use strict'

const userFactory = require('./user_factory')
const tokenFactory = require('./token_factory')

module.exports = {
  'App/Models/User': userFactory,
  'App/Models/Token': tokenFactory
}
