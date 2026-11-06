const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');
const { seedDemoUserAndData } = require('./utils/seedData');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const startTime = Date.now();

// Bulletproof CORS Configuration for Cloud Deployments (Render, Vercel, Netlify, Local)
app.use(cors({
  origin: (origin, callback) => {
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
}));

// Enable pre-flight across-the-board
app.options('*', cors());

// Body parser
app.use(express.json());

// API Health Check & System Status Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    project: 'FinSight – Personal Finance Management & Analytics System',
    team: 'QUANTORA',
    version: '1.0.0',
    port: PORT,
    uptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
    timestamp: new Date().toISOString(),
  });
});

// Mount All Backend REST API Routes strictly as specified in blueprint
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/budgets', require('./routes/budgetRoutes'));
app.use('/api/goals', require('./routes/goalRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));

// Serve Frontend Static UI (Landing page, Dashboard, Reports, Analytics, etc.)
const frontendDistPath = path.resolve(__dirname, '../frontend/dist');

if (fs.existsSync(frontendDistPath)) {
  console.log(`[FinSight] Serving full production frontend UI from: ${frontendDistPath}`);
  app.use(express.static(frontendDistPath));

  // SPA fallback for all frontend routes (e.g. /dashboard, /transactions, /budgets)
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
} else {
  // Fallback if frontend is not built
  app.get('/', (req, res) => {
    res.json({
      status: 'online',
      project: 'FinSight – Personal Finance Management & Analytics System',
      team: 'QUANTORA',
      message: 'FinSight REST API is running. Build frontend with npm run build to serve UI.',
      endpoints: {
        health: '/api/health',
        auth: '/api/auth/login',
        transactions: '/api/transactions',
        budgets: '/api/budgets',
        goals: '/api/goals',
        analytics: '/api/analytics/summary',
      },
    });
  });
}

// 404 handler for unmatched API routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found on FinSight server.`,
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('[FinSight Server Error]', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start listening immediately on 0.0.0.0 so cloud port detection succeeds instantly
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(`🚀 FinSight REST API Server running on port ${PORT}`);
  console.log(`👤 Team: QUANTORA`);
  console.log(`📍 Endpoint: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});

// Initialize database connection and demo seeds asynchronously
(async () => {
  // 1. Seed demo data into in-memory store immediately so server is 100% ready instantly
  try {
    await seedDemoUserAndData();
  } catch (err) {
    console.error('[Seed Error]', err.message);
  }

  // 2. Connect to MongoDB Atlas in background
  try {
    const conn = await connectDB();
    if (conn) {
      // Seed into MongoDB Atlas once connected
      await seedDemoUserAndData();
    }
  } catch (err) {
    console.error('[MongoDB Init Warning]', err.message);
  }
})();

module.exports = app;
