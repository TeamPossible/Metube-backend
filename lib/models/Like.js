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

  static async insert ({ user_id, is_liked, video_id }) {
    console.log('***insert', user_id, is_liked, video_id);
    try {
      const { rows } = await pool.query(
        `
        INSERT INTO
          likes
          (user_id, is_liked, video_id)
        VALUES
          ($1, $2, $3)
        RETURNING
          *
      `,
        [user_id, is_liked, video_id]
      );
      return new Like(rows[0]);
    } catch (error) {
      throw new Error(error);
    }
  }

  static async getById(user_id) {
    const { rows } = await pool.query(
      `
        SELECT
          *
        FROM
          likes
        WHERE
          user_id=$1
      `,
      [user_id]
    );
    if(!rows[0]) return null;
    return new Like(rows[0]);
  }

  static async updateById(user_id, video_id, { is_liked }) {
    const existingLike = await Like.getById(user_id);
    if(!existingLike) return null;
    const updatedLiked = is_liked ?? existingLike.is_liked;
    const { rows } = await pool.query(
      `
        UPDATE
          likes
        SET
          is_liked=$2
        WHERE 
          user_id=$1,
          video_id=$3
        RETURNING 
          *
      `,
      [user_id, video_id, updatedLiked]
    );
    return new Like(rows[0]);
  } 
};
