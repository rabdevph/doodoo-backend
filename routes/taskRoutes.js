const express = require('express');
const { getAll, createTask, deleteTask, updateTask } = require('../controllers/taskController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', auth, getAll);
router.post('/', auth, createTask);
router.delete('/:id', auth, deleteTask);
router.patch('/:id', auth, updateTask);

module.exports = router;
