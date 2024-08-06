const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const dbConfigure = require('./dbConfigure');

const app = express();
const PORT = process.env.PORT || 8000;

//connecting to db
dbConfigure.connectDb();

//Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

//routes
app.use('/user', require('./routes/userRouter'));

//listening sever
app.listen(PORT, () => {
  console.log(`server is running at ${PORT}...`);
});
