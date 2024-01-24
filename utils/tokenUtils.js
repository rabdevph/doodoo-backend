const jwt = require('jsonwebtoken');

const generateTokens = (userDetails) => {
  const at = jwt.sign({ userDetails }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 5 * 60 });
  const st = jwt.sign({ userDetails }, process.env.SESSION_TOKEN_SECRET, {
    expiresIn: 12 * 60 * 60,
  });

  return { at, st };
};

const generateVerificationToken = (email) => {
  const token = jwt.sign({ email }, process.env.VERIFY_TOKEN_SECRET, {
    expiresIn: 12 * 60 * 60,
  });

  return token;
};

module.exports = { generateTokens, generateVerificationToken };
