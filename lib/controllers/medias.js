const { Router } = require('express');
const Media = require('../models/Media');


module.exports = Router()
  .post('/', (req, res, next) => {
    
    Media.insert({
      ...req.body,
      
    })
      .then((media) => res.send(media))
      .catch((error) => next(error));
  });
