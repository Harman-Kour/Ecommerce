# SnapDelivery E-Commerce Platform - Complete Setup Guide

**Project Name:** SnapDelivery  
**Store:** Grocery delivery e-commerce platform (like Blinkit)  
**Tech Stack:** Node.js + Express backend | SQLite database | Vanilla HTML/CSS/JavaScript frontend

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Quick Start](#quick-start)
4. [Accessing the Application](#accessing-the-application)
5. [Understanding the Database](#understanding-the-database)
6. [Working with the Database](#working-with-the-database)
7. [API Endpoints](#api-endpoints)
8. [Example Workflows](#example-workflows)
9. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

This is a **production-ready e-commerce platform** with:

| Component | Description |
|-----------|-------------|
| **Backend** | Express.js REST API with security middleware (CORS, rate limiting, authentication) |
| **Database** | SQLite database with migrations and foreign key support |
| **Frontend** | Responsive HTML/CSS/JavaScript UI inspired by Blinkit grocery app |
| **Architecture** | Clean architecture with separation of concerns (entities, use cases, repositories) |

### Key Features
- ✅ User authentication and registration
- ✅ Product catalog with categories
- ✅ Shopping cart functionality
- ✅ Order management
- ✅ Logging and error handling
- ✅ Security headers (Helmet.js)
- ✅ CORS support
- ✅ Rate limiting
- ✅ Input validation

---

## 📦 Prerequisites

### Option A: Local Node.js Setup (Recommended for beginners)
- **Node.js 18+** ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- Any terminal/command prompt

### Option B: Docker Setup (For isolated environment)
- **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop))

### Option C: Verify Your Setup
```bash
# Check Node.js version
node --version

# Check npm version
npm --version
```

---

## 🚀 Quick Start (5 minutes)

### Step 1: Navigate to Project Directory
```bash
cd /path/to/ecommerce
# Or if cloning for first time:
# git clone <repository-url>
# cd ecommerce
```

### Step 2: Install Dependencies
```bash
npm install
```

This installs:
- `express` - Web framework
- `sqlite3` & `sqlite` - Database drivers
- `bcrypt` - Password hashing
- `cors` - Cross-origin requests
- `helmet` - Security headers
- `express-rate-limit` - Rate limiting
- `compression` - Response compression
- `winston` - Logging
- `dotenv` - Environment variables

### Step 3: Create Environment File
```bash
# Copy the example env file
cp .env.example .env

# Or create .env manually with this content:
cat > .env << EOF
PORT=3000
NODE_ENV=development
LOG_LEVEL=info
CORS_ORIGIN=*
API_TOKEN=default-token
RATE_LIMIT_MAX=100
EOF
```

### Step 4: Start the Application
```bash
# Option A: Production mode
npm start

# Option B: Development mode (auto-restarts on changes)
npm run dev
```

You should see output like:
```
info: Connecting to database (attempt 1/3)
info: Database connection established
✅ Database migrations completed
info: E-Commerce API running on port 3000
info: Environment: development
```

### Step 5: Verify It's Running
```bash
# In another terminal, check health
curl http://localhost:3000/health

# Expected response:
# {"status":"ok","timestamp":"2026-08-15T...","environment":"development"}
```

---

## 💻 Accessing the Application

### Frontend (Web UI)
Open your browser and go to:
```
http://localhost:3000
```

You'll see:
- SnapDelivery logo and branding
- Product catalog with categories (Vegetables, Fruits, Dairy, etc.)
- Shopping cart panel
- Customer creation form
- Order history

### Backend API
Base URL: `http://localhost:3000/api`

Health check (no authentication needed):
```bash
curl http://localhost:3000/health
```

---

## 💾 Understanding the Database

### Database File
- **Location:** `ecommerce.db` (created automatically on first run)
- **Type:** SQLite (single file, zero-config)
- **Schema:** Auto-generated from migrations on startup

### Database Structure

#### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

#### Products Table
```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

#### Orders Table
```sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY,
  userId INTEGER NOT NULL,
  totalAmount REAL NOT NULL,
  status TEXT DEFAULT 'pending',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(userId) REFERENCES users(id)
)
```

#### Order Items Table
```sql
CREATE TABLE order_items (
  id INTEGER PRIMARY KEY,
  orderId INTEGER NOT NULL,
  productId INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  price REAL NOT NULL,
  FOREIGN KEY(orderId) REFERENCES orders(id),
  FOREIGN KEY(productId) REFERENCES products(id)
)
```

#### Cart Table
```sql
CREATE TABLE cart (
  id INTEGER PRIMARY KEY,
  userId INTEGER UNIQUE NOT NULL,
  FOREIGN KEY(userId) REFERENCES users(id)
)
```

#### Cart Items Table
```sql
CREATE TABLE cart_items (
  id INTEGER PRIMARY KEY,
  cartId INTEGER NOT NULL,
  productId INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  FOREIGN KEY(cartId) REFERENCES cart(id),
  FOREIGN KEY(productId) REFERENCES products(id)
)
```

---

## 🔧 Working with the Database

### Prerequisites: Install SQLite3 CLI
```bash
# macOS (using Homebrew)
brew install sqlite3

# Ubuntu/Debian
sudo apt-get install sqlite3

# Windows
# Download from: https://www.sqlite.org/download.html
# Or use: choco install sqlite
```

### View Database File

#### 1. List All Tables
```bash
sqlite3 ecommerce.db ".tables"

# Output example:
# cart          cart_items    order_items   orders        products      users
```

#### 2. View Table Structure
```bash
# See all columns in users table
sqlite3 ecommerce.db ".schema users"

# See schema for all tables
sqlite3 ecommerce.db ".schema"
```

#### 3. View All Data in a Table
```bash
# View users table with formatted output
sqlite3 -header -column ecommerce.db "SELECT * FROM users;"

# View products table
sqlite3 -header -column ecommerce.db "SELECT * FROM products;"

# View orders table
sqlite3 -header -column ecommerce.db "SELECT * FROM orders;"

# View cart contents
sqlite3 -header -column ecommerce.db "SELECT * FROM cart_items;"
```

#### 4. View Specific Data with Queries
```bash
# Count total users
sqlite3 ecommerce.db "SELECT COUNT(*) as total_users FROM users;"

# Count total products
sqlite3 ecommerce.db "SELECT COUNT(*) as total_products FROM products;"

# Count total orders
sqlite3 ecommerce.db "SELECT COUNT(*) as total_orders FROM orders;"

# View user details with email
sqlite3 -header -column ecommerce.db "SELECT id, name, email, createdAt FROM users;"

# View products with price and stock
sqlite3 -header -column ecommerce.db "SELECT id, name, category, price, stock FROM products;"

# View orders with user names
sqlite3 -header -column ecommerce.db "
  SELECT o.id, u.name, o.totalAmount, o.status, o.createdAt 
  FROM orders o 
  JOIN users u ON o.userId = u.id
  ORDER BY o.createdAt DESC;"

# View cart items with product details
sqlite3 -header -column ecommerce.db "
  SELECT ci.id, p.name, ci.quantity, (ci.quantity * p.price) as subtotal
  FROM cart_items ci
  JOIN products p ON ci.productId = p.id;"
```

#### 5. Interactive Database Shell
```bash
# Open interactive SQLite shell
sqlite3 ecommerce.db

# Then you can run commands like:
# .tables              - List all tables
# .schema users        - Show users table structure
# SELECT * FROM users; - Query users
# .quit                - Exit
```

#### 6. View Database File Info
```bash
# Check database file size
ls -lh ecommerce.db

# Check total number of records in each table
sqlite3 ecommerce.db "
  SELECT 'users' as table_name, COUNT(*) as row_count FROM users
  UNION ALL
  SELECT 'products', COUNT(*) FROM products
  UNION ALL
  SELECT 'orders', COUNT(*) FROM orders
  UNION ALL
  SELECT 'cart', COUNT(*) FROM cart;"
```

### 🖥️ GUI Tools for Database Viewing (No Command Line Needed)

#### Option 1: VS Code Extension (Easiest for Beginners)
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "SQLite" or "SQLite Viewer"
4. Install "SQLite" by alexcvzz
5. Right-click `ecommerce.db` file → Click "Open Database"
6. Browse tables, view data, run queries

#### Option 2: DB Browser for SQLite (Standalone App)
1. Download: https://sqlitebrowser.org/dl/
2. Install the application
3. File → Open Database → Select `ecommerce.db`
4. Browse tables graphically
5. View structure, data, and relationships

#### Option 3: Online Tools (No Installation)
1. https://sqlitebin.org/
2. Upload `ecommerce.db` file
3. View and query data in browser

#### Option 4: DBeaver (Advanced but Free)
1. Download: https://dbeaver.io/download/
2. Create connection to SQLite
3. Select `ecommerce.db` file
4. Full database management interface

### Reset Database (Start Fresh)
```bash
# Delete the database file
rm ecommerce.db

# Restart the app (it will recreate the DB)
npm start
```

### Backup Database
```bash
# Create a backup
cp ecommerce.db ecommerce.db.backup

# Restore from backup
cp ecommerce.db.backup ecommerce.db
```

### Import Data via API (Using Frontend)
1. Open `http://localhost:3000`
2. **Create a customer:** Fill "Create Customer" form → Submit
3. **Add products:** Fill "Add Product" form → Submit
4. **Add to cart:** Click "ADD" on any product
5. **Checkout:** Click "Checkout" button

---

## 📡 API Endpoints

### Base URL: `http://localhost:3000/api`

### Users (Customer Management)
```bash
# Create a new user
POST /api/users
Content-Type: application/json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}

# Get user by ID
GET /api/users/1

# List all users
GET /api/users
```

### Products (Catalog)
```bash
# Create product
POST /api/products
{
  "name": "Milk",
  "description": "Fresh dairy milk",
  "price": 3.5,
  "stock": 50,
  "category": "dairy"
}

# Get all products
GET /api/products

# Get product by ID
GET /api/products/1

# Update product
PUT /api/products/1
{
  "price": 4.0,
  "stock": 45
}

# Delete product
DELETE /api/products/1
```

### Cart (Shopping Cart)
```bash
# Add item to cart
POST /api/cart/add
{
  "userId": 1,
  "productId": 5,
  "quantity": 2
}

# Get cart for user
GET /api/cart/1

# Clear cart
DELETE /api/cart/1
```

### Orders (Order Management)
```bash
# Create order
POST /api/orders
{
  "userId": 1,
  "items": [
    {"productId": 5, "quantity": 2},
    {"productId": 8, "quantity": 1}
  ]
}

# Get all orders
GET /api/orders

# Get order by ID
GET /api/orders/1
```

### Health Check
```bash
# Check if backend is running
GET /api/health
# Response: {"status":"ok","timestamp":"...","environment":"development"}
```

---

## 🎬 Example Workflows

### Workflow 1: Create User and Browse Products

```bash
# 1. Create a user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Smith",
    "email": "alice@example.com",
    "password": "Password123"
  }'
# Response: {"success":true,"data":{"id":1,"name":"Alice Smith",...}}

# 2. Get all products
curl http://localhost:3000/api/products

# 3. Get specific product
curl http://localhost:3000/api/products/5
```

### Workflow 2: Shopping Flow

```bash
# 1. Add product to cart
curl -X POST http://localhost:3000/api/cart/add \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "productId": 5,
    "quantity": 2
  }'

# 2. View cart
curl http://localhost:3000/api/cart/1

# 3. Checkout (create order)
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "items": [
      {"productId": 5, "quantity": 2},
      {"productId": 8, "quantity": 1}
    ]
  }'

# 4. View orders
curl http://localhost:3000/api/orders
```

### Workflow 3: Manage Products (Admin)

```bash
# 1. Create a product
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Organic Apples",
    "description": "Fresh red apples",
    "price": 5.99,
    "stock": 100,
    "category": "fruits"
  }'

# 2. Update stock
curl -X PUT http://localhost:3000/api/products/10 \
  -H "Content-Type: application/json" \
  -d '{"stock": 80}'

# 3. List all products
curl http://localhost:3000/api/products

# 4. Delete a product
curl -X DELETE http://localhost:3000/api/products/10
```

---

## 🐛 Troubleshooting

### Issue 1: "Port 3000 is already in use"

```bash
# Use a different port
PORT=4000 npm start

# Or find and kill the process using port 3000
# macOS/Linux:
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue 2: "Cannot find module" errors

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Clear cache
npm cache clean --force
npm install
```

### Issue 3: "Database connection failed"

```bash
# Check if database file exists
ls -la ecommerce.db

# Reset database
rm ecommerce.db
npm start  # Will recreate

# Check database integrity
sqlite3 ecommerce.db ".integrity_check"
```

### Issue 4: API returns 400 "Required fields missing"

Check request body format:
```bash
# ❌ Wrong - JSON body missing
curl -X POST http://localhost:3000/api/users

# ✅ Correct - Include Content-Type and JSON body
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"Pass123"}'
```

### Issue 5: Frontend shows "Offline" status

```bash
# Check if backend is running
curl http://localhost:3000/health

# Check console for errors (open browser DevTools → Console)
# Ensure CORS_ORIGIN=* in .env
```

---

## 📁 Project Structure

```
ecommerce/
├── public/              # Frontend files (served as static)
│   ├── index.html       # Main HTML page
│   ├── app.js           # Frontend logic
│   ├── styles.css       # Styling
│   └── assets/          # Images and assets
│
├── src/                 # Backend source code
│   ├── app.js           # Express app setup & server startup
│   ├── config/          # Configuration (DI container)
│   ├── domain/          # Business entities & logic
│   │   ├── entities/    # Data models (User, Product, Order)
│   │   ├── repositories/# Database interfaces
│   │   └── services/    # Business logic (OrderCalculator)
│   ├── application/     # Use cases & DTOs
│   │   ├── usecases/    # Business operations
│   │   └── dto/         # Data transfer objects
│   └── infrastructure/  # Implementation details
│       ├── database/    # SQLite connection & migrations
│       ├── repositories/# Database implementations
│       ├── logger.js    # Logging setup
│       └── web/         # Web layer
│           ├── controllers/    # HTTP handlers
│           ├── routes/         # URL routes
│           ├── middleware/     # Express middleware
│           └── validators/     # Input validation
│
├── ecommerce.db         # SQLite database (auto-created)
├── .env                 # Environment variables (create manually)
├── .env.example         # Environment template
├── package.json         # Dependencies
├── README.md            # Project documentation
└── instruction.md       # This file
```

---

## 🔒 Security Features

This production-ready app includes:

| Feature | Purpose |
|---------|---------|
| **Helmet.js** | Security headers (CSP, X-Frame-Options, HSTS) |
| **CORS** | Cross-origin request control |
| **Rate Limiting** | 100 requests per IP per 15 minutes |
| **Body Size Limit** | 10KB max to prevent attacks |
| **Input Validation** | Type checking and sanitization |
| **Password Hashing** | Bcrypt for secure storage |
| **Graceful Shutdown** | Clean resource cleanup |
| **Error Handling** | Hide stack traces in production |
| **Logging** | Structured logging for debugging |

---

## 📞 Support & Next Steps

### For Development
```bash
npm run dev    # Auto-restart on code changes
```

### For Production Deployment
1. Update `.env`:
   ```env
   NODE_ENV=production
   CORS_ORIGIN=https://yourdomain.com
   API_TOKEN=your-secure-token
   ```

2. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start src/app.js --name "ecommerce"
   pm2 save
   ```

3. Set up reverse proxy (Nginx)
4. Enable HTTPS with SSL certificates
5. Set up monitoring and backups

---

## 📚 Additional Resources

- [Express.js Docs](https://expressjs.com/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [REST API Best Practices](https://restfulapi.net/)

---

**Happy coding! 🚀**
  -p 3001:3000 \
  -v "$PWD:/app" \
  -w /app \
  node:20-alpine \
  npm start
```

Open the frontend:

```text
http://localhost:3001
```

Check backend health:

```bash
curl http://localhost:3001/health
```

View logs:

```bash
docker logs ecommerce-clean-api
```

Stop the app:

```bash
docker stop ecommerce-clean-api
```

Remove the stopped container:

```bash
docker rm ecommerce-clean-api
```

Restart after code changes:

```bash
docker restart ecommerce-clean-api
```

## 6. Main URLs

Frontend:

```text
http://localhost:3000
```

If using Docker with host port `3001`:

```text
http://localhost:3001
```

Health check:

```text
GET /health
```

API base:

```text
/api
```

## 7. API Endpoints

Users:

```text
POST /api/users
GET  /api/users
GET  /api/users/:id
```

Products:

```text
POST   /api/products
GET    /api/products
GET    /api/products/:id
PUT    /api/products/:id
DELETE /api/products/:id
```

Cart:

```text
POST   /api/cart/add
GET    /api/cart/:userId
DELETE /api/cart/:userId
```

Orders:

```text
POST /api/orders
GET  /api/orders
GET  /api/orders/:id
GET  /api/orders?userId=1
```

## 8. Quick End-To-End Test

Create a user:

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"securePassword123","name":"Test User"}'
```

Create a product:

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Milk","description":"Fresh milk","price":25,"stock":10,"category":"Dairy"}'
```

Add product to cart:

```bash
curl -X POST http://localhost:3000/api/cart/add \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"productId":1,"quantity":2}'
```

View cart:

```bash
curl http://localhost:3000/api/cart/1
```

Create order:

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"userId":1,"items":[{"productId":1,"quantity":2}]}'
```

If using Docker on port `3001`, replace `3000` with `3001` in the commands.

## 9. Database

The SQLite database is created automatically when the app starts:

```text
ecommerce.db
```

Migrations run from:

```text
src/infrastructure/database/schema.sql
```

The database tables are:

- `users`
- `products`
- `orders`
- `order_items`
- `carts`
- `cart_items`

## 10. Troubleshooting

If port `3000` is already in use, change `.env`:

```env
PORT=3001
NODE_ENV=development
```

Or use Docker port mapping:

```bash
docker run -d --name ecommerce-clean-api -p 3001:3000 -v "$PWD:/app" -w /app node:20-alpine npm start
```

If `npm test` says no tests found, that means no Jest test files exist yet.

If Docker says the container name already exists:

```bash
docker rm ecommerce-clean-api
```

Then start it again.

## 11. Production Notes

For a live server:

1. Install Node.js 18+ on the server.
2. Clone the repository.
3. Create `.env` with a production port and `NODE_ENV=production`.
4. Run `npm install --omit=dev`.
5. Start with a process manager such as PM2:

```bash
npm install -g pm2
pm2 start src/app.js --name ecommerce-api
pm2 save
```

6. Put Nginx or another reverse proxy in front of the app.
7. Point your domain to the server.
8. Use HTTPS with a certificate provider such as Let's Encrypt.

