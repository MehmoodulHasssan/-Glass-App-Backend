const { Schema, model, models } = require('mongoose');

const MessageSchema = new Schema(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Message = models.Message || model('Message', MessageSchema);
module.exports = Message;
