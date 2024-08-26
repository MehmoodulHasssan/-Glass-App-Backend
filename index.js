const cookieParser = require('cookie-parser');
const cors = require('cors');
const getToken = require('./utils/getToken.js');
const express = require('express');
require('dotenv').config();
const connectDb = require('./dbConfigure');
const { server, app } = require('./socket/socket.js');
const ApiError = require('./utils/ApiError.js');

const PORT = process.env.PORT || 8000;

//connecting to db
connectDb();

//Middlewares

app.use(express.static('public'));
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

//routes
app.use('/api/auth', require('./routes/authRouter'));
app.use('/api/message', require('./routes/messageRouter'));
app.use('/api/users', require('./routes/usersRouter'));
app.get('/api/getToken', getToken);

//error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message });
  }
  return res.status(500).json({ message: 'Internal Server Error' });
});

//listening sever

server.listen(PORT, () => {
  console.log(`server is running at ${PORT}...`);
});
