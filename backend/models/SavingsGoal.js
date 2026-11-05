const mongoose = require('mongoose');
const memoryStore = require('../config/memoryStore');

const savingsGoalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: [true, 'Please provide a goal title'],
    trim: true,
  },
  targetAmount: {
    type: Number,
    required: [true, 'Please provide a target amount'],
    min: [1, 'Target amount must be at least 1'],
  },
  savedAmount: {
    type: Number,
    default: 0,
    min: [0, 'Saved amount cannot be negative'],
  },
  deadline: {
    type: Date,
    required: [true, 'Please provide a deadline date'],
  },
});

const MongooseSavingsGoal = mongoose.models.SavingsGoal || mongoose.model('SavingsGoal', savingsGoalSchema);

const SavingsGoalProxy = new Proxy(MongooseSavingsGoal, {
  get(target, prop) {
    if (mongoose.connection.readyState === 1) {
      return target[prop];
    }
    return memoryStore.SavingsGoal[prop] || target[prop];
  },
});

module.exports = SavingsGoalProxy;
