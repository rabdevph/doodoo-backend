const jwt = require('jsonwebtoken');

const generateTokens = (_id) => {
  const at = jwt.sign({ _id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 60 });
  const rt = jwt.sign({ _id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: 12 * 60 * 60 });

  return { at, rt };
};

module.exports = { generateTokens };
