const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const aiRoutes = require('./routes/aiRoutes')
const app = express();
const userRoutes = require('./routes/userRoutes');

// Basic middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/api/ai', aiRoutes)
app.use(morgan('dev'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbConnected = mongoose.connection.readyState === 1;
  let dbName = 'Not connected';
  
  try {
    if (dbConnected && mongoose.connection.db) {
      dbName = mongoose.connection.db._db ? mongoose.connection.db._db.s.name : 'traveloop';
    }
  } catch (err) {
    dbName = 'Connected (name unavailable)';
  }
  
  res.json({
    status: 'ok',
    timestamp: Date.now(),
    uptime: process.uptime(),
    database: {
      connected: dbConnected,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host || 'Not connected',
      database: dbName,
    },
    environment: process.env.NODE_ENV || 'development',
  });
});

// Mount routes placeholder

const router = require('./routes');
app.use('/api', router);
app.use('/api/users', userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Not Found' });
});

// Global error handler
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

module.exports = app;
