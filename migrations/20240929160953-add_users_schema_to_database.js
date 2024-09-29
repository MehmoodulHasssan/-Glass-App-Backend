// migrations/20230929123456-create-user-schema.js
const mongoose = require('mongoose');
const User = require('../models/user'); // Adjust the path as necessary
const connectDb = require('../dbConfigure');

module.exports = {
  async up() {
    //first connect to database
    await connectDb();
    // This will effectively create the collection in MongoDB
    // with the defined schema by inserting a document
    const sampleUser = new User({
      username: 'sampleUser',
      email: 'sample@example.com',
      phone: '1234567890',
      password: 'samplePassword',
      profilePic:
        'https://avatar.iran.liara.run/public/boy?username=sampleUser',
    });

    await sampleUser.save();
  },

  async down() {
    // This will drop the users collection to revert the migration
    await User.deleteMany({});
  },
};
