const logger = require('../../logger');

class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = `${err.statusCode}`.startsWith('4') ? 'fail' : 'error';

  // Log error
  logger.error({
    message: err.message,
    statusCode: err.statusCode,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { error: err })
    });
  }

  // Handle SQL UNIQUE constraint errors
  if (err.message && err.message.includes('UNIQUE constraint failed')) {
    return res.status(409).json({
      success: false,
      status: 'fail',
      message: 'Resource already exists'
    });
  }

  // Handle SQL NOT NULL constraint errors
  if (err.message && err.message.includes('NOT NULL constraint failed')) {
    return res.status(400).json({
      success: false,
      status: 'fail',
      message: 'Required fields missing'
    });
  }

  // Handle database errors
  if (err.code === 'SQLITE_CANTOPEN' || err.message?.includes('database')) {
    return res.status(503).json({
      success: false,
      status: 'error',
      message: 'Database connection error'
    });
  }

  // Programming or unknown error: don't leak details
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
    ...(process.env.NODE_ENV === 'development' && { 
      error: err.message,
      stack: err.stack
    })
  });
};

module.exports = { errorHandler, AppError };