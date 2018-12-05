'use strict'

const { test, trait, before, after } = use('Test/Suite')('Lot - delete')
const { Route, Factory, Antl, Database } = require('../../helper/dependencyHelper.js')
const dayjs = require('dayjs')
const queue = require('kue').createQueue()
trait('Auth/Client')
trait('Test/ApiClient')

before(function () {
  queue.testMode.enter()
})

const data = {
  title: 'lot_title',
  current_price: 1000,
  estimated_price: 2000,
  start_time: dayjs().add(7, 'day'),
  end_time: dayjs().add(10, 'day')
}

test('should delete lot', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()
  const lot = await user.lots().create(data)
  const response = await client
    .delete(Route.url('lots.destroy', { id: lot.id }))
    .loginVia(user)
    .end()
  response.assertStatus(200)
  response.assertJSONSubset({ id: lot.id })
})

test('should return error, when update other user lot', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()
  const otherUser = await Factory.model('App/Models/User').create()
  const lot = await user.lots().create(data)
  const response = await client
    .delete(Route.url('lots.destroy', { id: lot.id }))
    .loginVia(otherUser)
    .end()
  response.assertStatus(404)
  response.assertError({ message: Antl.formatMessage('message.ModelNotFoundException') })
})

after(async () => {
  await Database.table('users').delete()
  queue.testMode.clear()
  queue.testMode.exit()
})
