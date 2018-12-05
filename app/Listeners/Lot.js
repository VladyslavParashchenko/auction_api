'use strict'
const Mail = use('Mail')
const Env = use('Env')
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

module.exports = Lot
