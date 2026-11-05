const mongoose = require('mongoose');
const memoryStore = require('../config/memoryStore');

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, 'Please provide budget amount'],
    min: [0, 'Amount cannot be negative'],
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
  },
  year: {
    type: Number,
    required: true,
  },
});

budgetSchema.index({ userId: 1, category: 1, month: 1, year: 1 }, { unique: true });

const MongooseBudget = mongoose.models.Budget || mongoose.model('Budget', budgetSchema);

const BudgetProxy = new Proxy(MongooseBudget, {
  get(target, prop) {
    if (mongoose.connection.readyState === 1) {
      return target[prop];
    }
    return memoryStore.Budget[prop] || target[prop];
  },
});

module.exports = BudgetProxy;
