const { Router } = require('express');
const authenticate = require('../middleware/authenticate');

const UserService = require('../services/UserService');

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;
const IS_DEPLOYED = process.env.NODE_ENV === 'production';

module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      const { user, token } = await UserService.create(req.body);
      res.cookie(process.env.COOKIE_NAME, token, {
        secure: IS_DEPLOYED,
        sameSite: IS_DEPLOYED ? 'none' : 'strict',
        httpOnly: true,
        maxAge: ONE_DAY_IN_MS,
      });
      res.json(user);
    } catch (error) {
      next(error);
    }
  })

  .post('/sessions', async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { token, user } = await UserService.signIn(email, password);
      res
        .cookie(process.env.COOKIE_NAME, token, {
          secure: IS_DEPLOYED,
          sameSite: IS_DEPLOYED ? 'none' : 'strict',
          httpOnly: true,
          maxAge: ONE_DAY_IN_MS,
        })
        .json({ message: 'Signed in successfully!', profile: user });
    } catch (error) {
      next(error);
    }
  })

  .delete('/', (req, res) => {
    res
      .clearCookie(process.env.COOKIE_NAME, {
        secure: IS_DEPLOYED,
        sameSite: IS_DEPLOED ? 'none' : 'strict',
        httpOnly: true,
      })
      .json({
        success: true,
        message: 'Successfully signed out!',
      });
  });
