'use strict'

const userFactory = require('./user_factory')
const tokenFactory = require('./token_factory')
const lotFactory = require('./lot_factory')

module.exports = {
  'App/Models/User': userFactory,
  'App/Models/Token': tokenFactory,
  'App/Models/Lot': lotFactory
}
