const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  fullName: {
    type: String,
    required: [true, 'Please provide a username'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = models.User || model('User', UserSchema);
module.exports = User;
