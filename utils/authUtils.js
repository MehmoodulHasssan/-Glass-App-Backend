const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');

// Token generation
const generateToken = (user) => {
  // Create a JWT token with user information
  const token = jwt.sign({ userId: user._id }, process.env.TOKEN_KEY, {
    expiresIn: '1h',
  });
  return token;
};

// Token verification
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    return decoded;
  } catch (error) {
    throw error;
  }
};

// Password hashing
const hashPassword = async (password) => {
  const saltRounds = 10; // Adjust salt rounds as needed
  const hashedPassword = await bcryptjs.hash(password, saltRounds);
  return hashedPassword;
};

// Password comparison
const comparePassword = async (password, hashedPassword) => {
  const match = await bcryptjs.compare(password, hashedPassword);
  return match;
};

module.exports = {
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword,
};
