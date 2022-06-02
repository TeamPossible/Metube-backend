const pool = require('../utils/pool');

module.exports = class Comment {
  user_id;
  comment;
  video_id;

  constructor(row) {
    this.user_id = row.user_id;
    this.comment = row.comment;
    this.video_id = row.video_id;
  }

  static insert({ user_id, comment, video_id }) {
    return pool
      .query(
        `
        INSERT INTO 
          comments (user_id, comment, video_id)
        VALUES
          ($1, $2, $3)
        RETURNING
          *
      `,
        [user_id, comment, video_id]
      )
      .then(({ rows }) => new Comment(rows[0]))
      .catch((error) => {
        throw new Error(error);
      });
  }

  static async getById(video_id) {
    const { rows } = await pool.query(
      `
        SELECT
          *
        FROM
          comments
        WHERE
          video_id=$1
      `,
      [video_id]
    );
    if (!rows[0]) return null;
    return new Comment(rows[0]);
  }
};
