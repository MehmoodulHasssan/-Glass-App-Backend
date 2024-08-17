const User = require('../models/User');
const {
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword,
} = require('../utils/authUtils');
const dotenv = require('dotenv');
dotenv.config();

const loginHandler = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(400).json({ message: 'Your Email is not registered' });
  }
  const correctPassword = await comparePassword(password, user.password);
  if (!correctPassword) {
    return res.status(400).json({ message: 'Incorrect password' });
  }

  const token = generateToken(user);

  res.cookie('token', token, {
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    secure: true, // Ensures the cookie is sent only over HTTPS
    maxAge: 43200000, // Cookie expiration time in milliseconds
  });
  return res.status(200).json({ message: 'Logged In' });
};

const signupHandler = async (req, res) => {
  const { email, password, username, phone, gender } = req.body;
  console.log(req.body);

  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return res
      .status(400)
      .json({ message: 'Your Email is already registered' });
  }

  const hashedPassword = await hashPassword(password);

  //create avatar
  let avatar;
  if (gender === 'Male') {
    avatar = 'https://avatar.iran.liara.run/public/boy?username=' + username;
  } else if (gender === 'Female') {
    avatar = 'https://avatar.iran.liara.run/public/girl?username=' + username;
  }

  const newUser = new User({
    username,
    email,
    phone,
    password: hashedPassword,
    gender,
    profilePic: avatar,
  });

  // try {
  const savedUser = await newUser.save();

  return res.status(201).json({
    message: 'User created successfully',
    user: savedUser,
  });
  // } catch (error) {
  //   return res.status(500).json({ message: error.message });
  // }
};

const logoutHandler = async (req, res) => {
  try {
    res.clearCookie('token');
    return res.status(200).json({ message: 'Logged Out' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { loginHandler, signupHandler, logoutHandler };
