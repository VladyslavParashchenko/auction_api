'use strict'

const { test, trait } = use('Test/Suite')('Auth - login')
const Route = use('Route')
const Factory = use('Factory')
const Antl = use('Antl')
const validateErrorMaker = require('../../helper/generateValidatorError.js')
trait('DatabaseTransactions')
trait('Test/ApiClient')

test('should return error email validate error', async ({ client }) => {
  const response = await client
    .post(Route.url('login'))
    .send({ email: 'not valid email', password: 'password' })
    .accept('json')
    .end()
  response.assertStatus(400)
  response.assertJSONSubset(validateErrorMaker.generateError('email', 'email'))
})

test('should return error password validate error', async ({ client }) => {
  const response = await client
    .post(Route.url('login'))
    .send({ email: 'email@example.com' })
    .accept('json')
    .end()

  response.assertStatus(400)
  response.assertJSONSubset(validateErrorMaker.generateError('required', 'password'))
})

test('should return error, because user not confirmed', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create({ confirmation_token: '1111111111111111111' })
  const response = await client
    .post(Route.url('login'))
    .send({ email: user.email, password: 'password' })
    .accept('json')
    .end()
  response.assertStatus(404)
  response.assertError({ message: Antl.formatMessage('message.ModelNotFoundException') })
})

test('should login user', async ({ client, assert }) => {
  const user = await Factory.model('App/Models/User').create()
  const response = await client
    .post(Route.url('login'))
    .send({ email: user.email, password: 'password' })
    .type('json')
    .accept('json')
    .end()
  response.assertStatus(200)
  assert.isNotNull(response.headers['authorization'])
  response.assertJSONSubset({
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    phone: user.phone
  })
})
