'use strict';

const { test, trait } = use('Test/Suite')('Auth-login');
const Route = use('Route');
const User = use('App/Models/User');
const validateErrorGeneretor = require('../../helper/generateValidatorError.js');
trait('DatabaseTransactions');
trait('Test/ApiClient');

test('should return error email validate error', async ({ client, assert }) => {
  const response = await client
    .post(Route.url('login'))
    .send({ email: 'not valid email', password: 'password' })
    .end();

  response.assertStatus(400);
  response.assertError(validateErrorGeneretor.generateError('email', 'email'));
});

test('should return error password validate error', async ({ client, assert }) => {
  const response = await client
    .post(Route.url('login'))
    .send({ email: 'email@example.com' })
    .end();

  response.assertStatus(400);
  response.assertError(validateErrorGeneretor.generateError('required', 'password'));
});

test('should return error, because user not confirmed', async ({ client, assert }) => {
  const data = {
    email: 'test@email.com',
    first_name: 'Name',
    last_name: 'LastName',
    phone: '+999999999999',
    confirmation_token: '111111111111',
    password: 'password',
    birth_day: new Date(1912, 7, 25)
  };
  const user = await User.create(data);
  await user.save();
  const response = await client
    .post(Route.url('login'))
    .send({ email: user.email, password: 'password' })
    .end();
  console.log(response.text);

  response.assertStatus(403);
  response.assertError({ message: 'User not found' });
});

test('should login user', async ({ client, assert }) => {
  const data = {
    email: 'test@email.com',
    first_name: 'Name',
    last_name: 'LastName',
    phone: '+999999999999',
    password: 'password',
    birth_day: new Date(1912, 7, 25)
  };
  const user = await User.create(data);
  await user.save();
  const response = await client
    .post(Route.url('login'))
    .send({ email: user.email, password: 'password' })
    .end();

  response.assertStatus(200);
  assert.isNotNull(response.headers['Authorization']);
  response.assertJSONSubset({
    email: data.email,
    first_name: data.first_name,
    last_name: data.last_name,
    phone: data.phone
  });
});
