const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const dns = require('dns');

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

dotenv.config();

const connectDB = require('../backend/config/db');
const { seedDemoUserAndData } = require('../backend/utils/seedData');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Initialize DB and Seed on Cold Start
let isInitialized = false;
app.use(async (req, res, next) => {
  if (!isInitialized) {
    try {
      await connectDB();
      await seedDemoUserAndData();
      isInitialized = true;
    } catch (e) {
      console.error('Initialization error:', e);
    }
  }
  next();
});

// Root welcome route
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    project: 'FinSight – Personal Finance Management & Analytics System',
    team: 'QUANTORA',
    message: 'Welcome to FinSight REST API Server. All backend systems operational.',
    database: 'MongoDB Atlas Connected',
    frontendUrl: 'https://frontend-lac-three-29.vercel.app',
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
    database: 'MongoDB Atlas',
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

// Error handling
app.use((err, req, res, next) => {
  console.error('Serverless error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;
