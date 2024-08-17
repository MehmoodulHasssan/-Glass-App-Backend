const messageRouter = require('express').Router();
const {
  sendMessage,
  getMessages,
} = require('../controllers/messageControllers');
const authenticateUser = require('../middlewares/protectRoute');

messageRouter.post('/send/:id', authenticateUser, sendMessage);
messageRouter.get('/:id', authenticateUser, getMessages);

module.exports = messageRouter;
