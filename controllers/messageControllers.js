const Message = require('../models/Message');
const User = require('../models/User');
const Conversation = require('../models/Conversation');
const { getReceiverSocketId, io } = require('../socket/socket');
const ApiError = require('../utils/ApiError');

const sendMessage = async (req, res, next) => {
  try {
    const { id: receiverId } = req.params;
    const { message } = req.body;

    const senderId = req.user._id;
    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        members: [senderId, receiverId],
      });
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
    });

    if (!conversation.messages.includes(newMessage._id)) {
      conversation.messages.push(newMessage._id);
      await conversation.save();
    }

    // its to check whether the user is online or offline now
    //io.to is used to send message to a particular user
    const recieverSocketId = getReceiverSocketId(receiverId);
    if (recieverSocketId) {
      io.to(recieverSocketId).emit('message', newMessage);
      console.log('emitted');
    }

    return res.status(200).json({
      success: true,
      message: newMessage,
    });
  } catch (error) {
    console.log(error);
    return next(ApiError.internal('Server Error'));
  }
};

const getMessages = async (req, res, next) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    const conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    })
      .select('messages')
      .populate('messages');

    return res.status(200).json({ conversation: conversation || [] });
  } catch (error) {
    console.log(error);
    next(ApiError.internal('Server Error'));
  }
};
module.exports = { sendMessage, getMessages };
