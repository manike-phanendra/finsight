const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('../backend/config/db');
const { seedDemoUserAndData } = require('../backend/utils/seedData');

const app = express();

// Enable bulletproof CORS for all client origins
app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
}));
app.options('*', cors());

app.use(express.json());

// Initialize DB and Seed once per cold start
let initPromise = null;
const ensureInit = () => {
  if (!initPromise) {
    initPromise = (async () => {
      try {
        await seedDemoUserAndData();
      } catch (e) {
        console.error('[Serverless Seed Notice]', e.message);
      }
      try {
        const conn = await connectDB();
        if (conn) {
          await seedDemoUserAndData();
        }
      } catch (e) {
        console.error('[Serverless Atlas Init Notice]', e.message);
      }
    })();
  }
  return initPromise;
};

app.use(async (req, res, next) => {
  try {
    await ensureInit();
  } catch (e) {}
  next();
});

// Root welcome route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    project: 'FinSight – Personal Finance Management & Analytics System',
    team: 'QUANTORA',
    message: 'Welcome to FinSight REST API Server (Serverless / Cloud). All systems operational.',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth/login',
      transactions: '/api/transactions',
      budgets: '/api/budgets',
      goals: '/api/goals',
      analytics: '/api/analytics/summary',
    },
    timestamp: new Date().toISOString(),
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    project: 'FinSight – Personal Finance Management & Analytics System',
    team: 'QUANTORA',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', require('../backend/routes/authRoutes'));
app.use('/api/transactions', require('../backend/routes/transactionRoutes'));
app.use('/api/budgets', require('../backend/routes/budgetRoutes'));
app.use('/api/goals', require('../backend/routes/goalRoutes'));
app.use('/api/analytics', require('../backend/routes/analyticsRoutes'));
app.use('/api/categories', require('../backend/routes/categoryRoutes'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found.`,
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('[Serverless Error]', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;
