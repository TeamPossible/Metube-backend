const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

// Built in middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  require('cors')({
    origin: ['http://localhost:7891'],
    credentials: true,
  })
);
// App routes
app.use('/api/v1/users', require('./controllers/users'));
app.use('/api/v1/media', require('./controllers/media'));

// Error handling & 404 middleware for when
// a request doesn't match any app routes
app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
