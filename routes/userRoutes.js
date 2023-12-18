const express = require('express');

const { register, login, logout, hasAccessToken } = require('../controllers/userController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/hasAccessToken', hasAccessToken);

module.exports = router;
