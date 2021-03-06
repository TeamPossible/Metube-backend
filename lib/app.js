const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

// Built in middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  require('cors')({
    origin: ['https://heartfelt-chaja-495e99.netlify.app'],
    credentials: true,
  })
);
// App routes
app.use('/api/v1/users', require('./controllers/users'));
app.use('/api/v1/media', require('./controllers/medias'));
app.use('/api/v1/comment', require('./controllers/comments'));
app.use('/api/v1/like', require('./controllers/likes'));
// Error handling & 404 middleware for when
// a request doesn't match any app routes
app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
