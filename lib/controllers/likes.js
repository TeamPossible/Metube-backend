const { Router } = require('express');
const Like = require('../models/Like');


module.exports = Router()
  .post('/', (req, res, next) => {
    return Like.insert({
      ...req.body,
      
    })
      .then((like) => res.send(like))
      .catch((error) => next(error));
  })

  .get('/:user_id', async (req, res) => {
    const like = await Like.getById(req.params.user_id);
    res.json(like);
  })

  .patch('/:user_id', async (req, res, next) => {
    try {
      const { user_id } = req.params;

      const existingLike = await Like.updateById(user_id, req.body);

      if(!existingLike) {
        const error = new Error(`Like by ${user_id} not found`);
        error.status = 404;
        throw error;
      }

      res.json(existingLike);
    } catch (error) {
      next(error);
    }
  });

  
