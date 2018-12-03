'use strict'

const { test, trait, before, after } = use('Test/Suite')('Lot - update')
const Route = use('Route')
const Factory = use('Factory')
const Antl = use('Antl')
const Database = use('Database')
const queue = require('kue').createQueue()
const dayjs = require('dayjs')
trait('Auth/Client')
trait('Test/ApiClient')
before(function () {
  queue.testMode.enter()
})
const oldData = {
  title: 'lot_title',
  current_price: 1000,
  estimated_price: 2000,
  start_time: dayjs().add(7, 'day'),
  end_time: dayjs().add(10, 'day')
}

const data = {
  title: 'new_title',
  current_price: 2000,
  estimated_price: 3000,
  description: 'text'
}

test('should update lot', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()
  const lot = await user.lots().create(oldData)
  const response = await client
    .put(Route.url('lots.update', { id: lot.id }))
    .send(data)
    .loginVia(user)
    .end()
  response.assertStatus(200)
  response.assertJSONSubset({
    id: lot.id,
    title: data.title,
    current_price: data.current_price,
    estimated_price: data.estimated_price,
    description: data.description
  }
  )
})

test('should return error, when update lot, which belongs to other user', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()
  const otherUser = await Factory.model('App/Models/User').create()
  const lot = await user.lots().create(oldData)
  const response = await client
    .put(Route.url('lots.update', { id: lot.id }))
    .send(data)
    .loginVia(otherUser)
    .end()
  response.assertStatus(404)
  response.assertError({ message: Antl.formatMessage('message.ModelNotFoundException') })
})

test('should return error, when update lot, which have status inProcess', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()
  const lot = await user.lots().create(oldData)
  lot.status = 'inProcess'
  await lot.save()
  const response = await client
    .put(Route.url('lots.update', { id: lot.id }))
    .send(data)
    .loginVia(user)
    .end()
  response.assertStatus(404)
  response.assertError({ message: Antl.formatMessage('message.ModelNotFoundException') })
})

after(async () => {
  await Database.table('users').delete()
  queue.testMode.clear()
  queue.testMode.exit()
})
