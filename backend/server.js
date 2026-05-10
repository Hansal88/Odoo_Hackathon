require('dotenv').config();
const http = require('http');
const app = require('./src/app');
const { connectDB } = require('./src/config/db');

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    // Connect to database
    await connectDB();

    const server = http.createServer(app);

    server.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`\n🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      // eslint-disable-next-line no-console
      console.log(`📍 Backend URL: http://localhost:${PORT}`);
      // eslint-disable-next-line no-console
      console.log(`🔗 API Health: http://localhost:${PORT}/api/health\n`);
    });

    // Graceful shutdown
    function shutdown(signal) {
      // eslint-disable-next-line no-console
      console.log(`\n⚠️  Received ${signal}. Shutting down server...`);
      server.close(() => {
        // eslint-disable-next-line no-console
        console.log('✅ Server closed.');
        process.exit(0);
      });
    }

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    process.on('uncaughtException', (err) => {
      // eslint-disable-next-line no-console
      console.error('❌ Uncaught Exception:', err);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason) => {
      // eslint-disable-next-line no-console
      console.error('❌ Unhandled Rejection:', reason);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
})();
