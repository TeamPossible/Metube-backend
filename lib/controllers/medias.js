const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Media = require('../models/Media');


module.exports = Router()
  .post('/', authenticate, (req, res, next) => {
    
    Media.insert({
      ...req.body,
      
    })
      .then((media) => res.send(media))
      .catch((error) => next(error));
  });

