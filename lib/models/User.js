const pool = require('../utils/pool');


module.exports = class User {
  id;
  email;
  #passwordHash;
  
  constructor(row) {
    this.id = row.id;
    this.email = row.email;
    this.#passwordHash = row.password;
  }
};
