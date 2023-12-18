const express = require('express');

const { register, login } = require('../controllers/userController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

router.get('/logout', (req, res) => {
  res.json({ message: 'logout route' });
});

module.exports = router;
