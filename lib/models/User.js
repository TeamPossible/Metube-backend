const pool = require('../utils/pool');


module.exports = class User {
  id;
  email;
  #passwordHash;
  username;
  
  constructor(row) {
    this.id = row.id;
    this.email = row.email;
    this.#passwordHash = row.password;
    this.username = row.username;
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
  
  get password() {
    return this.#passwordHash;
  }
};
