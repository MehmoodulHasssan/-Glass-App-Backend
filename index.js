const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const connectDb = require('./dbConfigure');

//specifying server and socket vaiables
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 8000;

// create socket server with cors
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

//connecting to db
connectDb();

//Middlewares

app.use(express.static('public'));
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH'],
    allowedHeaders: ['Content-Type'],
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

//connecting to socket
io.on('connection', (socket) => {
  console.log('A user connected', socket.id);

  // Listening for a message from the client
  socket.on('message', (message) => {
    console.log('Message from client:', message.message);
    // Broadcast the message to all connected clients
    // io.emit('message', message.message);
    socket.broadcast.emit('message', message);
  });

  // Handle user disconnect
  socket.on('disconnect', (reason) => {
    console.log('A user disconnected', reason);
  });
});

//routes
app.use('/auth', require('./routes/authRouter'));
app.use('/message', require('./routes/messageRouter'));
app.use('/users', require('./routes/usersRouter'));

//listening sever
server.listen(PORT, () => {
  console.log(`server is running at ${PORT}...`);
});
