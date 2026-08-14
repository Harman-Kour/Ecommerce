require('dotenv').config();
const express = require('express');
const container = require('./config/container');
const { errorHandler } = require('./infrastructure/web/middleware/errorHandler');
const { runMigrations } = require('./infrastructure/database/migrations');

// Routes
const userRoutes = require('./infrastructure/web/routes/userRoutes');
const productRoutes = require('./infrastructure/web/routes/productRoutes');
const orderRoutes = require('./infrastructure/web/routes/orderRoutes');
const cartRoutes = require('./infrastructure/web/routes/cartRoutes');

const app = express();
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/users', userRoutes(container.get('userController')));
app.use('/api/products', productRoutes(container.get('productController')));
app.use('/api/orders', orderRoutes(container.get('orderController')));
app.use('/api/cart', cartRoutes(container.get('cartController')));

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

async function start() {
  await runMigrations();
  app.listen(PORT, () => {
    console.log(`🚀 E-Commerce API running on port ${PORT}`);
    console.log(`📚 Endpoints:`);
    console.log(`   POST   /api/users`);
    console.log(`   GET    /api/users/:id`);
    console.log(`   POST   /api/products`);
    console.log(`   GET    /api/products`);
    console.log(`   PUT    /api/products/:id`);
    console.log(`   DELETE /api/products/:id`);
    console.log(`   POST   /api/orders`);
    console.log(`   GET    /api/orders`);
    console.log(`   POST   /api/cart/add`);
    console.log(`   GET    /api/cart/:userId`);
  });
}

start().catch(console.error);

module.exports = app;