const express = require('express');
const { getAll, createNew, deleteTask, updateTask } = require('../controllers/taskController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', auth, getAll);
router.post('/', auth, createNew);
router.delete('/:taskId', auth, deleteTask);
router.patch('/:taskId', auth, updateTask);

module.exports = router;
