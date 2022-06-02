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

  static insert({ user_id, title, description, video_url }) {
    return pool
      .query(
        `INSERT INTO
          videos (user_id, title, description, video_url)
          VALUES
          ($1, $2, $3, $4)
          RETURNING
          *`,
        [user_id, title, description, video_url]
      )
      .then(({ rows }) => new Media(rows[0]))
      .catch((error) => {
        throw new Error(error);
      });
  }

  static async getVideos() {
    const { rows } = await pool.query(
      `
      SELECT
      *
      FROM
      videos
      `
    );
    console.log('ROWS LOG', rows);
    return rows.map((row) => new Media(row));
  }

  static async getVideosById(id) {
    const { rows } = await pool.query(
      `
      SELECT
      *
      FROM
      videos
      WHERE 
      video_id = $1
      `,
      [id]
    );
    console.log('ROWS LOG BY ID', rows);
    return new Media(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query(
      `
      SELECT
      *
      FROM 
      videos
      INNER JOIN
      comments
      ON
      comments.video_id = videos.video_id
      INNER JOIN
      likes
      ON
      likes.video_id = videos.video_id
      `
    );
    this.videos = rows[0];
    return this;
  }
};
