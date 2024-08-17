const { Schema, models, model } = require('mongoose');

const ConversationSchema = new Schema(
  {
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Message',
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Conversation =
  models.Conversation || model('Conversation', ConversationSchema);
module.exports = Conversation;
