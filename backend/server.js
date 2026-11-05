const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { seedDemoUserAndData } = require('./utils/seedData');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parser
app.use(express.json());

// Root Welcome Route for Render & Cloud Health
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

// API Health Check & System Status
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    project: 'FinSight – Personal Finance Management & Analytics System',
    team: 'QUANTORA',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes strictly as specified in blueprint
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/budgets', require('./routes/budgetRoutes'));
app.use('/api/goals', require('./routes/goalRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));

// 404 handler for unmatched routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found.`,
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Connect to Database and start server
const startServer = async () => {
  try {
    await connectDB();
    await seedDemoUserAndData();

    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🚀 FinSight REST API Server running on port ${PORT}`);
      console.log(`👤 Team: QUANTORA`);
      console.log(`📍 Endpoint: http://localhost:${PORT}/api/health`);
      console.log(`=======================================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
