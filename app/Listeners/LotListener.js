'use strict'
const Mail = use('Mail')
const Env = use('Env')
const LotStatusJob = use('LotStatusJob')
const Logger = use('Logger')
const Lot = use('App/Models/Lot')

class LotListener {
  async purchased (lot) {
    const bid = await
    lot.winnerBid().fetch()
    const lotOwner = await lot.user().fetch()
    const bidOwner = await bid.user().fetch()
    await
    Mail.send('emails.lot_purchased', { lot, lotOwner, bid }, (message) => {
      message.to(lotOwner.email)
      message.from(Env.get('EMAIL_SENDER_EMAIL'))
    })
    await
    Mail.send('emails.you_purchase_lot', { lot, bidOwner, bid }, (message) => {
      message.to(bidOwner.email)
      message.from(Env.get('EMAIL_SENDER_EMAIL'))
    })
  }

  async created (lotInstance) {
    const lot = {
      id: lotInstance.id,
      title: lotInstance.title
    }
    try {
      lotInstance.lot_start_job_id = await LotStatusJob.addJobToQueue(lot, LotStatusJob.START_TIME_JOB,
        new Date(lot.start_time))
      lotInstance.lot_end_job_id = await LotStatusJob.addJobToQueue(lot, LotStatusJob.END_TIME_JOB,
        new Date(lot.end_time))
    } catch (e) {
      Logger.warning('Event error: %s', e.message)
    }
    await lotInstance.save()
  }

  async foundWinner ({ lotId, jobId }) {
    let lot
    try {
      lot = await Lot.find(lotId)
      if (lot.lot_end_job_id !== parseInt(jobId)) {
        return
      }
      const bid = await lot.bids().orderBy('proposed_price', 'desc').firstOrFail()
      lot.status = 'closed'
      lot.winner_bid_id = bid.id
      await lot.save()
      const lotOwner = await lot.user().fetch()
      const bidOwner = await bid.user().fetch()
      await this._sendEmail({ lot, lotOwner, bid }, 'emails.lot_purchased', lotOwner.email)
      await this._sendEmail({ lot, bidOwner, bid }, 'emails.you_purchase_lot', bidOwner.email)
    } catch (e) {
      if (e.name === 'ModelNotFoundException') {
        const lotOwner = lot.user().fetch()
        await this._sendEmail({ lot, lotOwner }, 'emails.lot_not_purchased', lotOwner.email)
      }
    }
  }

  async started ({ lotId, jobId }) {
    const lot = await Lot.find(lotId)
    if ((lot != null) && (lot.lot_start_job_id === parseInt(jobId))) {
      lot.status = 'inProcess'
      await lot.save()
    }
  }

  async updated ({ lotId, lotUpdatedField }) {
    try {
      const lotInstance = Lot.findOrFail(lotId)
      const lot = {
        id: lotInstance.id,
        title: lotUpdatedField.title || lotInstance.title
      }
      if (lotUpdatedField.hasOwnProperty('start_time')) {
        lotInstance.lot_start_job_id = await
        LotStatusJob.addJobToQueue(lot, LotStatusJob.START_TIME_JOB, new Date(lot.start_time))
      }
      if (lotUpdatedField.hasOwnProperty('end_time')) {
        lotInstance.lot_end_job_id = await
        LotStatusJob.addJobToQueue(lot, LotStatusJob.END_TIME_JOB, new Date(lot.end_time))
      }
    } catch (e) {
      Logger.warning('Event error: %s', e.message)
    }
  }

  async _sendEmail (data, emailView, recepient) {
    await Mail.send(emailView, data, (message) => {
      message.to(recepient)
      message.from(Env.get('EMAIL_SENDER_EMAIL'))
    })
  }
}

module.exports = LotListener
