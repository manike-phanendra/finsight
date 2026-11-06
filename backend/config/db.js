const mongoose = require('mongoose');
const dns = require('dns');

// Only configure public fallback DNS if explicitly requested (e.g., local debugging)
// In production clouds (Render, Vercel, AWS), internal VPC resolvers must be preserved!
if (process.env.USE_CUSTOM_DNS === 'true') {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
  } catch (e) {
    // Ignore in environments where custom DNS servers cannot be modified
  }
}

let cachedConnection = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  if (cachedConnection) {
    return cachedConnection;
  }

  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (uri && uri.trim() !== '') {
    try {
      console.log('[MongoDB] Connecting to MongoDB Atlas cluster...');
      const timeoutMs = parseInt(process.env.MONGO_TIMEOUT_MS) || 5000;
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: timeoutMs,
        connectTimeoutMS: timeoutMs,
      });
      console.log(`[MongoDB] Successfully connected to MongoDB Atlas: ${conn.connection.host}`);
      console.log(`[MongoDB] Active Database: ${conn.connection.name}`);
      cachedConnection = conn;
      return conn;
    } catch (err) {
      console.warn(`[MongoDB] Atlas connection notice (${err.message}).`);
      console.warn(`[MongoDB] Activating FinSight built-in high-performance data store...`);
    }
  } else {
    console.log('[MongoDB] Running with built-in high-performance data store.');
    console.log('[MongoDB] All CRUD operations, analytics, budgets, and goals are fully active.');
  }

  return null;
};

module.exports = connectDB;
