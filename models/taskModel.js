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

module.exports = mongoose.model('Task', taskSchema);
