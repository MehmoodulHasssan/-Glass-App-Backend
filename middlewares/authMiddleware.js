const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/ApiError');

const authenticateUser = async (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const accessToken =
      req.cookies?.accessToken ||
      req.header('authorization')?.replace('Bearer ', '');
    // const refreshToken = req.cookies?.refreshToken;
    const refreshToken = req.header('x-refresh-token');

    if (!accessToken && !refreshToken) {
      throw ApiError.unauthorized('No token provided');
    }

    // Defining cusotm function for passing user to next controller
    const setUserAndContinue = async (userId) => {
      const user = await User.findById(userId);
      if (!user) {
        throw ApiError.unauthorized('User not found, authorization denied');
      }
      req.user = user;
      next();
    };

    // Defining cusotm function for refreshing the access token
    const refreshTokens = async (refreshToken) => {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      // Fetch user and verify the refresh token
      const user = await User.findById(decoded._id);
      if (!user || user.refreshToken !== refreshToken) {
        throw ApiError.unauthorized('Unauthorized: Invalid refresh token');
      }

      // Generate only a new access token
      const accessToken = user.generateAccessToken();
      res.cookies('accessToken', accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      });
      req.user = user;
      next();
    };
    if (accessToken) {
      try {
        const decoded = jwt.verify(
          accessToken,
          process.env.ACCESS_TOKEN_SECRET
        );
        // console.log(decoded);
        await setUserAndContinue(decoded._id);
      } catch (err) {
        if (err.name === 'JsonWebTokenError') {
          return next(
            ApiError.unauthorized('Invalid token, authorization denied')
          );
        } else if (err.name === 'TokenExpiredError') {
          await refreshTokens(refreshToken);
        } else {
          throw ApiError.unauthorized('Internal Server Error');
        }
      }
    } else if (refreshToken) {
      await refreshTokens(refreshToken);
    }
  } catch (err) {
    console.error(err);
    if (err instanceof ApiError) {
      return next(err);
    } else {
      return next(ApiError.unauthorized('Internal Server Error'));
    }
  }
};

module.exports = authenticateUser;
