'use strict';

const Mail = use('Mail');
const { test, trait } = use('Test/Suite')('User registration');
const Route = use('Route');
trait('DatabaseTransactions');
trait('Test/ApiClient');

test('should return validate error', async ({ client }) => {
  const response = await client
    .post(Route.url('registration'))
    .end();
  response.assertText('Validation failed. Make sure you have filled all fields correctly');
});

test('should create new user and return user data in response', async ({ client, assert }) => {
  const data = {
    email: 'test@email.com',
    first_name: 'Name',
    last_name: 'LastName',
    phone: '+999999999999',
    password: 'password',
    password_confirmation: 'password',
    birth_day: new Date(1912, 7, 25)
  };
  const response = await client
    .post(Route.url('registration'))
    .query(data)
    .end();
  response.assertStatus(200)
  response.assertJSONSubset({
    email: data.email,
    first_name: data.first_name,
    last_name: data.last_name,
    phone: data.phone
  });
});
