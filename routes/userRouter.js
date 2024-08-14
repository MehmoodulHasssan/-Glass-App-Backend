const express = require('express');
const userRouter = express.Router();
const { loginHandler, signupHandler } = require('../controllers/userHandlers');

userRouter.get('/login', loginHandler);

userRouter.post('/signup', signupHandler);

module.exports = userRouter;
