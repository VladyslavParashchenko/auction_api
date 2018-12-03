'use strict'
const Mail = use('Mail')
const Env = use('Env')
const LotStatusJob = use('LotStatusJob')
const Bid = use('App/Models/Bid')
const Lot = exports = module.exports = {}
Lot.created = async (lotInstance) => {
  const lot = {
    id: lotInstance.id,
    title: lotInstance.title,
    start_time: lotInstance.start_time,
    end_time: lotInstance.end_time
  }
  try {
    lotInstance.lot_start_job_id = await LotStatusJob.addJobToQueue(lot, LotStatusJob.START_TIME_JOB, new Date(lot.start_time))
    lotInstance.lot_end_job_id = await LotStatusJob.addJobToQueue(lot, LotStatusJob.END_TIME_JOB, new Date(lot.end_time))
  } catch (e) {
    console.log(e)
  }
  await lotInstance.save()
}

Lot.foundWinner = async (lot) => {
  const bid = await lot.bids().orderBy('proposed_price', 'desc').first()
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
}

Lot.started = async (lotData) => {
  const lot = await Lot.find(lotData.id)
  lot.status = 'inProcess'
  lot.start_job_id = null
  await lot.save()
}

Lot.closed = async (lotData) => {
  const lot = await Lot.find(lotData)
  lot.status = 'closed'
  lot.end_job_id = null
  await lot.save()
}
