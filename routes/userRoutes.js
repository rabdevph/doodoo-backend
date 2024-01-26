const express = require('express');

const {
  register,
  login,
  logout,
  getSession,
  getDetails,
} = require('../controllers/userController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/get-session', getSession);
router.post('/get-details', getDetails);

module.exports = router;
