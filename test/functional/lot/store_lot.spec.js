'use strict'

const { test, trait, beforeEach } = use('Test/Suite')('Lot - store')
const Route = use('Route')
const Factory = use('Factory')
const dayjs = require('dayjs')
const validateErrorMaker = require('../../helper/generateValidatorError.js')
const Helpers = use('Helpers')
trait('Auth/Client')
trait('DatabaseTransactions')
trait('Test/ApiClient')
let data

beforeEach(async () => {
  data = {
    title: 'lot_title',
    current_price: '1000',
    estimated_price: '2000',
    start_time: dayjs().add(7, 'day').toISOString(),
    end_time: dayjs().add(10, 'day').toISOString()
  }
})

test('should create new Lot', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()
  const response = await client
    .post(Route.url('lots.store'))
    .send(data)
    .loginVia(user)
    .accept('json')
    .end()
  response.assertStatus(200)
  response.assertJSONSubset({
    title: data.title,
    current_price: data.current_price,
    estimated_price: data.estimated_price,
    status: 'pending',
    user_id: user.id
  }
  )
})

test('should create new Lot with image', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()
  const response = await client
    .post(Route.url('lots.store'))
    .field(data)
    .attach('image', Helpers.appRoot('test/files/image.jpg'))
    .loginVia(user)
    .accept('json')
    .end()
  response.assertStatus(200)
  response.assertJSONSubset({
    title: data.title,
    current_price: data.current_price,
    estimated_price: data.estimated_price,
    status: 'pending',
    user_id: user.id
  }
  )
})

test('should return error, because image has not valid type', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()
  const response = await client
    .post(Route.url('lots.store'))
    .field(data)
    .attach('image', Helpers.appRoot('test/files/doc.txt'))
    .loginVia(user)
    .accept('json')
    .end()
  response.assertStatus(400)
  response.assertJSONSubset(validateErrorMaker.generateError('fileExt', 'image'))
})

test('should return error, because current_price have negative value', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()
  data.current_price = -1000
  const response = await client
    .post(Route.url('lots.store'))
    .field(data)
    .loginVia(user)
    .accept('json')
    .end()
  response.assertStatus(400)
  response.assertJSONSubset(validateErrorMaker.generateError('above', 'current_price'))
})

test('should return error, because estimated_price less than current_price', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()
  data.current_price = 1000
  data.estimated_price = 500
  const response = await client
    .post(Route.url('lots.store'))
    .field(data)
    .accept('json')
    .loginVia(user)
    .end()
  response.assertStatus(400)
  response.assertJSONSubset(validateErrorMaker.generateError('above', 'estimated_price'))
})

test('should return error, because start_time less then current date', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()
  data.start_time = dayjs().subtract(7, 'day').toISOString()
  const response = await client
    .post(Route.url('lots.store'))
    .field(data)
    .loginVia(user)
    .accept('json')
    .end()
  response.assertStatus(400)
  response.assertJSONSubset(validateErrorMaker.generateError('after', 'start_time'))
})

test('should return error, because end_time less then start_time', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()
  data.end_time = dayjs().subtract(7, 'day').toISOString()
  const response = await client
    .post(Route.url('lots.store'))
    .field(data)
    .loginVia(user)
    .accept('json')
    .end()
  response.assertStatus(400)
  response.assertJSONSubset(validateErrorMaker.generateError('after', 'end_time'))
})
