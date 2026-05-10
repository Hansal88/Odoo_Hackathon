function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  // Log full stack for debugging
  // eslint-disable-next-line no-console
  console.error('Global error handler caught:', err && err.stack ? err.stack : err);
  const status = err && err.statusCode ? err.statusCode : 500;
  const message = err && err.message ? err.message : 'Internal Server Error';
  res.status(status).json({ success: false, message });
}

module.exports = errorHandler;
