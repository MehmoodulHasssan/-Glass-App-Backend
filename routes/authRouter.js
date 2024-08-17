const express = require('express');
const authRouter = express.Router();
const {
  loginHandler,
  signupHandler,
  logoutHandler,
} = require('../controllers/authControllers');

authRouter.get('/login', loginHandler);
authRouter.post('/signup', signupHandler);
authRouter.post('/logout', logoutHandler);

module.exports = authRouter;
