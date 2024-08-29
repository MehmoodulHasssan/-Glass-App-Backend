const usersRouter = require('express').Router();
const { getUsersForSideBar } = require('../controllers/usersControllers');
const authenticateUser = require('../middlewares/authMiddleware');

usersRouter.get('/', authenticateUser, getUsersForSideBar);
module.exports = usersRouter;
