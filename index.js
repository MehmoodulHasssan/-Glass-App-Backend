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
app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:3000', 'http://192.168.1.5:3000'];
  const origin = req.headers.origin;
  // console.log(origin);
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', true);
  }
  if (req.method === 'OPTIONS') {
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET,HEAD,PUT,PATCH,POST,DELETE'
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization'
    );
    return res.status(204).end();
  }
  next();
});

// app.use(
//   cors({
//     origin: process.env.NEXT_PUBLIC_API_DOMAIN,
//     methods: ['GET', 'POST', 'PATCH'],
//     allowedHeaders: ['Content-Type'],
//     credentials: true,
//   })
// );

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

//routes
app.use('/api/auth', require('./routes/authRouter'));
app.use('/api/message', require('./routes/messageRouter'));
app.use('/api/users', require('./routes/usersRouter'));
app.get('/api/getToken', getToken);

//error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof ApiError) {
    return res
      .status(error.status)
      .json({ status: error.status, message: error.message });
  }
  return res.status(500).json({ message: 'Internal Server Error' });
});

//listening sever

server.listen(PORT, () => {
  console.log(`server is running at ${PORT}...`);
});
