const express = require('express');

const { register } = require('../controllers/userController');

const router = express.Router();

router.post('/register', register);

router.post('/login', (req, res) => {
  res.json({ message: 'login route' });
});

router.get('/logout', (req, res) => {
  res.json({ message: 'logout route' });
});

module.exports = router;
