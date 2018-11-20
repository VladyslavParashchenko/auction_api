const Event = use('Event');
const Mail = use('Mail');
const Env = use('Env');

Event.on('new::user', async (user) => {
  const link = `${Env.get('APP_URL')}/api/auth/confirmation?confirmation_token=${user.confirmation_token}`;
  await Mail.send('emails.user_register', { user, link }, (message) => {
    message.to(user.email);
    message.from(Env.get('EMAIL_SENDER_EMAIL'));
  });
});
