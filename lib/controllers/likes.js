const { Router } = require('express');
const Like = require('../models/Like');


module.exports = Router()
  .post('/', (req, res, next) => {
    
    Like.insert({
      ...req.body,
      
    })
      .then((like) => res.send(like))
      .catch((error) => next(error));
  });
