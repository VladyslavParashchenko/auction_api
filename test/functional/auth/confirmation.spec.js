'use strict';

const { test, trait } = use('Test/Suite')('Auth-confirmation');
const Route = use('Route');
const User = use('App/Models/User');
const Env = use('Env');
trait('DatabaseTransactions');
trait('Test/ApiClient');

test('should return error', async ({ client }) => {
  const response = await client
    .get(Route.url('confirmation'))
    .end();
  response.assertStatus(403);
  response.assertError({ message: 'User not found' });
});

test('should redirect after confirmation', async ({ client }) => {
  const token = '11111111111111111111111111';
  await User.create({
    email: 'test@email.com',
    first_name: 'Name',
    last_name: 'LastName',
    phone: '+999999999999',
    password: 'password',
    confirmation_token: token,
    birth_day: new Date(1912, 7, 25)
  });
  const response = await client
    .get(Route.url('confirmation'))
    .query({ confirmation_token: token })
    .end();
  response.assertStatus(200);
  response.assertRedirect(Env.get('CONFIRM_SUCCESS_URL'));
});
