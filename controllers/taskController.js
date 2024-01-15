const Task = require('../models/taskModel');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getAll = async (req, res, next) => {
  try {
    const task = await Task.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
};

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  const errorFields = [];

  try {
    const { description, priorityLevel, progress } = req.body;
    const { _id } = req.user;

    if (!description) {
      errorFields.push('description');
      res.status(400);
      const error = new Error('Please fill task description.');
      error.errorFields = errorFields;
      throw error;
    }

    const newTask = await Task.create({
      userId: _id,
      description,
      priorityLevel,
      progress,
    });

    res.status(200).json(newTask);
  } catch (err) {
    next(err);
  }
};

// @desc    Update task
// @route   PATCH /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndUpdate({ _id: id }, { ...req.body }, { new: true });

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
    const { id } = req.params;

    const task = await Task.findOneAndDelete({ _id: id });

    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, createTask, deleteTask, updateTask };
