const express = require('express');

const router = express.Router();

router.post('/register', (req, res) => {
  res.json({ message: 'register route' });
});

router.post('/login', (req, res) => {
  res.json({ message: 'login route' });
});

router.get('/logout', (req, res) => {
  res.json({ message: 'logout route' });
});

module.exports = router;
