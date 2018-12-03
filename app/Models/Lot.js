'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Event = use('Event')
class Lot extends Model {
  static boot () {
    super.boot()
    this.addHook('beforeCreate', async (lotInstance) => {
      lotInstance.status = 'pending'
    })

    this.addHook('afterCreate', async (lotInstance) => {
      Event.fire('lot::created', lotInstance)
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

  static scopeUserLots (query, userId) {
    return query.select('lots.*').leftJoin('bids', 'lots.id', 'bids.lot_id')
      .whereRaw('bids.user_id = ? or lots.user_id = ?', [userId, userId])
  }

  static scopeLotAvailableToUser (query, { lotId, userId }) {
    const inProcessStatus = 'inProcess'
    return query.select('lots.*').leftJoin('bids', 'lots.id', 'bids.lot_id')
      .whereRaw('(bids.user_id = ? or lots.user_id = ? or status = ?) and (lots.id = ?)',
        [userId, userId, inProcessStatus, lotId])
  }

  static scopeFilter (query, { filter, userId }) {
    if (filter.ownLot === 'true') {
      return query.userLots(userId)
    } else {
      return query.inProcess()
    }
  }
  bids () {
    return this.hasMany('App/Models/Bid').orderBy('created_at', 'desc')
  }

  user () {
    return this.belongsTo('App/Models/User')
  }
}

module.exports = Lot
