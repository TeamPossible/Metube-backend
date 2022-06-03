const pool = require('../utils/pool');

module.exports = class Comment {
  user_id;
  comment;
  video_id;
  username;
  avatar;

  constructor(row) {
    this.user_id = row.user_id;
    this.comment = row.comment;
    this.video_id = row.video_id;
    this.username = row.username;
    this.avatar = row.avatar;
  }

  static insert({ user_id, comment, video_id, username, avatar }) {

    return pool
      .query(
        `
        INSERT INTO 
          comments (user_id, comment, video_id, username, avatar)
        VALUES
          ($1, $2, $3, $4, $5)
        RETURNING
          *
      `,
        [user_id, comment, video_id, username, avatar]
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
    return rows.map((row) => new Comment(row));
  }
};
