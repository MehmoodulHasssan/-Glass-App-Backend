const express = require('express');
const userRouter = express.Router();
const User = require('../models/user');

userRouter.get('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  return;
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ msg: 'Email does not exist' });
  }

  const compare = await bcrypt.compare(req.body.password, user.password);
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
  return res.status(200).json({ msg: 'cookie sent' });
});

userRouter.post('/signup', async (req, res) => {
  const { email, password, username } = req.body;
  console.log(email, password, username);
  return;
});

module.exports = userRouter;
