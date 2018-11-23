'use strict'
const { test, trait } = use('Test/Suite')('Auth - registration')
const validateErrorMaker = require('../../helper/generateValidatorError.js')
const Route = use('Route')
const User = use('App/Models/User')
const Event = use('Event')
trait('DatabaseTransactions')
trait('Test/ApiClient')

test('should return error', async ({ client }) => {
  const response = await client
    .post(Route.url('registration'))
    .end()
  response.assertStatus(400)
})

test('should return validate unique email error', async ({ client }) => {
  const data = {
    email: 'test@email.com',
    first_name: 'Name',
    last_name: 'LastName',
    phone: '+999999999999',
    password: 'password',
    birth_day: new Date(1990, 1, 1)
  }
  await User.create(data)
  data['password_confirmation'] = 'password'
  const response = await client
    .post(Route.url('registration'))
    .send(data)
    .end()
  response.assertStatus(400)
  response.assertError(validateErrorMaker.generateError('unique', 'email'))
})

test('should return validate birth_day error', async ({ client }) => {
  const data = {
    email: 'test@email.com',
    first_name: 'Name',
    last_name: 'LastName',
    phone: '+999999999999',
    password: 'password',
    password_confirmation: 'password',
    birth_day: new Date()
  }
  const response = await client
    .post(Route.url('registration'))
    .accept('json')
    .send(data)
    .end()
  response.assertStatus(400)
  response.assertError(validateErrorMaker.generateError('before_offset_of', 'birth_day', '21 years'))
})

test('should create new user and return user data in response', async ({ client }) => {
  const data = {
    email: 'test@email.com',
    first_name: 'Name',
    last_name: 'LastName',
    phone: '+999999999999',
    password: 'password',
    password_confirmation: 'password',
    birth_day: new Date(1990, 1, 1)
  }
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
  Event.fake()
  const data = {
    email: 'test@email.com',
    first_name: 'Name',
    last_name: 'LastName',
    phone: '+999999999999',
    password: 'password',
    password_confirmation: 'password',
    birth_day: new Date(1990, 1, 1)
  }
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
  Event.restore()
})
