const User = require('../models/User');

const getUsersForSideBar = async (req, res) => {
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
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { getUsersForSideBar };
