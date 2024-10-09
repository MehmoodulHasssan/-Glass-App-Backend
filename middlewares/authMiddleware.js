const jwt = require('jsonwebtoken');
const ApiError = require('../utils/ApiError');
const User = require('../models/user');

const authenticateUser = async (req, res, next) => {
  try {
    // Get the token from the Authorization header
    // console.log(req.header('authorization'));
    const accessToken =
      req.cookies?.accessToken ||
      req.header('authorization')?.replace('Bearer ', '');
    // const refreshToken = req.cookies?.refreshToken;
    const refreshToken =
      req.cookies?.refreshToken || req.header('x-refresh-token');

    // console.log(accessToken);

    if (!accessToken && !refreshToken) {
      console.log('errored');
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
      // console.log(accessToken);
      console.log('refreshingToken');
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );

      // console.log(decoded);
      // Fetch user and verify the refresh token
      const user = await User.findById(decoded._id);
      if (!user || user.refreshToken !== refreshToken) {
        throw ApiError.unauthorized('Unauthorized: Invalid refresh token');
      }

      // Generate only a new access token
      const accessToken = user.generateAccessToken();
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      });
      req.user = user;
      next();
    };

    //now starting teh process of adding flags and executing atuthentication
    if (accessToken) {
      try {
        // console.log('accessToken');
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
          console.log('access token expired');
          await refreshTokens(refreshToken);
        } else {
          throw ApiError.unauthorized('Internal Server Error');
        }
      }
    } else if (refreshToken) {
      // console.log(accessToken);
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
