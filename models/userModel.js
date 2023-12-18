const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timeStamps: true },
);

userSchema.statics.register = async function (res, name, email, password) {
  const userExists = await this.findOne({ email });

  // User already exists
  if (userExists) {
    res.status(400);
    throw new Error('User already exists.');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await this.create({ name, email, password: hashedPassword });

  return user;
};

userSchema.statics.login = async function (res, email, password) {
  const user = await this.findOne({ email });

  if (!user) {
    res.status(401);
    throw new Error('Incorrect email address.');
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    res.status(401);
    throw new Error('Incorrect password.');
  }

  return user;
};

module.exports = mongoose.model('User', userSchema);
