const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.MONGODB_URI;

const connectDb = async () => {
  mongoose.set('strictQuery', true);
  try {
    await mongoose.connect(uri);

    const connection = mongoose.connection;
    connection.on('connected', () => {
      console.log('mongodb is connected');
    });
    // console.log('Mongo connected...');
    connection.on('error', (error) => {
      console.log('Error connecting with mongoDb ' + error);
      process.exit();
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDb;
