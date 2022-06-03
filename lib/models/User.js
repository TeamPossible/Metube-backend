const pool = require('../utils/pool');

module.exports = class User {
  id;
  email;
  #passwordHash;
  username;
  dob;
  avatar;
  bio;

  constructor(row) {
    this.id = row.id;
    this.email = row.email;
    this.#passwordHash = row.password;
    this.username = row.username;
    this.dob = row.dob;
    this.avatar = row.avatar;
    this.bio = row.bio;
  }

  static async insert({ email, password, username }) {
    const { rows } = await pool.query(
      `INSERT INTO users ( email, password, username)
          VALUES ($1, $2, $3)
          RETURNING *`,
      [email, password, username]
    );
    return new User(rows[0]);
  }



  static async getByEmail(email) {
    const { rows } = await pool.query(
      `
      SELECT *
      FROM users
      WHERE email=$1
      `,
      [email]
    );

    if (!rows[0]) return null;

    return new User(rows[0]);
  }

  static async getUserById(id) {
    const { rows } = await pool.query('SELECT * FROM users WHERE id=$1', [id]);

    if (!rows[0]) return null;
    const user = new User(rows[0]);
    return user;
  }

  static async updateBio({ username, avatar, bio, dob, id }) {
    console.log('ARGS', username, avatar, bio, dob, id);

    const user = await User.getUserById(id);
    if (!user) return null;

    const userName = username ?? user.username;
    const userBio = bio ?? user.bio;
    const userDob = dob ?? user.dob;
    const userAvatar = avatar ?? user.avatar;
    const { rows } = await pool.query(
      `
      UPDATE users SET bio=$1, dob=$2, avatar=$3 WHERE username=$4 RETURNING *
      `,
      [userBio, userDob, userAvatar, userName]
    );
    console.log(rows);
    return new User(rows[0]);
  }

  get password() {
    return this.#passwordHash;
  }
};
