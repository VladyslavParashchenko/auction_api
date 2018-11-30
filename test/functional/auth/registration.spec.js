'use strict'
const { test, trait, beforeEach, after, before } = use('Test/Suite')('Auth - registration')
const validateErrorMaker = require('../../helper/generateValidatorError.js')
const Route = use('Route')
const Factory = use('Factory')
const Event = use('Event')
let data
trait('DatabaseTransactions')
trait('Test/ApiClient')

beforeEach(async () => {
  data = {
    email: 'test@email.com',
    first_name: 'Name',
    last_name: 'LastName',
    phone: '+999999999999',
    password: 'password',
    password_confirmation: 'password',
    birth_day: new Date(1990, 1, 1)
  }
})
before(async () => {
  Event.fake()
})
test('should return error', async ({ client }) => {
  const response = await client
    .post(Route.url('registration'))
    .end()
  response.assertStatus(400)
})

test('should return validate unique email error', async ({ client }) => {
  await Factory.model('App/Models/User').create({ email: data['email'] })
  const response = await client
    .post(Route.url('registration'))
    .send(data)
    .accept('json')
    .end()
  response.assertStatus(400)
  response.assertJSONSubset(validateErrorMaker.generateError('unique', 'email'))
})

test('should return validate birth_day error', async ({ client }) => {
  data['birth_day'] = new Date()
  const response = await client
    .post(Route.url('registration'))
    .send(data)
    .accept('json')
    .end()
  response.assertStatus(400)
  response.assertJSONSubset(validateErrorMaker.generateError('before_offset_of', 'birth_day'))
})

test('should create new user and return user data in response', async ({ client }) => {
  const response = await client
    .post(Route.url('registration'))
    .accept('json')
    .send(data)
    .end()
  response.assertStatus(200)
  response.assertJSONSubset({
    email: data.email,
    first_name: data.first_name,
    last_name: data.last_name,
    phone: data.phone
  })
})

test('should run event for send email', async ({ client, assert }) => {
  const response = await client
    .post(Route.url('registration'))
    .accept('json')
    .send(data)
    .end()
  response.assertStatus(200)
  response.assertJSONSubset({
    email: data.email,
    first_name: data.first_name,
    last_name: data.last_name,
    phone: data.phone
  })
  const recentEvent = Event.pullRecent()
  assert.equal(recentEvent.event, 'user::new')
})

after(async () => {
  Event.restore()
})
