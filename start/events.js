const Event = use('Event')
const Mail = use('Mail')
const Env = use('Env')

Event.on('user::new', async (user) => {
  const link = `${Env.get('APP_URL')}/api/auth/confirmation?confirmation_token=${user.confirmation_token}`
  await Mail.send('emails.user_register', { user, link }, (message) => {
    message.to(user.email)
    message.from(Env.get('EMAIL_SENDER_EMAIL'))
  })
})

Event.on('user::restore_password', async (user, link) => {
  await Mail.send('emails.user_restore_password', { user, link }, (message) => {
    message.to(user.email)
    message.from(Env.get('EMAIL_SENDER_EMAIL'))
  })
})

Event.on('lot::purchased', async ({ bidInstance, lot }) => {
  lot.current_price = bidInstance.proposed_price
  const lotOwner = await lot.user()
  const bidOwner = await bidInstance.user()
  await Mail.send('emails.lot_purchased', lot, (message) => {
    message.to(lotOwner.email)
    message.from(Env.get('EMAIL_SENDER_EMAIL'))
  })
  await Mail.send('emails.you_purchased_lot', lot, (message) => {
    message.to(bidOwner.email)
    message.from(Env.get('EMAIL_SENDER_EMAIL'))
  })
})

Event.on('lot::updateCurrentPrice', async (lot) => {
  await lot.update({ 'current_price': 4 })
})
