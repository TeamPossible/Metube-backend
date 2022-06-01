const pool = require('../utils/pool');

module.exports = class Media {
  user_id;
  title;
  description;
  video_id;
  video_url;

  constructor(row) {
    this.user_id = row.user_id;
    this.title = row.title;
    this.description = row.description;
    this.video_id = row.video_id;
    this.video_url = row.video_url;

  }

  static insert ({ user_id, title, description, video_url }) {
    return pool.query(
      `INSERT INTO
          videos (user_id, title, description, video_url)
          VALUES
          ($1, $2, $3, $4)
          RETURNING
          *`,
      [user_id, title, description, video_url]
    )
      .then(({ rows }) => new Media(rows[0]))
      .catch((error) => {throw new Error(error);});
      
  }
  
};
