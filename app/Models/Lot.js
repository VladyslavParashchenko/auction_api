'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Lot extends Model {
  static boot () {
    super.boot()
    this.addHook('beforeCreate', async (lotInstance) => {
      lotInstance.status = 'pending'
    })
  }

  static scopePending (query) {
    return query.where('status', 'pending')
  }

  static scopeInProcess (query) {
    return query.where('status', 'inProcess')
  }

  static scopeClosed (query) {
    return query.where('status', 'closed')
  }

  static scopeInProcessOrUserLot (query, userId) {
    const inProcessStatus = 'inProcess'
    return query.whereRaw('status = ? or user_id = ?', [inProcessStatus, userId])
  }
}

module.exports = Lot
