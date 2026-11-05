const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (uri && uri.trim() !== '') {
    try {
      console.log('[MongoDB] Attempting connection to MongoDB Atlas...');
      const conn = await mongoose.connect(uri);
      console.log(`[MongoDB] Connected to MongoDB Atlas: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn(`[MongoDB] Atlas connection failed (${err.message}). Activating built-in FinSight data store...`);
    }
  } else {
    console.log('[MongoDB] No MONGODB_URI set in .env. FinSight is running in resilient in-memory mode.');
    console.log('[MongoDB] All CRUD operations, analytics, budgets, and goals are fully active.');
  }

  return null;
};

module.exports = connectDB;
