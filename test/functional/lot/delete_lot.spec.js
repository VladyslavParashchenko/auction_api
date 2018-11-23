'use strict'

const { test, trait } = use('Test/Suite')('Lot - delete')
const Route = use('Route')
const Factory = use('Factory')
const dayjs = require('dayjs')
trait('Auth/Client')
trait('DatabaseTransactions')
trait('Test/ApiClient')

const data = {
  title: 'lot_title',
  current_price: 1000,
  estimated_price: 2000,
  start_time: dayjs().add(7, 'day'),
  end_time: dayjs().add(10, 'day')
}

test('should update lot', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()
  const lot = await user.lots().create(data)
  const response = await client
    .delete(Route.url('lots.destroy', { id: lot.id }))
    .loginVia(user)
    .end()
  response.assertStatus(200)
  response.assertJSONSubset({ id: lot.id
  }
  )
})

test('should return error, when update other user lot', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()
  const otherUser = await Factory.model('App/Models/User').create()
  const lot = await user.lots().create(data)
  const response = await client
    .delete(Route.url('lots.destroy', { id: lot.id }))
    .loginVia(otherUser)
    .end()
  response.assertStatus(403)
  response.assertError({ message: 'Lot not found' })
})
