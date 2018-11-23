'use strict'

const { test, trait } = use('Test/Suite')('Lot - show')
const Route = use('Route')
const Factory = use('Factory')
const Lot = use('App/Models/Lot')
trait('Auth/Client')
trait('DatabaseTransactions')
trait('Test/ApiClient')

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

test('should return error, because lot belongs to other user and is not in progress', async ({ client, assert }) => {
  const user = await Factory.model('App/Models/User').create()
  const otherUser = await Factory.model('App/Models/User').create()
  const lot = await Factory.model('App/Models/Lot').create({ user_id: user.id })
  const response = await client
    .get(Route.url('lots.show', { id: lot.id }))
    .loginVia(otherUser)
    .end()
  response.assertStatus(403)
  response.assertJSONSubset({ 'message': 'Lot not found' })
})
