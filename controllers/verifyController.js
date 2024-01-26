const User = require('../models/userModel');
const { sendVerificationEmail } = require('../utils/emailVerificationUtils');
const { generateVerificationToken } = require('../utils/tokenUtils');

// @desc    Verify email address
// @route   PATCH /api/verify
// @access  Public
const verify = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOneAndUpdate({ email }, { isVerified: true }, { new: true });

    if (!user) {
      res.status(400).json({ message: 'Email address not registered.' });
      return;
    }

    res.status(200);
    res.json({
      isVerified: true,
      message: 'Email address successfully verified. You can login to your account.',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Resend verification email
// @route   POST /api/verify/resend-verification
// @access  Public
const resendVerification = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    const verificationToken = generateVerificationToken(user.email);

    const emailSent = await sendVerificationEmail(user.email, verificationToken);

    if (!emailSent) {
      res.status(500).json({ message: 'Error sending verification email.' });
      return;
    }

    res.status(200);
    res.json({
      email: user.email,
      isSent: true,
      message: 'Verification email sent to',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { verify, resendVerification };
