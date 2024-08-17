const usersRouter = require('express').Router();
const { usersHandler } = require('../controllers/usersController');

usersRouter.get('/', usersHandler);
module.exports = usersRouter;
