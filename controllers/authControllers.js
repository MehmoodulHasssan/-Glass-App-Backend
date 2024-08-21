const User = require('../models/User');
const {
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword,
} = require('../utils/authUtils');
const dotenv = require('dotenv');
const storage = require('../utils/cloudinaryConfig');
const { app } = require('../socket/socket');
const multer = require('multer');
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
    secure: false, // Ensures the cookie is sent only over HTTPS
    maxAge: 43200000, // Cookie expiration time in milliseconds
    sameSite: 'lax',
  });
  return res
    .status(200)
    .json({ message: 'Logged In', token, profilePic: user.profilePic });
};

// const signupHandler = async (req, res) => {
//   const { email, password, username, phone, profilePic } = req.body;

//   const user = await User.findOne({ email: req.body.email });
//   if (user) {
//     return res
//       .status(400)
//       .json({ message: 'Your Email is already registered' });
//   }

//   const hashedPassword = await hashPassword(password);

//   const upload = { storage: storage };

//   let imageUrl;
//   // Handle file upload route
//   if (profilePic) {
//     try {
//       const uploadedImage = await upload(profilePic, {
//         folder: 'user_profiles',
//         transformation: [{ width: 300, height: 300, crop: 'limit' }],
//         // optional transformation options can be added here
//       });
//       imageUrl = uploadedImage.secure_url;
//     } catch (error) {
//       return res.status(500).json({ message: 'Image upload failed', error });
//     }
//   }

//   // //create avatar
//   // let avatar;
//   // if (gender === 'Male') {
//   //   avatar = 'https://avatar.iran.liara.run/public/boy?username=' + username;
//   // } else if (gender === 'Female') {
//   //   avatar = 'https://avatar.iran.liara.run/public/girl?username=' + username;
//   // }

//   const newUser = new User({
//     username,
//     email,
//     phone,
//     password: hashedPassword,
//     profilePic:
//       imageUrl ||
//       'https://avatar.iran.liara.run/public/boy?username=' + username,
//   });

//   // try {
//   const savedUser = await newUser.save();

//   return res.status(201).json({
//     message: 'User created successfully',
//     user: savedUser,
//   });
//   // } catch (error) {
//   //   return res.status(500).json({ message: error.message });
//   // }
// };

const signupHandler = async (req, res) => {
  const upload = multer({ storage });
  upload.single('profilePic')(req, res, async (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: 'File upload failed', error: err.message });
    }

    const { email, password, username, phone } = req.body;

    console.log(req.body);

    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'Your Email is already registered' });
    }

    const hashedPassword = await hashPassword(password);

    let profilePicUrl = req.file ? req.file.path : null;

    const newUser = new User({
      username,
      email,
      phone,
      password: hashedPassword,
      profilePic:
        profilePicUrl ||
        `https://avatar.iran.liara.run/public/boy?username=${username}`, // Default avatar
    });

    try {
      const savedUser = await newUser.save();
      return res.status(201).json({
        message: 'User created successfully',
        user: savedUser,
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  });
};

const logoutHandler = async (req, res) => {
  try {
    res.clearCookie('token', { httpOnly: true, secure: false });
    return res.status(200).json({ message: 'Logged Out' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = { loginHandler, signupHandler, logoutHandler };
