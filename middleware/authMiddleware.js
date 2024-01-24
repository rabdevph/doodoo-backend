const jwt = require('jsonwebtoken');
const { generateTokens } = require('../utils/tokenUtils');

const auth = (req, res, next) => {
  try {
    const sessionToken = req.cookies.st;

    if (!sessionToken) {
      res.status(400);
      throw new Error('Session expired.');
    }

    const decodedSessionToken = jwt.verify(sessionToken, process.env.SESSION_TOKEN_SECRET);

    const accessToken = req.cookies.at;

    if (!accessToken) {
      const { at, st } = generateTokens({
        userId: decodedSessionToken.userDetails.userId,
        email: decodedSessionToken.userDetails.email,
      });

      const decodedNewAccessToken = jwt.verify(at, process.env.ACCESS_TOKEN_SECRET);

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

      req.user = {
        userId: decodedNewAccessToken.userDetails.userId,
        email: decodedNewAccessToken.userDetails.email,
      };
    } else {
      const decodedAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

      req.user = {
        userId: decodedAccessToken.userDetails.userId,
        email: decodedAccessToken.userDetails.email,
      };
    }

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = auth;
