'use strict'

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
const Route = use('Route')

Route.group(() => {
  Route.post('register', 'AuthController.register').validator('UserRegistration').as('registration')
  Route.get('confirmation', 'AuthController.confirmation').validator('UserConfirmation').as('confirmation')
  Route.post('login', 'AuthController.login').validator('UserLogin').as('login')
  Route.post('reset_password', 'AuthController.resetPassword').validator('UserResetPassword').as('resetPassword')
  Route.put('set_password', 'AuthController.setNewPassword').validator('UserSetNewPassword').as('setNewPassword')
  Route.post('refresh_token', 'AuthController.refresh').as('refreshToken')
  Route.delete('logout', 'AuthController.logout').middleware('auth').as('logout')
}).prefix('/api/auth')

Route.group(() => {
  Route.get('lots/my', 'LotController.my').middleware(['auth']).as('myLots')
  Route.resource('lots', 'LotController').apiOnly().validator(new Map([
    [['lots.store'], ['LotStoreValidation']],
    [['lots.update'], ['LotUpdateValidation']]
  ])).middleware(['auth'])
  Route.post('/lots/:lot_id/bids', 'BidController.store').middleware(['auth', 'setLotToRequest', 'checkBidCreator']).validator('BidStoreValidation').as('bids.store')
}).prefix('/api')
