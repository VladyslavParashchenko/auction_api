const Event = use('Event')
/*
  Auth events
 */
Event.on('user::new', 'User.new')
Event.on('user::restorePassword', 'User.restorePassword')

/*
  Lot events
 */
Event.on('lot::created', 'LotListener.created')
Event.on('lot::updated', 'LotListener.updated')
Event.on('lot::started', 'LotListener.started')
Event.on('lot::foundWinner', 'LotListener.foundWinner')
