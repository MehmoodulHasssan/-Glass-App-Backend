const User = require('../models/User');
const ApiError = require('../utils/ApiError');

const getUsersForSideBar = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } }).select([
      'username',
      'profilePic',
      'email',
      '_id',
    ]);
    if (!users) {
      return res.status(200).json([]);
    }
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return next(ApiError.internal(error.message));
  }
};

module.exports = { getUsersForSideBar };
