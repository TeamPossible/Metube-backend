const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = class UserService {
  static async create({ email, password, username }) {
    const hashword = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );
    const user = await User.insert({
      email,
      password: hashword,
      username,
    });
    return user;
  }

  static async signIn(email, password = '') {
    try {
      const user = await User.getByEmail(email);

      if (!user) throw new Error('Invalid login credentials');
      if (!bcrypt.compareSync(password, user.password))
        throw new Error('Invalid login credentials');

      const token = jwt.sign({ ...user }, process.env.JWT_SECRET, {
        expiresIn: '1 day',
      });
      return { user, token };
    } catch (error) {
      error.status = 401;
      throw error;
    }
  }
};
