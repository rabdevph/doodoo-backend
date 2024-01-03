const jwt = require('jsonwebtoken');
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
      const { at, st } = generateTokens(user._id);

      res
        .cookie('at', at, {
          httpOnly: true,
          maxAge: 5 * 60 * 1000,
          secure: true,
        })
        .cookie('st', st, {
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
      const { at, st } = generateTokens(user._id);

      res.cookie('at', at, {
        httpOnly: true,
        maxAge: 60 * 1000,
        secure: true,
      });

      res.cookie('st', st, {
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
    .cookie('st', '', {
      httpOnly: true,
      expiresIn: new Date(0),
      secure: true,
    })
    .send();
};

// @desc    Check access token
// @route   GET /api/users/access-token
// @access  Public
const hasAccessToken = (req, res) => {
  try {
    const accessToken = req.cookies.at;

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    if (decoded) {
      res.json({ _id: decoded._id, hasAccessToken: true });
    }
  } catch (err) {
    res.json({ _id: null, hasAccessToken: false });
  }
};

// @desc    Check refresh token
// @route   GET /api/users/session-token
// @access  Public
const hasSessionToken = (req, res) => {
  try {
    const sessionToken = req.cookies.st;

    const decoded = jwt.verify(sessionToken, process.env.SESSION_TOKEN_SECRET);

    if (decoded) {
      res.json({ _id: decoded._id, hasSessionToken: true });
    }
  } catch (err) {
    res.json({ _id: null, hasSessionToken: false });
  }
};

module.exports = { register, login, logout, hasAccessToken, hasSessionToken };
