'use strict';

const Event = use('Event');
const { test, trait } = use('Test/Suite')('Auth-logout');
const Route = use('Route');
const Factory = use('Factory');
const Antl = use('Antl');
const validateErrorGeneretor = require('../../helper/generateValidatorError.js');

trait('Auth/Client');
trait('DatabaseTransactions');
trait('Test/ApiClient');

test('should reset password for user', async ({ client, assert }) => {
  Event.fake();
  const user = await Factory.model('App/Models/User').create();
  const response = await client
    .post(Route.url('resetPassword'))
    .send({ email: user.email, restore_password_url: '/' })
    .end();

  response.assertStatus(200);
  response.assertJSON(
    { message: Antl.formatMessage('message.ResetLetterWasSent') }
  );
  const recentEvent = Event.pullRecent();
  assert.equal(recentEvent.event, 'user::restore_password');
  Event.restore();
});

test('should return validate error, email is not present', async ({ client, assert }) => {
  await Factory.model('App/Models/User').create();
  const response = await client
    .post(Route.url('resetPassword'))
    .send({ restore_password_url: '/' })
    .end();

  response.assertStatus(400);
  response.assertError(validateErrorGeneretor.generateError('required', 'email'));
});

test('should return validate error, restore_password_url field is not present', async ({ client, assert }) => {
  await Factory.model('App/Models/User').create();
  const response = await client
    .post(Route.url('resetPassword'))
    .send({ email: 'email@example.com' })
    .end();

  response.assertStatus(400);
  response.assertError(validateErrorGeneretor.generateError('required', 'restore_password_url'));
});
