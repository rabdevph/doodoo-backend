const express = require('express');

const {
  register,
  login,
  logout,
  hasAccessToken,
  hasSessionToken,
} = require('../controllers/userController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/access-token', hasAccessToken);
router.get('/session-token', hasSessionToken);

module.exports = router;
