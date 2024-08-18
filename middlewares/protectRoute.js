const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateUser = async (req, res, next) => {
  // console.log(req.cookies);
  try {
    // Get the token from the Authorization header
    const token =
      req.cookies?.token || req.header('Authorization')?.replace('Bearer ', '');

    // console.log(token);
    if (!token) {
      return res
        .status(401)
        .json({ message: 'No token provided, authorization denied' });
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
    if (err.name === 'JsonWebTokenError') {
      return res
        .status(401)
        .json({ message: 'Invalid token, authorization denied' });
    } else if (err.name === 'TokenExpiredError') {
      return res
        .status(401)
        .json({ message: 'Token expired, please login again' });
    } else {
      console.error('Internal Server Error:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

module.exports = authenticateUser;
