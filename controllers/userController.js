const User = require('../models/userModel');
const { generateTokens } = require('../utils/tokenUtils');

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.register(res, name, email, password);

    if (user) {
      const { at, rt } = generateTokens(user._id);

      res
        .cookie('at', at, {
          httpOnly: true,
          maxAge: 5 * 60 * 1000,
          secure: true,
        })
        .cookie('rt', rt, {
          httpOnly: true,
          maxAge: 8 * 60 * 60 * 1000,
          secure: true,
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
// @route   POST /api/users/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.login(res, email, password);

    if (user) {
      const { at, rt } = generateTokens(user._id);

      res
        .cookie('at', at, {
          httpOnly: true,
          maxAge: 60 * 1000,
          secure: true,
        })
        .cookie('rt', rt, {
          httpOnly: true,
          maxAge: 8 * 60 * 60 * 1000,
          secure: true,
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

// @desc    Logout user
// @route   GET /api/users/logout
// @access  Public
const logout = (req, res) => {
  res
    .cookie('at', '', {
      httpOnly: true,
      expiresIn: new Date(0),
      secure: true,
    })
    .cookie('rt', '', {
      httpOnly: true,
      expiresIn: new Date(0),
      secure: true,
    })
    .send();
};

module.exports = { register, login, logout };
