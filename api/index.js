const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('../backend/config/db');
const { seedDemoUserAndData } = require('../backend/utils/seedData');

dotenv.config();

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

// Error handling
app.use((err, req, res, next) => {
  console.error('Serverless error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;
