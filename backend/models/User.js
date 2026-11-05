const mongoose = require('mongoose');
const memoryStore = require('../config/memoryStore');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const MongooseUser = mongoose.models.User || mongoose.model('User', userSchema);

const UserProxy = new Proxy(MongooseUser, {
  get(target, prop) {
    if (mongoose.connection.readyState === 1) {
      return target[prop];
    }
    return memoryStore.User[prop] || target[prop];
  },
});

module.exports = UserProxy;
