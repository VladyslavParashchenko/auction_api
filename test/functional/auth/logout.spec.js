'use strict';

const { test, trait } = use('Test/Suite')('Auth - refresh token');
const Route = use('Route');
const Factory = use('Factory');
trait('Auth/Client');
trait('DatabaseTransactions');
trait('Test/ApiClient');

test('should return auth error', async ({ client }) => {
  await Factory.model('App/Models/User').create();
  const response = await client
    .delete(Route.url('logout'))
    .end();
  response.assertStatus(401);
  response.assertError({
    'message': 'E_INVALID_JWT_TOKEN: jwt must be provided',
    'name': 'InvalidJwtToken',
    'code': 'E_INVALID_JWT_TOKEN',
    'status': 401
  }
  );
});

test('should return success response and revoke all refresh token', async ({ client, assert }) => {
  const user = await Factory.model('App/Models/User').create();
  const refreshToken = await Factory.model('App/Models/Token').make();
  await user.tokens().save(refreshToken);
  const response = await client
    .delete(Route.url('logout'))
    .loginVia(user, 'jwt')
    .end();
  await refreshToken.reload();
  response.assertStatus(200);
  assert.isTrue(refreshToken.is_revoked);
});
