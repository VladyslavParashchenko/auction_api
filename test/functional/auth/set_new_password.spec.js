'use strict'

const { test, trait } = use('Test/Suite')('Auth - set new password')
const Route = use('Route')
const Factory = use('Factory')
const validateErrorMaker = require('../../helper/generateValidatorError.js')

trait('Auth/Client')
trait('DatabaseTransactions')
trait('Test/ApiClient')

test('should change user password', async ({ client, assert }) => {
  const token = '1111111111111111'
  await Factory.model('App/Models/User').create({ restore_password_token: token })
  const newPassword = 'new_password'
  const response = await client
    .put(Route.url('setNewPassword'))
    .send(
      {
        restore_password_token: token,
        password: newPassword,
        password_confirmation: newPassword
      })
    .end()
  response.assertStatus(200)
  assert.isNotNull(response.headers['authorization'])
})

test('should return error, because restore_password_token is not provided', async ({ client, assert }) => {
  const newPassword = 'new_password'
  const response = await client
    .put(Route.url('setNewPassword'))
    .send(
      {
        password: newPassword,
        password_confirmation: newPassword
      })
    .accept('json')
    .end()
  response.assertStatus(400)
  response.assertJSONSubset(validateErrorMaker.generateError('required', 'restore_password_token'))
})
