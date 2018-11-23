'use strict';

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

  static scopeMyLots (query, user) {
    return query.select('lots.*').leftJoin('bids', 'lots.id', 'bids.lot_id')
      .whereRaw('bids.user_id = ? or lots.user_id = ?', [user.id, user.id])
  }
  static scopeInProcessOrUserLot (query, userId) {
    const inProcessStatus = 'inProcess'
    return query.whereRaw('status = ? or user_id = ?', [inProcessStatus, userId])
  }

  bids () {
    return this.hasMany('App/Models/Bid').orderBy('created_at', 'desc')
  }

module.exports = Lot;
