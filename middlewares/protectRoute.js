const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

const authenticateUser = async (req, res, next) => {
  // console.log(req);
  try {
    // Get the token from the Authorization header
    const token =
      req.cookies?.token || req.header('authorization')?.replace('Bearer ', '');

    // console.log(token);
    if (!token) {
      return next(ApiError.unauthorized('No token provided'));
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);

    // Find the user by ID (assuming the token contains the user's ID)
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res
        .status(401)
        .json({ message: 'User not found, authorization denied' });
    }

    // Attach the user to the request object
    req.user = user;

    // Call the next middleware or route handler
    next();
  } catch (err) {
    if (err instanceof ApiError) {
      return next(err);
    } else {
      if (err.name === 'JsonWebTokenError') {
        return next(
          ApiError.unauthorized('Invalid token, authorization denied')
        );
      } else if (err.name === 'TokenExpiredError') {
        return next(ApiError.unauthorized('Token expired, please login again'));
      } else {
        console.error(err);
        return next(ApiError.internal('Internal Server Error'));
      }
    }
  }
};

module.exports = authenticateUser;
