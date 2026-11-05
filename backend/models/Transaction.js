const mongoose = require('mongoose');
const memoryStore = require('../config/memoryStore');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: [true, 'Please provide a transaction title'],
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, 'Please provide an amount'],
    min: [0.01, 'Amount must be greater than 0'],
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: [true, 'Type must be income or expense'],
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    trim: true,
  },
  paymentMethod: {
    type: String,
    default: 'Card',
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
});

const MongooseTransaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);

const TransactionProxy = new Proxy(MongooseTransaction, {
  get(target, prop) {
    if (mongoose.connection.readyState === 1) {
      return target[prop];
    }
    return memoryStore.Transaction[prop] || target[prop];
  },
});

module.exports = TransactionProxy;
