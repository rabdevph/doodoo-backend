const express = require('express');
const { getAll, create } = require('../controllers/taskController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', auth, getAll);
router.post('/', auth, create);

module.exports = router;
