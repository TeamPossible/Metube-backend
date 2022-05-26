const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try{
    const { teampossible } = req.cookies;
    const payload = jwt.verify(teampossible, process.env.JWT_SECRET);
    req.user = payload;

    next();
  } catch (error) {
    error.status = 401;
    error.message('you must be signed in to view this page!');
    next(error);
  }
};
