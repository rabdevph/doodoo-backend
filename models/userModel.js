const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { sendVerificationEmail } = require('../utils/emailVerificationUtils');
const { generateVerificationToken } = require('../utils/tokenUtils');

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
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timeStamps: true },
);

userSchema.statics.register = async function (res, name, email, password) {
  const errorFields = [];

  if (!name) {
    errorFields.push('name');
  }

  if (!email) {
    errorFields.push('email');
  }

  if (!password) {
    errorFields.push('password');
  }

  // Check empty fields
  if (errorFields.length > 0) {
    res.status(400);
    const errorMessage =
      errorFields.length > 1
        ? `Please enter your ${errorFields.slice(0, -1).join(', ')} and ${errorFields.slice(-1)}.`
        : `Please enter your ${errorFields[0]}.`;
    const error = new Error(errorMessage);
    error.errorFields = errorFields;
    throw error;
  }

  // Check if email is valid
  if (!validator.isEmail(email)) {
    errorFields.push('email');
    res.status(400);
    const error = new Error('Invalid email address.');
    error.errorFields = errorFields;
    throw error;
  }

  // Check if password is strong
  if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    errorFields.push('password');
    res.status(400);
    const error = new Error(
      'Password must be at least 8 characters long and contain at least 1 - lowercase and uppercase letter, number and special character.',
    );
    error.errorFields = errorFields;
    throw error;
  }

  // Check if user already exists
  const userExists = await this.findOne({ email });
  if (userExists) {
    errorFields.push('email');
    res.status(400);
    const error = new Error('User already exists.');
    error.errorFields = errorFields;
    throw error;
  }

  // Send email verification
  const verificationToken = generateVerificationToken(email);

  const emailSent = await sendVerificationEmail(email, verificationToken);

  if (!emailSent) {
    res.status(500);
    const error = new Error('Error sending verification email.');
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await this.create({ name, email, password: hashedPassword });

  return user;
};

userSchema.statics.login = async function (res, email, password) {
  const errorFields = [];

  if (!email) {
    errorFields.push('email');
  }

  if (!password) {
    errorFields.push('password');
  }

  // Check empty fields
  if (errorFields.length > 0) {
    res.status(400);
    const errorMessage =
      errorFields.length > 1
        ? `Please enter your ${errorFields.slice(0, -1).join(', ')} and ${errorFields.slice(-1)}.`
        : `Please enter your ${errorFields[0]}.`;
    const error = new Error(errorMessage);
    error.errorFields = errorFields;
    throw error;
  }

  const user = await this.findOne({ email });

  if (!user) {
    errorFields.push('email');
    res.status(401);
    const error = new Error('Incorrect email address.');
    error.errorFields = errorFields;
    throw error;
  }

  if (!user.isVerified) {
    errorFields.push('email');
    res.status(401);
    const error = new Error(
      'Email address not verified, please check your email for verification.',
    );
    error.errorFields = errorFields;
    throw error;
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    errorFields.push('password');
    res.status(401);
    const error = new Error('Incorrect password.');
    error.errorFields = errorFields;
    throw error;
  }

  return user;
};

module.exports = mongoose.model('User', userSchema);
