const express = require('express');
const authRouter = express.Router();
const {
  loginHandler,
  signupHandler,
  logoutHandler,
} = require('../controllers/authControllers');
const authenticateUser = require('../middlewares/authMiddleware');

authRouter.post('/login', loginHandler);
authRouter.post('/signup', signupHandler);
authRouter.post('/logout', authenticateUser, logoutHandler);

module.exports = authRouter;
