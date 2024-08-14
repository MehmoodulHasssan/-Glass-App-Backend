const { Schema, model, models } = require('mongoose');

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
  },
  phone: {
    type: String,
    required: [true, 'Provide a phone no'],
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female'],
  },
  profilePic: {
    type: String,
    default: '',
  },
});

const User = models.User || model('User', UserSchema);
module.exports = User;
