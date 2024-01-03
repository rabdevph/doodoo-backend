const jwt = require('jsonwebtoken');
const generateTokens = require('../utils/tokenUtils');

const auth = async (req, res, next) => {
  try {
    const sessionToken = req.cookies.st;

    if (!sessionToken) {
      console.log('error in session token');
      res.status(400);
      throw new Error('No session token.');
    }

    const decodedSessionToken = jwt.verify(sessionToken, process.env.SESSION_TOKEN_SECRET);

    const accessToken = req.cookies.at;

    if (!accessToken) {
      const { at, st } = generateTokens(decodedSessionToken._id);

      const decodedNewAccessToken = await jwt.verify(at, process.env.ACCESS_TOKEN_SECRET);

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
        _id: decodedNewAccessToken._id,
      };
    } else {
      const decodedAccessToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      req.user = {
        _id: decodedAccessToken._id,
      };
    }

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = auth;
