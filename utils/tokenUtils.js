const jwt = require('jsonwebtoken');

const generateTokens = (userDetails) => {
  const at = jwt.sign({ userDetails }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 5 * 60 });
  const st = jwt.sign({ userDetails }, process.env.SESSION_TOKEN_SECRET, {
    expiresIn: 12 * 60 * 60,
  });

  return { at, st };
};

module.exports = generateTokens;
