'use strict'

const { test, trait, before, beforeEach, after } = use('Test/Suite')('Order - update')
const { Route, Antl, Factory, Lot, Database, Mail } = require('../../helper/dependencyHelper.js')
const LotListener = new (use('App/Listeners/LotListener'))()
trait('Auth/Client')
trait('Test/ApiClient')
let user, lot, otherUser, order

before(async () => {
  Mail.fake()
})
beforeEach(async () => {
  user = await Factory.model('App/Models/User').create()
  lot = await Factory.model('App/Models/Lot').create({ user_id: user.id })
  otherUser = await Factory.model('App/Models/User').create()
  await Lot.query().update({ status: 'inProcess' })
  await Factory.model('App/Models/Bid').createMany(2, { user: otherUser, lot: lot })
  await LotListener.foundWinner({ lotId: lot.id, jobId: lot.lot_end_job_id })
  order = await Factory.model('App/Models/Order').create({ lot_id: lot.id, user_id: otherUser.id })
})

test('should create new order', async ({ client }) => {
  const data = {
    status: 'sent'
  }
  const response = await client
    .put(Route.url('order.update', { lot_id: lot.id }))
    .send(data)
    .loginVia(user)
    .accept('json')
    .end()
  response.assertStatus(200)
  response.assertJSONSubset({
    status: 'sent'
  })
  await order.reload()
})

test('should return permission error, because lot buyer can\'t set sent status', async ({ client }) => {
  const data = {
    status: 'sent'
  }
  const response = await client
    .put(Route.url('order.update', { lot_id: lot.id }))
    .send(data)
    .loginVia(otherUser)
    .accept('json')
    .end()
  response.assertStatus(403)
  response.assertJSONSubset({
    message: Antl.formatMessage('message.PermissionDenied')
  })
})

test('should change order status', async ({ client }) => {
  order.status = 'sent'
  order.save()
  const data = {
    status: 'delivered'
  }
  const response = await client
    .put(Route.url('order.update', { lot_id: lot.id }))
    .send(data)
    .loginVia(otherUser)
    .accept('json')
    .end()
  response.assertStatus(200)
  response.assertJSONSubset({
    status: 'delivered'
  })
})

test('should return error, because lot owner can\'t confirm delivering', async ({ client }) => {
  order.status = 'sent'
  order.save()
  const data = {
    status: 'delivered'
  }
  const response = await client
    .put(Route.url('order.update', { lot_id: lot.id }))
    .send(data)
    .loginVia(user)
    .accept('json')
    .end()
  response.assertStatus(403)
  response.assertJSONSubset({
    message: Antl.formatMessage('message.PermissionDenied')
  })
})

after(async () => {
  Mail.restore()
  await Database.table('users').delete()
})
