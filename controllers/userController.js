const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const { sendVerificationEmail } = require('../utils/emailVerificationUtils');
const { generateTokens, generateVerificationToken } = require('../utils/tokenUtils');

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    await User.register(res, name, email, password);

    res.status(201).json({
      message: 'User registered succesfully. Please check your email for verification.',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const user = await User.login(res, req.body.email, req.body.password);
    const { at, st } = generateTokens({ userId: user._id, email: user.email });

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
      userId: user._id,
      email: user.email,
    });
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

// @desc    Check session token
// @route   GET /api/users/session-token
// @access  Public
const getSession = async (req, res) => {
  try {
    const session = jwt.verify(req.cookies.st, process.env.SESSION_TOKEN_SECRET);

    res.json({
      userId: session.userDetails.userId,
      email: session.userDetails.email,
      isSessionActive: true,
    });
  } catch (err) {
    res.json({ isSessionActive: false });
  }
};

// @desc    Get user details
// @route   POST /api/users/get-details
// @access  Public
const getDetails = async (req, res, next) => {
  try {
    const { userToken } = req.body;

    const decodedToken = jwt.verify(userToken, process.env.VERIFY_TOKEN_SECRET, {
      ignoreExpiration: true,
    });

    const { email } = decodedToken;

    const user = await User.findOne({ email });

    if (user.isVerified) {
      res.status(200);
      res.json({
        isVerified: user.isVerified,
        message: 'Email address verified. You can login to your account.',
      });
      return;
    }

    jwt.verify(userToken, process.env.VERIFY_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).json({
          email: decodedToken.email,
          message: 'Verification token expired. Send new verification request to',
        });
        return;
      }

      res.status(200).json({
        email: decoded.email,
        isVerified: user.isVerified,
        message: 'Click the button below to verify ',
      });
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  logout,
  getSession,
  getDetails,
};
