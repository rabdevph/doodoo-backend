const Task = require('../models/taskModel');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getAll = async (req, res, next) => {
  try {
    const task = await Task.getAll(res, req.user.userId);

    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createNew = async (req, res, next) => {
  try {
    const task = await Task.createNew(
      res,
      req.user.userId,
      req.body.description,
      req.body.priorityLevel,
    );

    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
};

// @desc    Update task status
// @route   PATCH /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.updateTask(res, req.params.taskId, req.body);

    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.deleteTask(res, req.params.taskId);

    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, createNew, deleteTask, updateTask };
