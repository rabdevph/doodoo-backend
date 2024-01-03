const jwt = require('jsonwebtoken');

const generateTokens = (_id) => {
  const at = jwt.sign({ _id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 5 * 60 });
  const st = jwt.sign({ _id }, process.env.SESSION_TOKEN_SECRET, { expiresIn: 12 * 60 * 60 });

  return { at, st };
};

module.exports = generateTokens;
