'use strict'

const { test, trait, after, before } = use('Test/Suite')('Order - store')
const { Route, Antl, Factory, Lot, Database, Mail } = require('../../helper/dependencyHelper.js')
const LotListener = new (use('App/Listeners/LotListener'))()
trait('Auth/Client')
const validateErrorMaker = require('../../helper/generateValidatorError.js')
trait('Test/ApiClient')
let user, lot, otherUser
before(async () => {
  Mail.fake()
  user = await Factory.model('App/Models/User').create()
  lot = await Factory.model('App/Models/Lot').create({ user_id: user.id })
  otherUser = await Factory.model('App/Models/User').create()
  await Lot.query().update({ status: 'inProcess' })
  await Factory.model('App/Models/Bid').createMany(2, { user: otherUser, lot: lot })
  await LotListener.foundWinner({ lotId: lot.id, jobId: lot.lot_end_job_id })
  await lot.reload()
})

test('should create new order', async ({ client }) => {
  const data = {
    arrivalLocation: 'address',
    arrivalType: 'pickup'
  }
  const response = await client
    .post(Route.url('order.store', { lot_id: lot.id }))
    .send(data)
    .loginVia(otherUser)
    .accept('json')
    .end()
  response.assertStatus(200)
  response.assertJSONSubset({
    arrivalLocation: data.arrivalLocation,
    arrivalType: data.arrivalType,
    user_id: otherUser.id,
    status: 'pending',
    lot_id: lot.id
  })
})

test('should return error, because arrivalType not correct', async ({ client }) => {
  const data = {
    arrivalLocation: 'address',
    arrivalType: 'not valid arrival type'
  }
  const response = await client
    .post(Route.url('order.store', { lot_id: lot.id }))
    .send(data)
    .loginVia(otherUser)
    .accept('json')
    .end()
  response.assertStatus(400)
  response.assertJSONSubset(validateErrorMaker.generateError('in', 'arrivalType'))
})

test('should return error, when user try create order for lot, which is not belongs to user ', async ({ client }) => {
  const data = {
    arrivalLocation: 'address',
    arrivalType: 'not valid arrival type'
  }
  user = await Factory.model('App/Models/User').create()
  const response = await client
    .post(Route.url('order.store', { lot_id: lot.id }))
    .send(data)
    .loginVia(user)
    .accept('json')
    .end()
  response.assertStatus(403)
  response.assertJSONSubset({ message: Antl.formatMessage('message.YouNotBoughtThisLot') })
})

after(async () => {
  Mail.restore()
  await Database.table('users').delete()
})
