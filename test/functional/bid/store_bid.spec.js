'use strict'

const { test, trait, beforeEach } = use('Test/Suite')('Bid - store')
const Route = use('Route')
const Factory = use('Factory')
const dayjs = require('dayjs')
const validateErrorMaker = require('../../helper/generateValidatorError.js')
const Antl = use('Antl')
const Lot = use('App/Models/Lot')
trait('Auth/Client')
trait('DatabaseTransactions')
trait('Test/ApiClient')

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
    .end()
  response.assertStatus(400)
  response.assertError(validateErrorMaker.generateError('above', 'proposed_price', lot.current_price))
})

test('should return error, when user try add bid to own lot', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()
  const lot = await Factory.model('App/Models/Lot').create({ user_id: user.id })
  const data = { proposed_price: 1000 }
  await Lot.query().update({ status: 'inProcess' })
  const response = await client
    .post(Route.url('bids.store', { lot_id: lot.id }))
    .send(data)
    .loginVia(user)
    .end()
  response.assertStatus(400)
  response.assertError({ message: Antl.formatMessage('message.YouCanNotAddBidForYourOwnLot') })
})

test('should return error, proposed price less than current price', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()
  const lot = await Factory.model('App/Models/Lot').create({ user_id: user.id })
  const data = { proposed_price: lot.estimated_price + 100 }
  const otherUser = await Factory.model('App/Models/User').create()
  await Lot.query().update({ status: 'inProcess' })
  const response = await client
    .post(Route.url('bids.store', { lot_id: lot.id }))
    .send(data)
    .loginVia(otherUser)
    .end()
  response.assertStatus(200)
  response.assertJSONSubset({
    proposed_price: data.proposed_price,
    user_id: otherUser.id
  })
})
