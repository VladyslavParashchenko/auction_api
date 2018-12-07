'use strict'

const { test, trait, after, before } = use('Test/Suite')('Bid - store')
const Route = use('Route')
const Factory = use('Factory')
const Antl = use('Antl')
const queue = require('kue').createQueue()
const Event = use('Event')
const Database = use('Database')
const Lot = use('App/Models/Lot')
trait('Auth/Client')
trait('Test/ApiClient')
before(async () => {
  Event.fake()
})

before(function () {
  queue.testMode.enter()
})
test('should create new bid', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()
  const lot = await Factory.model('App/Models/Lot').create({ user_id: user.id })
  const otherUser = await Factory.model('App/Models/User').create()
  await Lot.query().update({ status: 'inProcess' })
  const data = { proposed_price: lot.current_price + 100 }
  const response = await client
    .post(Route.url('bids.store', { lot_id: lot.id }))
    .send(data)
    .loginVia(otherUser)
    .accept('json')
    .end()
  response.assertStatus(200)
  response.assertJSONSubset({
    proposed_price: data.proposed_price,
    user_id: otherUser.id
  })
})

test('should return error, proposed price less than current price', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()
  const lot = await Factory.model('App/Models/Lot').create({ user_id: user.id })
  const data = { proposed_price: lot.current_price - 100 }
  const otherUser = await Factory.model('App/Models/User').create()
  await Lot.query().update({ status: 'inProcess' })
  const response = await client
    .post(Route.url('bids.store', { lot_id: lot.id }))
    .send(data)
    .loginVia(otherUser)
    .accept('json')
    .end()
  response.assertStatus(400)
  response.assertJSONSubset({ message: Antl.formatMessage('message.ProposedPriceError') })
})

test('should return error, when user try add bid to own lot', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()
  const lot = await Factory.model('App/Models/Lot').create({ user_id: user.id })
  const data = { proposed_price: lot.current_price + 100 }
  await Lot.query().update({ status: 'inProcess' })
  const response = await client
    .post(Route.url('bids.store', { lot_id: lot.id }))
    .send(data)
    .loginVia(user)
    .accept('json')
    .end()
  response.assertStatus(403)
  response.assertError({ message: Antl.formatMessage('message.YouCanNotAddBidForYourOwnLot') })
})

test('should run event, which is responsible for the purchase of the lot', async ({ client, assert }) => {
  const user = await Factory.model('App/Models/User').create()
  const lot = await Factory.model('App/Models/Lot').create({ user_id: user.id })
  const data = { proposed_price: lot.estimated_price + 100 }
  const otherUser = await Factory.model('App/Models/User').create()
  await Lot.query().update({ status: 'inProcess' })
  const response = await client
    .post(Route.url('bids.store', { lot_id: lot.id }))
    .send(data)
    .loginVia(otherUser)
    .accept('json')
    .end()
  response.assertStatus(200)
  const recentEvent = Event.pullRecent()
  assert.equal(recentEvent.event, 'lot::closeLot')
})

after(async () => {
  Event.restore()
  await Database.table('users').delete()
  queue.testMode.clear()
  queue.testMode.exit()
})
