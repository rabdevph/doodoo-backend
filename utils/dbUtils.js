const mongoose = require('mongoose');

const connectToDb = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI not found.');
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected to MongoDB: ${conn.connection.host.cyan.underline}`);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectToDb;
