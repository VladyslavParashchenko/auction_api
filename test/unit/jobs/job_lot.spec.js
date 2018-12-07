'use strict'

const { test, trait, before, afterEach, after } = use('Test/Suite')('Lot - jobs test')
const { queue, Factory, Database, Mail } = require('../../helper/dependencyHelper.js')
const LotEventsHandlerClass = use('App/Listeners/LotListener')
const LotEventsHandler = new LotEventsHandlerClass()
trait('Auth/Client')
trait('Test/ApiClient')
let user, otherUser, lot, bid

before(async () => {
  queue.testMode.enter()
  Mail.fake()
  user = await Factory.model('App/Models/User').create()
  otherUser = await Factory.model('App/Models/User').create()
  lot = await Factory.model('App/Models/Lot').create({ user_id: user.id })
  bid = await Factory.model('App/Models/Bid').create({ lot: lot, user: otherUser })
})

afterEach(async () => {
  queue.testMode.clear()
})

test('job should change lot status and start lot', async ({ client, assert }) => {
  await LotEventsHandler.started({ jobId: lot.lot_start_job_id, lotId: lot.id })
  await lot.reload()
  assert.equal(lot.status, 'inProcess')
})

test('job should change lot status and close lot', async ({ client, assert }) => {
  await LotEventsHandler.foundWinner({ jobId: lot.lot_end_job_id, lotId: lot.id })
  await lot.reload()
  const recentEmails = Mail.all()
  assert.equal(lot.status, 'closed')
  assert.equal(lot.winner_bid_id, bid.id)
  assert.equal(recentEmails[0].message.to[0].address, user.email)
  assert.equal(recentEmails[1].message.to[0].address, otherUser.email)
})

after(async () => {
  await Database.table('users').delete()
  Mail.restore()
})
