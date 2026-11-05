const mongoose = require('mongoose');
const memoryStore = require('../config/memoryStore');

const categorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide a category name'],
    trim: true,
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: [true, 'Type must be income or expense'],
  },
});

categorySchema.index({ userId: 1, name: 1, type: 1 }, { unique: true });

const MongooseCategory = mongoose.models.Category || mongoose.model('Category', categorySchema);

const CategoryProxy = new Proxy(MongooseCategory, {
  get(target, prop) {
    if (mongoose.connection.readyState === 1) {
      return target[prop];
    }
    return memoryStore.Category[prop] || target[prop];
  },
});

module.exports = CategoryProxy;
