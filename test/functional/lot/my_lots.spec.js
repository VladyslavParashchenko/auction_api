'use strict'

const { test, trait } = use('Test/Suite')('Lot - my lot list')
const Route = use('Route')
const Factory = use('Factory')
trait('Auth/Client')
trait('DatabaseTransactions')
trait('Test/ApiClient')

test('should return user lots', async ({ client, assert }) => {
  const user = await Factory.model('App/Models/User').create()
  await Factory.model('App/Models/Lot').createMany(5, { user_id: user.id })
  const response = await client
    .get(Route.url('myLots'))
    .loginVia(user)
    .end()
  const lotList = JSON.parse(response.text)
  response.assertStatus(200)
  assert.equal(lotList.data.length, 5)
})

test('should return user lots with pagination params', async ({ client, assert }) => {
  const user = await Factory.model('App/Models/User').create()
  await Factory.model('App/Models/Lot').createMany(5, { user_id: user.id })
  const response = await client
    .get(Route.url('myLots'))
    .query({ page: 1, per_page: 5 })
    .loginVia(user)
    .end()
  const lotList = JSON.parse(response.text)
  response.assertStatus(200)
  assert.equal(lotList.data.length, 5)
  assert.equal(lotList.page, 1)
  assert.equal(lotList.perPage, 5)
})
