const mongoose = require('mongoose');
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
const create = async (req, res, next) => {
  try {
    const { description, priorityLevel, progress } = req.body;
    const { _id } = req.user;

    if (!description) {
      res.status(400);
      throw new Error('Please fill the description.');
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

module.exports = { getAll, create };
