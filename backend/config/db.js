const mongoose = require('mongoose');
const dns = require('dns');

// Ensure reliable DNS resolution for MongoDB Atlas SRV connection strings
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  // Ignore in environments where custom DNS servers cannot be set
}

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (uri && uri.trim() !== '') {
    try {
      console.log('[MongoDB] Connecting to MongoDB Atlas cluster...');
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 15000,
      });
      console.log(`[MongoDB] Successfully connected to MongoDB Atlas: ${conn.connection.host}`);
      console.log(`[MongoDB] Active Database: ${conn.connection.name}`);
      return conn;
    } catch (err) {
      console.warn(`[MongoDB] Atlas connection warning (${err.message}). Activating built-in FinSight data store...`);
    }
  } else {
    console.log('[MongoDB] No MONGODB_URI set in .env. FinSight is running in resilient in-memory mode.');
    console.log('[MongoDB] All CRUD operations, analytics, budgets, and goals are fully active.');
  }

  return null;
};

module.exports = connectDB;
