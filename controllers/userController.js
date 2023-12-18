const User = require('../models/userModel');
const { generateTokens } = require('../utils/tokenUtils');

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.register(res, name, email, password);

    if (user) {
      const { at, rt } = generateTokens(user._id);

      res.cookie('at', at, {
        httpOnly: true,
        maxAge: 5 * 60 * 1000,
      });

      res.cookie('rt', rt, {
        httpOnly: true,
        maxAge: 8 * 60 * 60 * 1000,
      });

      res.status(200).json({
        _id: user._id,
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data.');
    }
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/users
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.login(res, email, password);

    if (user) {
      const { at, rt } = generateTokens(user._id);

      res.cookie('at', at, {
        httpOnly: true,
        maxAge: 60 * 1000,
      });

      res.cookie('rt', rt, {
        httpOnly: true,
        maxAge: 8 * 60 * 60 * 1000,
      });

      res.status(200).json({
        _id: user._id,
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data.');
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
