'use strict';

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route');

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' };
});

Route.group(() => {
  Route.post('register', 'AuthController.register').validator('UserRegistration').as('registration');
  Route.get('confirmation', 'AuthController.confirmation').as('confirmation');
  Route.post('login', 'AuthController.login').validator('UserLogin').as('login');
}).prefix('/api/auth');
