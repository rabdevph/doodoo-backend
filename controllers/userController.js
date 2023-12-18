const User = require('../models/userModel');

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.register(res, name, email, password);

    if (user) {
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
