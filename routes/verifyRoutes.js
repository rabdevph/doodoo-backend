const express = require('express');

const { verify, resendVerification } = require('../controllers/verifyController');

const router = express.Router();

router.patch('/', verify);
router.post('/resend-verification', resendVerification);

module.exports = router;
