const { Router } = require('express');
const Comment = require('../models/Comment');

module.exports = Router()
  .post('/', (req, res, next) => {
    console.log('TRACKING DOWN ERROR', req.body);
    Comment.insert({
      ...req.body,
    })
      .then((comment) => res.send(comment))
      .catch((error) => next(error));
  })

  .get('/:video_id', async (req, res) => {
    console.log('COMMENTS PARAMS', req.params);
    const like = await Comment.getById(req.params.video_id);
    console.log('COMMENT FETCH', like);
    res.json(like);
  });
