const Event = use('Event')

/*
  Auth events
 */
Event.on('user::new', 'User.new')
Event.on('user::restore_password', 'User.restore_password')

/*
  Lot events
 */
Event.on('lot::purchased', 'Lot.purchased')

Event.on('lot::updateCurrentPrice', async (lot) => {
  await lot.update({ 'current_price': 4 })
})
