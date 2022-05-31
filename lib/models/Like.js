const pool = require('../utils/pool');

module.exports = class Like {
  user_id;
  is_liked;
  video_id;

  constructor(row) {
    this.user_id = row.user_id;
    this.is_liked = row.is_liked;
    this.video_id = row.video_id;
  }

  static insert ({ user_id, is_liked, video_id }) {
    return pool.query(
      `
        INSERT INTO
          likes
          (user_id, is_liked, video_id)
        VALUES
          ($1, TRUE), ($2)
        RETURNING
          *
      `,
      [user_id, is_liked, video_id]
    )
      .then(({ rows }) => new Like(rows[0]))
      .catch((error) => {throw new Error(error);});
  }
};
