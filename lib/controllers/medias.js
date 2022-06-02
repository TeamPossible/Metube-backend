const { Router } = require('express');
const Media = require('../models/Media');
const authenticate = require('../middleware/authenticate');

module.exports = Router()
  .post('/', authenticate, (req, res, next) => {
    Media.insert({
      ...req.body,
    })
      .then((media) => res.send(media))
      .catch((error) => next(error));
  })

  .get('/videos', async (req, res) => {
    const media = await Media.getVideos();
    console.log('MEDIA FETCH', media);
    res.send(media);
  })

  .get('/', async (req, res) => {
    const media = await Media.getAll();
    res.json(media.videos);
  });
