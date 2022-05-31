const { Router } = require('express');
const Like = require('../models/Like');


module.exports = Router()
  .post('/', (req, res, next) => {
    console.log('***likes', req.body);
    return Like.insert({
      ...req.body,
      
    })
      .then((like) => res.send(like))
      .catch((error) => next(error));
  });
