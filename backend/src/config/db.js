const mongoose = require('mongoose');
const { mongoUri, nodeEnv } = require('./env');

let isConnected = false;

async function connectDB() {
  if (!mongoUri || mongoUri.trim() === '') {
    // eslint-disable-next-line no-console
    console.warn('⚠️  MONGODB_URI not set. Skipping DB connection.');
    return;
  }

  if (isConnected) {
    return;
  }

  try {
    // eslint-disable-next-line no-console
    console.log('🔄 Connecting to MongoDB...');
    
    await mongoose.connect(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });
    
    isConnected = true;
    
    // eslint-disable-next-line no-console
    console.log(`✅ MongoDB connected successfully (${nodeEnv})`);
    // eslint-disable-next-line no-console
    console.log(`📊 Database: ${mongoose.connection.db?.databaseName || 'traveloop'}`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('⚠️  MongoDB connection warning:', err.message);
    // eslint-disable-next-line no-console
    console.warn('💡 Server will continue without database. Some features may not work.');
    isConnected = false;
  }
}

// Get connection status
function getConnectionStatus() {
  return {
    isConnected: mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host,
    database: isConnected ? (mongoose.connection.db?.databaseName || 'traveloop') : 'Not connected',
  };
}

module.exports = { connectDB, getConnectionStatus };

