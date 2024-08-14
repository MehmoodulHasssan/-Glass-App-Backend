const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const loginHandler = async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(400).json({ msg: 'Your Email is not registered' });
  }

  const compare = await bcryptjs.compare(req.body.password, user.password);
  if (!compare) {
    return res.status(400).json({ msg: 'Incorrect password' });
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, isAdmin: user.isAdmin },
    process.env.TOKEN_KEY,
    {
      expiresIn: '12h',
    }
  );
  res.cookie('token', token, {
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    secure: true, // Ensures the cookie is sent only over HTTPS
    maxAge: 43200000, // Cookie expiration time in milliseconds
  });
  return res.status(200).json({ msg: 'Logged In' });
};

const signupHandler = async (req, res) => {
  const { email, password, username, phone, gender } = req.body;

  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return res.status(400).json({ msg: 'Your Email is already registered' });
  }

  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(password, salt);

  //create avatar
  if (gender === 'Male') {
    const avatar =
      'https://avatar.iran.liara.run/public/boy?username=' + username;
  } else if (gender === 'Female') {
    const avatar =
      'https://avatar.iran.liara.run/public/girl?username=' + username;
  }

  const newUser = new User({
    username,
    email,
    phone,
    password: hashedPassword,
    gender,
    profilePic: avatar,
  });

  try {
    const savedUser = await newUser.save();
    return res.status(201).json({
      msg: 'User created successfully',
      user: savedUser,
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

module.exports = { loginHandler, signupHandler };
