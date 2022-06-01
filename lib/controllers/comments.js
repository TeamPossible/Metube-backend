const { Router } = require('express');
const Comment = require('../models/Comment');


module.exports = Router()
  .post('/', (req, res, next) => {
    
    Comment.insert({
      ...req.body,
      
    })
      .then((comment) => res.send(comment))
      .catch((error) => next(error));
  });
