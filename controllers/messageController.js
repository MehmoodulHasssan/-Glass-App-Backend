const Message = require('../models/Message');
const User = require('../models/User');
const Conversation = require('../models/Conversation');

const sendMessage = async (req, res) => {
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

  return res.status(200).json({
    success: true,
    message: newMessage,
  });
};

const getMessages = async (req, res) => {
  const { id: receiverId } = req.params;
  const senderId = req.user._id;
  const conversation = await Conversation.findOne({
    members: { $all: [senderId, receiverId] },
  }).populate('messages');
  //   const messages = await Message.find({
  //     _id: { $in: conversation.messages },
  //   }).sort({ createdAt: 1 });

  return res.status(200).json({
    success: true,
    conversation: conversation || [],
  });
};
module.exports = { sendMessage, getMessages };
