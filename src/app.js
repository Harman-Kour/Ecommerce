require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const container = require('./config/container');
const { errorHandler } = require('./infrastructure/web/middleware/errorHandler');
const authMiddleware = require('./infrastructure/web/middleware/authMiddleware');
const { runMigrations } = require('./infrastructure/database/migrations');
const logger = require('./infrastructure/logger');

// Routes
const userRoutes = require('./infrastructure/web/routes/userRoutes');
const productRoutes = require('./infrastructure/web/routes/productRoutes');
const orderRoutes = require('./infrastructure/web/routes/orderRoutes');
const cartRoutes = require('./infrastructure/web/routes/cartRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ===== SECURITY MIDDLEWARE =====
// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Security headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT_MAX || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => req.path === '/health' // Don't rate limit health checks
});
app.use(limiter);

// Compression
app.use(compression());

// Body parsing with size limit
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ limit: '10kb', extended: false }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
  next();
});

// Static files
app.use(express.static(path.join(__dirname, '..', 'public')));

// ===== API ROUTES (v1) =====

// Health check (no auth required)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: NODE_ENV
  });
});

// Auth middleware for API routes
app.use('/api/', authMiddleware);

// API v1 routes
app.use('/api/v1/users', userRoutes(container.get('userController')));
app.use('/api/v1/products', productRoutes(container.get('productController')));
app.use('/api/v1/orders', orderRoutes(container.get('orderController')));
app.use('/api/v1/cart', cartRoutes(container.get('cartController')));

// Legacy routes (without v1 prefix for backward compatibility)
app.use('/api/users', userRoutes(container.get('userController')));
app.use('/api/products', productRoutes(container.get('productController')));
app.use('/api/orders', orderRoutes(container.get('orderController')));
app.use('/api/cart', cartRoutes(container.get('cartController')));

// ===== ERROR HANDLING =====

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

// ===== SERVER STARTUP =====

let server;

async function start() {
  try {
    await runMigrations();
    logger.info('✅ Database migrations completed');

    server = app.listen(PORT, () => {
      logger.info(`E-Commerce API running on port ${PORT}`);
      logger.info(`Environment: ${NODE_ENV}`);
      logger.info('API Endpoints:');
      logger.info('  POST   /api/users (or /api/v1/users)');
      logger.info('  GET    /api/users/:id');
      logger.info('  POST   /api/products (or /api/v1/products)');
      logger.info('  GET    /api/products');
      logger.info('  PUT    /api/products/:id');
      logger.info('  DELETE /api/products/:id');
      logger.info('  POST   /api/orders (or /api/v1/orders)');
      logger.info('  GET    /api/orders');
      logger.info('  POST   /api/cart/add');
      logger.info('  GET    /api/cart/:userId');
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// ===== GRACEFUL SHUTDOWN =====

const gracefulShutdown = async () => {
  logger.info('Shutting down gracefully...');
  
  if (server) {
    server.close(async () => {
      logger.info('Server closed');
      const { getConnection } = require('./infrastructure/database/connection');
      try {
        const db = await getConnection();
        await db.close();
        logger.info('Database connection closed');
      } catch (error) {
        logger.error('Error closing database:', error);
      }
      process.exit(0);
    });
    
    // Force shutdown after 10 seconds
    setTimeout(() => {
      logger.error('Forced shutdown');
      process.exit(1);
    }, 10000);
  }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Uncaught exception handler
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

start();

module.exports = app;
