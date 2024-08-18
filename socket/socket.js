const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { verifyToken } = require('../utils/authUtils');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

//specifying server and socket vaiables
const app = express();
const server = http.createServer(app);

// create socket server with cors
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

let onlineUsers = [];

const getReceiverSocketId = (receiverId) => {
  return onlineUsers.find((user) => user.userId === receiverId)?.socketId;
};
//connecting to socket
io.on('connection', (socket) => {
  console.log('A user connected', socket.id);

  const token = socket.handshake.query.token;
  if (!token) {
    return socket.disconnect();
  }
  try {
    const { userId } = jwt.verify(token, process.env.TOKEN_KEY);
    if (userId) {
      onlineUsers.push({ userId, socketId: socket.id });
    }
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return socket.disconnect();
  }

  // Emit the updated list of online users to all clients
  io.emit('online-users', onlineUsers);

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
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit('online-users', onlineUsers);
  });
});

module.exports = { app, server, getReceiverSocketId, io };
