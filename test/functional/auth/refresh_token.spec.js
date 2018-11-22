'use strict';

const { test, trait } = use('Test/Suite')('Auth - refresh token');
const Route = use('Route');
const Factory = use('Factory');
const Antl = use('Antl');
const validateErrorGeneretor = require('../../helper/generateValidatorError.js');

trait('Auth/Client');
trait('DatabaseTransactions');
trait('Test/ApiClient');

test('should change user password', async ({ client, assert }) => {
  const user = await Factory.model('App/Models/User').create();
  await auth.generate(user)
  const response = await client
    .post(Route.url('refreshToken'))
    .loginVia(user)
    .end();
  console.log(response.text);
  response.assertStatus(200);
  response.assertJSON({ message: Antl.formatMessage('message.TokenRefresh') });
  assert.isNotNull(response.headers['authorization']);
});
