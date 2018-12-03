'use strict'
const Mail = use('Mail')
const Env = use('Env')
const LotStatusJob = use('LotStatusJob')
const Logger = use('Logger')
const LotModel = use('App/Models/Lot')
const Lot = exports = module.exports = {}
Lot.created = async (lotInstance) => {
  const lot = {
    id: lotInstance.id,
    title: lotInstance.title
  }
  try {
    lotInstance.lot_start_job_id = await LotStatusJob.addJobToQueue(lot, LotStatusJob.START_TIME_JOB, new Date(lot.start_time))
    lotInstance.lot_end_job_id = await LotStatusJob.addJobToQueue(lot, LotStatusJob.END_TIME_JOB, new Date(lot.end_time))
  } catch (e) {
    Logger.warning('Event error: %s', e.message)
  }
  await lotInstance.save()
}

Lot.foundWinner = async (lot) => {
  try {
    const bid = await lot.bids().orderBy('proposed_price', 'desc').firstOfFail()
    lot.winner_bid_id = bid.id
    await lot.save()
    const lotOwner = await lot.user().fetch()
    const bidOwner = await bid.user().fetch()
    await Mail.send('emails.lot_purchased', { lot, lotOwner, bid }, (message) => {
      message.to(lotOwner.email)
      message.from(Env.get('EMAIL_SENDER_EMAIL'))
    })
    await Mail.send('emails.you_purchase_lot', { lot, bidOwner, bid }, (message) => {
      message.to(bidOwner.email)
      message.from(Env.get('EMAIL_SENDER_EMAIL'))
    })
  } catch (e) {
    if (e.name === 'ModelNotFoundException') {
      const lotOwner = lot.user().fetch()
      await Mail.send('emails.lot_not_purchased', { lot, lotOwner }, (message) => {
        message.to(lotOwner.email)
        message.from(Env.get('EMAIL_SENDER_EMAIL'))
      })
    }
  }
class Lot {
  async purchased (lot) {
    const bid = await lot.winnerBid().fetch()
    const lotOwner = await lot.user().fetch()
    const bidOwner = await bid.user().fetch()
    await Mail.send('emails.lot_purchased', { lot, lotOwner, bid }, (message) => {
      message.to(lotOwner.email)
      message.from(Env.get('EMAIL_SENDER_EMAIL'))
    })
    await Mail.send('emails.you_purchase_lot', { lot, bidOwner, bid }, (message) => {
      message.to(bidOwner.email)
      message.from(Env.get('EMAIL_SENDER_EMAIL'))
    })
  }
}

Lot.started = async (lotData) => {
  const lot = await Lot.find(lotData.id)
  lot.status = 'inProcess'
  lot.lot_start_job_id = null
  await lot.save()
}

Lot.closed = async (lotData) => {
  const lot = await Lot.find(lotData)
  lot.status = 'closed'
  lot.lot_end_job_id = null
  await lot.save()
}

Lot.updated = async ({ lotId, lotUpdatedField }) => {
  try {
    const lotInstance = LotModel.findOrFail(lotId)
    const lot = {
      id: lotInstance.id,
      title: lotUpdatedField.title || lotInstance.title
    }
    if (lotUpdatedField.hasOwnProperty('start_time')) {
      lotInstance.lot_start_job_id = await LotStatusJob.addJobToQueue(lot, LotStatusJob.START_TIME_JOB, new Date(lot.start_time))
    }
    if (lotUpdatedField.hasOwnProperty('end_time')) {
      lotInstance.lot_end_job_id = await LotStatusJob.addJobToQueue(lot, LotStatusJob.END_TIME_JOB, new Date(lot.end_time))
    }
  } catch (e) {
    Logger.warning('Event error: %s', e.message)
  }
}

module.exports = Lot
