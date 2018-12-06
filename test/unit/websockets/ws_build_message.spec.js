'use strict'

const { test, after, before } = use('Test/Suite')('Bid - store')
const BidSocket = use('BidSocket')
const { Factory, Event, queue } = require('../../helper/dependencyHelper.js')

before(function () {
  Event.fake()
  queue.testMode.enter()
})
test('should websocket helper builds correct message', async ({ assert }) => {
  const user = await Factory.model('App/Models/User').create()
  const lot = await Factory.model('App/Models/Lot').create({ user_id: user.id })
  const otherUser = await Factory.model('App/Models/User').create()
  const bid = await Factory.model('App/Models/Bid').create({ user: otherUser, lot: lot })
  const message = await BidSocket._buildMessage(lot.id, bid.proposed_price, bid.created_at)
  assert.include(message, { customer: 'Customer 1', proposed_price: bid.proposed_price, created_at: bid.created_at })
})

after(async () => {
  Event.restore()
  queue.testMode.clear()
  queue.testMode.exit()
})
