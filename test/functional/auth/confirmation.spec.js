'use strict'

const { test, trait } = use('Test/Suite')('Auth - confirmation')
const Route = use('Route')
const Factory = use('Factory')
trait('DatabaseTransactions')
trait('Test/ApiClient')
const AuthService = use('AuthService')
const nock = require('nock')
nock(AuthService.FRONT_APP_URL)
  .get('/')
  .reply(200, 'domain matched')

test('should return error', async ({ client }) => {
  const response = await client
    .get(Route.url('confirmation'))
    .end()
  response.assertStatus(400)
})

test('should redirect after confirmation', async ({ client }) => {
  const token = '11111111111111111111111111'
  await Factory.model('App/Models/User').create({ confirmation_token: token })
  const response = await client
    .get(Route.url('confirmation'))
    .send({ confirmation_token: token })
    .end()
  response.assertStatus(200)
  response.assertRedirect('/')
})
