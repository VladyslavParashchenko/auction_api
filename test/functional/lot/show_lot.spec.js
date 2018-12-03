'use strict'

const { test, trait, before, after } = use('Test/Suite')('Lot - show')
const { Route, Event, Factory, Lot, Antl, Database } = require('../../helper/dependencyHelper.js')
trait('Auth/Client')
trait('DatabaseTransactions')
trait('Test/ApiClient')

before(function () {
  Event.fake()
})
test('should return lot', async ({ client, assert }) => {
  const user = await Factory.model('App/Models/User').create()
  const lot = await Factory.model('App/Models/Lot').create({ user_id: user.id })
  await Lot.query().update({ status: 'inProcess' })
  const response = await client
    .get(Route.url('lots.show', { id: lot.id }))
    .loginVia(user)
    .end()
  const lotFromResponse = JSON.parse(response.text)
  response.assertStatus(200)
  assert.equal(lot.id, lotFromResponse.id)
})

test('should return error, because lot belongs to other user and is not in progress', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()
  const otherUser = await Factory.model('App/Models/User').create()
  const lot = await Factory.model('App/Models/Lot').create({ user_id: user.id })
  const response = await client
    .get(Route.url('lots.show', { id: lot.id }))
    .loginVia(otherUser)
    .end()
  response.assertStatus(404)
  response.assertJSONSubset({ message: Antl.formatMessage('message.ModelNotFoundException') })
})

test('should return lot with bids', async ({ client, assert }) => {
  const lotCreator = await Factory.model('App/Models/User').create()
  const user = await Factory.model('App/Models/User').create()
  const lot = await Factory.model('App/Models/Lot').create({ user_id: lotCreator.id })
  const bid = await Factory.model('App/Models/Bid').create({ lot, user })
  await Lot.query().update({ status: 'inProcess' })
  const response = await client
    .get(Route.url('lots.show', { id: lot.id }))
    .loginVia(user)
    .end()
  response.assertStatus(200)
  response.assertJSONSubset({ 'bids': [{
    proposed_price: bid.proposed_price,
    customer: 'You'
  } ] })
})

test('should return lot with bids, which serialized correct ', async ({ client, assert }) => {
  const lotCreator = await Factory.model('App/Models/User').create()
  const user = await Factory.model('App/Models/User').create()
  const lot = await Factory.model('App/Models/Lot').create({ user_id: lotCreator.id })
  const bids = await Factory.model('App/Models/Bid').createMany(5, { lot, user })
  await Lot.query().update({ status: 'inProcess' })
  const response = await client
    .get(Route.url('lots.show', { id: lot.id }))
    .loginVia(lotCreator)
    .end()
  const serializedBids = bids.map((bid) => {
    return {
      proposed_price: bid.proposed_price,
      customer: 'Customer 1',
      created_at: bid.created_at
    }
  })
  response.assertStatus(200)
  response.assertJSONSubset({ 'bids': serializedBids })
})

after(async () => {
  Event.restore()
})
