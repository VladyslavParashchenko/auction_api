'use strict'

const { test, trait } = use('Test/Suite')('Auth - refresh token')
const Route = use('Route')
const Factory = use('Factory')
const Antl = use('Antl')
trait('Auth/Client')
trait('DatabaseTransactions')
trait('Test/ApiClient')

test('should return error, because we have not refresh token', async ({ client }) => {
  await Factory.model('App/Models/User').create()
  const response = await client
    .post(Route.url('refreshToken'))
    .end()
  response.assertStatus(401)
  response.assertJSON({ message: Antl.formatMessage('message.InvalidRefreshToken') })
})

test('should return error, because refresh token is not valid', async ({ client }) => {
  const user = await Factory.model('App/Models/User').create()
  const refreshToken = await Factory.model('App/Models/Token').make()
  await user.tokens().save(refreshToken)
  const response = await client
    .post(Route.url('refreshToken'))
    .send({ 'refresh_token': refreshToken.token })
    .end()
  response.assertStatus(401)
  response.assertError({ message: Antl.formatMessage('message.InvalidRefreshToken') })
})

test('should return success response with new access token', async ({ client, assert, auth }) => {
  const user = await Factory.model('App/Models/User').create()
  const loginResponse = await client
    .post(Route.url('login'))
    .send({ email: user.email, password: 'password' })
    .end()
  await user.reload()
  const refreshToken = loginResponse.headers.refreshtoken
  const response = await client
    .post(Route.url('refreshToken'))
    .send({ 'refresh_token': refreshToken })
    .end()
  response.assertJSONSubset({ 'message': 'Token was refresh' })
  response.assertStatus(200)
  assert.isNotNull(response.headers['authorization'])
})
