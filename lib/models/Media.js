const pool = require('../utils/pool');

module.exports = class Media {
  user_id;
  title;
  description;
  video_id;
  comment;
  like;

  constructor(row) {
    this.user_id = row.user_id;
    this.title = row.title;
    this.description = row.description;
    this.video_id = row.video_id;
    this.comment = row.comment;
    this.like = row.like;
  }

  static insert ({ user_id, title, description, video_id }) {
    return pool.query(
      `INSERT INTO
          description (user_id, title, description, video_id)
          VALUES
          ($1, $2, $3, $4)
          RETURNING
          *`,
      [user_id, title, description, video_id]
    )
      .then(({ rows }) => new Media(rows[0]))
      .catch((error) => {throw new Error(error);});
      
  }

  
};
