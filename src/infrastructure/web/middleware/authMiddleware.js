const { AppError } = require('./errorHandler');
const logger = require('../../logger');

/**
 * Simple token-based auth middleware
 * For development: uses a static token from .env
 * For production: should use proper JWT with secret key
 */
const authMiddleware = (req, res, next) => {
  // Health check endpoint is always allowed
  if (req.path === '/health') {
    return next();
  }

  // Get token from header
  const token = req.headers.authorization?.split(' ')[1];

  if (!token && process.env.NODE_ENV === 'production') {
    logger.warn(`Unauthorized request to ${req.method} ${req.path}`);
    return next(new AppError('Unauthorized: Missing token', 401));
  }

  // In development, allow requests without token for testing
  if (process.env.NODE_ENV === 'development') {
    logger.debug(`Dev mode: allowing request without token to ${req.method} ${req.path}`);
    return next();
  }

  // In production, validate token
  const validToken = process.env.API_TOKEN || 'default-token';
  if (token !== validToken) {
    logger.warn(`Invalid token provided for ${req.method} ${req.path}`);
    return next(new AppError('Unauthorized: Invalid token', 401));
  }

  logger.debug(`Auth successful for ${req.method} ${req.path}`);
  next();
};

module.exports = authMiddleware;
