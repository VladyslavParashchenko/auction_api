'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */

class User extends Model {
  static boot () {
    super.boot()
    this.addHook('beforeSave', 'UserHook.hashPassword')
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  tokens () {
    return this.hasMany('App/Models/Token')
  }

  static get visible () {
    return ['id', 'email', 'first_name', 'last_name', 'phone', 'birth_day']
  }

  lots () {
    return this.hasMany('App/Models/Lot')
  }

  bids () {
    return this.hasMany('App/Models/Bid')
  }

  orders () {
    return this.hasMany('App/Models/Order')
  }
}

module.exports = User
