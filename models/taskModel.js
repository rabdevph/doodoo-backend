const mongoose = require('mongoose');

const taskSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: 'User',
    },
    description: {
      type: String,
      required: true,
    },
    priorityLevel: {
      type: String,
      required: true,
    },
    progress: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

taskSchema.statics.getAll = async function (res, userId) {
  const task = await this.find({ userId }).sort({ createdAt: -1 });

  if (!task) {
    res.status(404);
    throw new Error('Tasks not found.');
  }

  return task;
};

taskSchema.statics.createNew = async function (res, userId, description, priorityLevel) {
  const errorFields = [];

  if (!description) {
    errorFields.push('description');
    res.status(400);
    const error = new Error('Please fill task description.');
    error.errorFields = errorFields;
    throw error;
  }

  const newTask = await this.create({
    userId,
    description,
    priorityLevel,
    progress: 'pending',
  });

  return newTask;
};

taskSchema.statics.updateTask = async function (res, taskId, fields) {
  const updatedTask = await this.findOneAndUpdate({ _id: taskId }, { ...fields }, { new: true });

  if (!updatedTask) {
    res.status(404);
    throw new Error('Task not found.');
  }

  return updatedTask;
};

taskSchema.statics.deleteTask = async function (res, taskId) {
  const deletedTask = await this.findOneAndDelete({ _id: taskId });

  if (!deletedTask) {
    res.status(404);
    throw new Error('Task not found.');
  }

  return deletedTask;
};

module.exports = mongoose.model('Task', taskSchema);
