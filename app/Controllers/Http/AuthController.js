'use strict';

const { validate } = use('Validator');
const User = use('App/Models/User');
const Event = use('Event');
const Env = use('Env');
const crypto = require('crypto');

class AuthController {
  async register ({ request, response }) {
    const params = request.only(['email', 'first_name', 'last_name', 'phone', 'birth_day', 'password']);
    params['confirmation_token'] = crypto.randomBytes(24).toString('hex');
    const user = await User.create(params);
    Event.fire('new::user', user);
    return response.json(user);
  }

  async confirmation ({ request, response }) {
    try {
      const user = await User.findByOrFail('confirmation_token', request.get().confirmation_token);
      user.confirmation_token = null;
      user.confirmed_at = new Date();
      await user.save();
      return response.redirect(Env.get('CONFIRM_SUCCESS_URL'));
    } catch (e) {
      return response.status(403).json({ message: 'User not found' });
    }
  }

  async login ({ request, auth, response }) {
    try {
      const { email, password } = request.all();
      const user = await User.findByOrFail({ email: email, confirmation_token: null });
      let { token } = await auth.attempt(email, password);
      response.header('Authorization', `Bearer ${token}`).json(user);
    } catch (e) {
      return response.status(403).json({ message: 'User not found' });
    }
  }
}

module.exports = AuthController;
