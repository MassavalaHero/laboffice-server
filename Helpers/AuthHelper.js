const jwt = require('jsonwebtoken');
const dbConfig = require('../config/secret');
const HttpStatus = require('http-status-codes');

//We export the method "verify token". This method will called on each routes
module.exports = {
  verifyToken: (req, res, next) => {
    if (!req.headers.authorization) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'No Authorization' });
    }
    //we have to check if there's a token in the cookie if not, it'll check to the authorization header. if it doesn't find it, it'll return an error
    const token = req.cookies.auth || req.headers.authorization.split(' ')[1];
    console.log(token);

    // If there's no token, the error message will be displayed.
    if (!token) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'No token provided' });
    }
    // Else, we verify that the token is valid.
    return jwt.verify(token, dbConfig.secret, (err, decoded) => {
      // If there's an error, inside the error, inside the error we get the expiredAt value, and we check if the expired value is less than the current time. Othewise, we set req.user = decoded.data.
      if (err) {
        if (err.expiredAt < new Date()) {
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            message: 'token has expired, please login again',
            token: null
          });
        }
        next();
      }
      req.user = decoded.data;
      next();
    });
  }
};
