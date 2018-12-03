const Event = use('Event')
/*
  Auth events
 */
Event.on('user::new', 'User.new')
Event.on('user::restorePassword', 'User.restorePassword')

/*
  Lot events
 */
Event.on('lot::created', 'Lot.created')
Event.on('lot::updated', 'Lot.updated')
Event.on('lot::foundWinner', 'Lot.foundWinner')

Event.on('lot::updateCurrentPrice', async (lot) => {
  await lot.update({ 'current_price': 4 })
})
