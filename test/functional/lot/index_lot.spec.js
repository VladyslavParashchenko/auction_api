'use strict'

const { test, trait } = use('Test/Suite')('Lot - index')
const Route = use('Route')
const Factory = use('Factory')
const Lot = use('App/Models/Lot')
trait('Auth/Client')
trait('DatabaseTransactions')
trait('Test/ApiClient')

test('should return lots list', async ({ client, assert }) => {
  const user = await Factory.model('App/Models/User').create()
  await Factory.model('App/Models/Lot').createMany(5)
  await Lot.query().update({ status: 'inProcess' })
  const response = await client
    .get(Route.url('lots.index'))
    .query({ page: 1, perPage: 5 })
    .loginVia(user)
    .end()
  const lotList = JSON.parse(response.text)
  response.assertStatus(200)
  assert.equal(lotList.page, 1)
  assert.equal(lotList.perPage, 5)
  assert.equal(lotList.data.length, 5)
  for (let lot of lotList.data) {
    assert.equal(lot.status, 'inProcess')
  }
})

test('should return error, because user doesn\'t login', async ({ client }) => {
  const response = await client
    .get(Route.url('lots.index'))
    .query({ page: 1, per_page: 5 })
    .accept('json')
    .end()
  response.assertStatus(401)
  response.assertError({
    'message': 'E_INVALID_JWT_TOKEN: jwt must be provided',
    'name': 'InvalidJwtToken',
    'code': 'E_INVALID_JWT_TOKEN',
    'status': 401
  }
  )
})

test('should return user lots', async ({ client, assert }) => {
  const user = await Factory.model('App/Models/User').create()
  await Factory.model('App/Models/Lot').createMany(5, { user_id: user.id })
  const response = await client
    .get(Route.url('lots.index'))
    .query({ ownLot: true })
    .loginVia(user)
    .end()
  response.assertStatus(200)
  const lotList = JSON.parse(response.text)
  assert.equal(lotList.data.length, 5)
})

test('should return user lots with pagination params', async ({ client, assert }) => {
  const user = await Factory.model('App/Models/User').create()
  await Factory.model('App/Models/Lot').createMany(5, { user_id: user.id })
  const response = await client
    .get(Route.url('lots.index'))
    .query({ page: 1, perPage: 5, ownLot: true })
    .loginVia(user)
    .end()
  const lotList = JSON.parse(response.text)
  response.assertStatus(200)
  assert.equal(lotList.data.length, 5)
  assert.equal(lotList.page, 1)
  assert.equal(lotList.perPage, 5)
})

test('should return user lots and lot, which have bids belongs to user, with pagination params', async ({ client, assert }) => {
  const user = await Factory.model('App/Models/User').create()
  const otherUser = await Factory.model('App/Models/User').create()
  const userLot = await Factory.model('App/Models/Lot').create({ user_id: user.id })
  const otherUserLot = await Factory.model('App/Models/Lot').create({ user_id: otherUser.id })
  await Factory.model('App/Models/Bid').create({ lot: otherUserLot, user: user })
  const response = await client
    .get(Route.url('lots.index'))
    .query({ page: 1, perPage: 5, ownLot: true })
    .loginVia(user)
    .end()
  const lotList = JSON.parse(response.text)
  response.assertStatus(200)
  assert.equal(lotList.data.length, 2)
  response.assertJSONSubset({
    'data': [{
      id: userLot.id
    },
    {
      id: otherUserLot.id
    }]
  })
})
