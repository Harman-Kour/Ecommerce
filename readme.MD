# 🛒 E-Commerce Platform

> A production-ready **E-Commerce REST API** built with **Node.js**, **Express**, and **SQLite**, following **Clean Architecture** and **Single Responsibility Principle (SRP)**.

---

## 📋 Table of Contents

- [Architecture Overview](#-architecture-overview)
- [Project Structure](#-project-structure)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Architecture Layers](#-architecture-layers)
- [Design Principles](#-design-principles)
- [Testing](#-testing)
- [Extending the Project](#-extending-the-project)

---

## 🏗️ Architecture Overview

This project follows **Clean Architecture** (a.k.a. Onion Architecture / Hexagonal Architecture) with strict layer separation. The core business logic is completely independent of frameworks, databases, and UI.

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                        │
│         Routes → Controllers → Middleware → Validators      │
├─────────────────────────────────────────────────────────────┤
│                   APPLICATION LAYER                          │
│              Use Cases (Interactors) → DTOs → Ports         │
├─────────────────────────────────────────────────────────────┤
│                     DOMAIN LAYER                             │
│              Entities → Domain Services → Repository Ports    │
├─────────────────────────────────────────────────────────────┤
│                  INFRASTRUCTURE LAYER                        │
│    SQL Repositories → SQLite DB → Bcrypt → Express Server   │
└─────────────────────────────────────────────────────────────┘
```

**Dependency Rule:** Dependencies always point **inward**. The Domain layer knows nothing about Express, SQLite, or bcrypt.

---

## 📁 Project Structure

```
ecommerce-clean/
├── src/
│   ├── domain/                          # 💎 Core Business Logic (Framework-free)
│   │   ├── entities/
│   │   │   ├── User.js                  # User entity with role logic
│   │   │   ├── Product.js               # Product with stock management
│   │   │   ├── Order.js                 # Order with items & status workflow
│   │   │   └── Cart.js                  # Shopping cart with items
│   │   ├── repositories/
│   │   │   ├── IUserRepository.js       # Repository contract (Port)
│   │   │   ├── IProductRepository.js
│   │   │   ├── IOrderRepository.js
│   │   │   └── ICartRepository.js
│   │   └── services/
│   │       └── OrderCalculator.js       # Pure business logic service
│   │
│   ├── application/                     # 🎯 Use Cases & Application Logic
│   │   ├── dto/
│   │   │   ├── CreateUserDTO.js         # Data Transfer Objects
│   │   │   ├── CreateProductDTO.js
│   │   │   ├── CreateOrderDTO.js
│   │   │   └── AddToCartDTO.js
│   │   ├── usecases/
│   │   │   ├── user/
│   │   │   │   ├── RegisterUserUseCase.js
│   │   │   │   ├── GetUserUseCase.js
│   │   │   │   └── ListUsersUseCase.js
│   │   │   ├── product/
│   │   │   │   ├── CreateProductUseCase.js
│   │   │   │   ├── GetProductUseCase.js
│   │   │   │   ├── ListProductsUseCase.js
│   │   │   │   ├── UpdateProductUseCase.js
│   │   │   │   └── DeleteProductUseCase.js
│   │   │   ├── order/
│   │   │   │   ├── CreateOrderUseCase.js
│   │   │   │   ├── GetOrderUseCase.js
│   │   │   │   └── ListOrdersUseCase.js
│   │   │   └── cart/
│   │   │       ├── AddToCartUseCase.js
│   │   │       ├── GetCartUseCase.js
│   │   │       └── ClearCartUseCase.js
│   │   └── ports/
│   │       └── IPasswordHasher.js       # External service contract
│   │
│   ├── infrastructure/                  # 🔌 Frameworks & External Tools
│   │   ├── database/
│   │   │   ├── connection.js            # SQLite connection singleton
│   │   │   ├── schema.sql               # Database schema
│   │   │   └── migrations.js            # Migration runner
│   │   ├── repositories/
│   │   │   ├── SqlUserRepository.js     # SQL implementation of IUserRepository
│   │   │   ├── SqlProductRepository.js
│   │   │   ├── SqlOrderRepository.js
│   │   │   └── SqlCartRepository.js
│   │   ├── web/
│   │   │   ├── routes/
│   │   │   │   ├── userRoutes.js
│   │   │   │   ├── productRoutes.js
│   │   │   │   ├── orderRoutes.js
│   │   │   │   └── cartRoutes.js
│   │   │   ├── controllers/
│   │   │   │   ├── UserController.js
│   │   │   │   ├── ProductController.js
│   │   │   │   ├── OrderController.js
│   │   │   │   └── CartController.js
│   │   │   ├── middleware/
│   │   │   │   ├── errorHandler.js
│   │   │   │   ├── requestValidator.js
│   │   │   │   └── authMiddleware.js
│   │   │   └── validators/
│   │   │       ├── userValidator.js
│   │   │       ├── productValidator.js
│   │   │       └── orderValidator.js
│   │   └── services/
│   │       └── BcryptPasswordHasher.js  # IPasswordHasher implementation
│   │
│   └── config/
│       └── container.js                 # 🏭 Dependency Injection Container
│
├── src/app.js                           # 🚀 Application Entry Point
├── package.json
├── .env
└── README.md                            # 📖 You are here!
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Runtime** | Node.js | JavaScript runtime |
| **Web Framework** | Express.js | HTTP server & routing |
| **Database** | SQLite | Lightweight SQL database |
| **ORM/DB Driver** | `sqlite` + `sqlite3` | SQLite async wrapper |
| **Password Hashing** | bcrypt | Secure password storage |
| **Environment** | dotenv | Configuration management |
| **Dev Tools** | nodemon, jest | Development & testing |

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>= 18.x`
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/ecommerce-clean.git
cd ecommerce-clean

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Start the server
npm start

# Or with auto-reload for development
npm run dev
```

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
NODE_ENV=development
```

### Verify Installation

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-08-15T00:00:00.000Z"
}
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:3000/api
```

---

### 👤 Users

#### Register a new user
```http
POST /api/users
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe",
    "role": "customer",
    "createdAt": "2026-08-15T00:00:00.000Z"
  }
}
```

#### Get user by ID
```http
GET /api/users/1
```

#### List all users
```http
GET /api/users
```

---

### 📦 Products

#### Create a product
```http
POST /api/products
Content-Type: application/json

{
  "name": "MacBook Pro M3",
  "description": "14-inch Apple Silicon laptop",
  "price": 1999.99,
  "stock": 50,
  "category": "Electronics"
}
```

#### Get product by ID
```http
GET /api/products/1
```

#### List all products (with optional filters)
```http
GET /api/products
GET /api/products?category=Electronics
GET /api/products?minPrice=100&maxPrice=500
```

#### Update a product
```http
PUT /api/products/1
Content-Type: application/json

{
  "price": 1799.99,
  "stock": 45
}
```

#### Delete a product
```http
DELETE /api/products/1
```

---

### 🛒 Cart

#### Add item to cart
```http
POST /api/cart/add
Content-Type: application/json

{
  "userId": 1,
  "productId": 1,
  "quantity": 2
}
```

#### Get user cart
```http
GET /api/cart/1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "productId": 1,
        "quantity": 2,
        "product": {
          "id": 1,
          "name": "MacBook Pro M3",
          "price": 1999.99
        }
      }
    ],
    "total": 3999.98
  }
}
```

#### Clear cart
```http
DELETE /api/cart/1
```

---

### 📋 Orders

#### Create an order
```http
POST /api/orders
Content-Type: application/json

{
  "userId": 1,
  "items": [
    { "productId": 1, "quantity": 1 },
    { "productId": 2, "quantity": 3 }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 1,
    "status": "pending",
    "totalAmount": 2599.97,
    "items": [
      { "productId": 1, "quantity": 1, "unitPrice": 1999.99 },
      { "productId": 2, "quantity": 3, "unitPrice": 199.99 }
    ],
    "createdAt": "2026-08-15T00:00:00.000Z"
  }
}
```

> **Note:** Creating an order automatically validates stock, decreases product inventory, and clears the user's cart.

#### Get order by ID
```http
GET /api/orders/1
```

#### List orders
```http
GET /api/orders              # All orders
GET /api/orders?userId=1     # Orders for specific user
```

---

## 🗄️ Database Schema

### Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    users    │       │   orders    │       │  products   │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │◄──────┤ id (PK)     │       │ id (PK)     │
│ email (UQ)  │       │ user_id(FK) │       │ name        │
│ password_hash│      │ status      │       │ price       │
│ name        │       │ total_amount│       │ stock       │
│ role        │       │ created_at  │       │ category    │
│ created_at  │       └──────┬──────┘       └─────────────┘
└─────────────┘              │
                             │
                      ┌──────┴──────┐
                      │ order_items │
                      ├─────────────┤
                      │ id (PK)     │
                      │ order_id(FK)│
                      │ product_id  │
                      │ quantity    │
                      │ unit_price  │
                      └─────────────┘

┌─────────────┐       ┌─────────────┐
│    carts    │       │ cart_items  │
├─────────────┤       ├─────────────┤
│ id (PK)     │◄──────┤ id (PK)     │
│ user_id(FK) │       │ cart_id(FK) │
└─────────────┘       │ product_id  │
                      │ quantity    │
                      └─────────────┘
```

### SQL Schema

```sql
-- Users Table
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'customer',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL CHECK(price >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK(stock >= 0),
  category TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  total_amount REAL NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order Items Table
CREATE TABLE order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price REAL NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Carts Table
CREATE TABLE carts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Cart Items Table
CREATE TABLE cart_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cart_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (cart_id) REFERENCES carts(id),
  FOREIGN KEY (product_id) REFERENCES products(id),
  UNIQUE(cart_id, product_id)
);
```

---

## 🏛️ Architecture Layers

### 1. Domain Layer (`src/domain/`)

The **heart** of the application. Contains pure business logic with **zero external dependencies**.

| Component | Responsibility |
|-----------|--------------|
| **Entities** | Business objects with behavior (`User`, `Product`, `Order`, `Cart`) |
| **Repository Interfaces** | Contracts that define *what* data operations are needed, not *how* |
| **Domain Services** | Complex business logic that doesn't belong to a single entity (`OrderCalculator`) |

**Key Rule:** No `require('express')`, no `require('sqlite')`, no `require('bcrypt')` in this layer.

```javascript
// Example: Product entity enforces business rules internally
class Product {
  decreaseStock(quantity) {
    if (!this.isInStock(quantity)) {
      throw new Error('Insufficient stock');  // Business rule enforced here
    }
    this.stock -= quantity;
  }
}
```

---

### 2. Application Layer (`src/application/`)

Orchestrates use cases. Knows *what* to do but not *how* to do it at the infrastructure level.

| Component | Responsibility |
|-----------|--------------|
| **Use Cases** | Single business operation (e.g., `CreateOrderUseCase`) |
| **DTOs** | Data structures for crossing layer boundaries |
| **Ports** | Interfaces for external services (e.g., `IPasswordHasher`) |

**Key Rule:** Use cases depend on repository *interfaces*, not implementations.

```javascript
// Example: CreateOrderUseCase coordinates multiple repositories
class CreateOrderUseCase {
  constructor(orderRepo, productRepo, cartRepo) {
    this.orderRepository = orderRepo;
    this.productRepository = productRepo;
    this.cartRepository = cartRepo;
  }

  async execute(dto) {
    // 1. Validate stock via domain service
    // 2. Create order entity
    // 3. Update product stock
    // 4. Save order
    // 5. Clear cart
  }
}
```

---

### 3. Infrastructure Layer (`src/infrastructure/`)

Contains all framework-specific code and external dependencies.

| Component | Responsibility |
|-----------|--------------|
| **SQL Repositories** | Implement repository interfaces using SQLite |
| **Web (Express)** | HTTP routing, controllers, middleware |
| **External Services** | `BcryptPasswordHasher`, email services, payment gateways |
| **Database** | Connection management, migrations, schema |

**Key Rule:** This layer can be completely swapped without touching Domain or Application layers.

```javascript
// Example: Swapping SQLite for PostgreSQL only requires a new repository class
class PostgresUserRepository extends IUserRepository {
  // Same interface, different implementation
}
```

---

### 4. Config Layer (`src/config/`)

**Dependency Injection Container** wires everything together.

```javascript
// container.js - The only place where concrete implementations are instantiated
const userRepo = new SqlUserRepository();
const passwordHasher = new BcryptPasswordHasher();
const registerUser = new RegisterUserUseCase(userRepo, passwordHasher);
const userController = new UserController(registerUser, ...);
```

---

## 🎯 Design Principles

### Single Responsibility Principle (SRP)

Every class has **one reason to change**:

| Class | Single Responsibility |
|-------|----------------------|
| `UserController` | Handle HTTP requests/responses |
| `RegisterUserUseCase` | Orchestrate user registration logic |
| `SqlUserRepository` | Persist users to SQLite |
| `BcryptPasswordHasher` | Hash passwords using bcrypt |
| `User` (entity) | Enforce user business rules |

### Dependency Inversion Principle (DIP)

High-level modules (Use Cases) depend on **abstractions** (interfaces), not low-level modules (SQL repositories).

```javascript
// ✅ Good: Depends on interface
class RegisterUserUseCase {
  constructor(userRepository, passwordHasher) { ... }
}

// ❌ Bad: Depends on concrete implementation
class RegisterUserUseCase {
  constructor() {
    this.db = new sqlite3.Database('...');  // Tight coupling!
  }
}
```

### Separation of Concerns

| Concern | Location |
|---------|----------|
| Business rules | `domain/entities/` |
| Data validation | `web/middleware/requestValidator.js` |
| HTTP status codes | `web/controllers/` |
| SQL queries | `infrastructure/repositories/` |
| Password security | `infrastructure/services/BcryptPasswordHasher.js` |

---

## 🧪 Testing

### Unit Testing Use Cases (with Mocks)

```javascript
// test/RegisterUserUseCase.test.js
const RegisterUserUseCase = require('../src/application/usecases/user/RegisterUserUseCase');

// Mock repository
const mockUserRepo = {
  findByEmail: jest.fn(),
  create: jest.fn()
};

// Mock password hasher
const mockHasher = {
  hash: jest.fn(() => 'hashed_password')
};

test('should register a new user', async () => {
  mockUserRepo.findByEmail.mockResolvedValue(null);
  mockUserRepo.create.mockResolvedValue({ id: 1, email: 'test@example.com' });

  const useCase = new RegisterUserUseCase(mockUserRepo, mockHasher);
  const result = await useCase.execute({
    email: 'test@example.com',
    password: 'password123',
    name: 'Test User'
  });

  expect(result.email).toBe('test@example.com');
  expect(mockHasher.hash).toHaveBeenCalledWith('password123');
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

---

## 🔧 Extending the Project

### Adding a New Feature: Reviews

1. **Domain:** Create `src/domain/entities/Review.js`
2. **Domain:** Create `src/domain/repositories/IReviewRepository.js`
3. **Application:** Create `src/application/usecases/review/CreateReviewUseCase.js`
4. **Infrastructure:** Create `src/infrastructure/repositories/SqlReviewRepository.js`
5. **Web:** Create `src/infrastructure/web/controllers/ReviewController.js`
6. **Web:** Create `src/infrastructure/web/routes/reviewRoutes.js`
7. **Config:** Wire in `src/config/container.js`
8. **Database:** Add review table to `schema.sql`

### Swapping SQLite for PostgreSQL

1. Install `pg`: `npm install pg`
2. Create `src/infrastructure/repositories/PostgresUserRepository.js`
3. Update `src/config/container.js` to use the new repository
4. **Zero changes** to Domain or Application layers!

### Adding Authentication (JWT)

1. Create `src/application/ports/ITokenService.js`
2. Create `src/infrastructure/services/JwtTokenService.js`
3. Add `LoginUserUseCase` in `src/application/usecases/user/`
4. Update `authMiddleware.js` to verify JWT tokens

---

## 🐛 Error Handling

The application uses a centralized error handler:

```javascript
// All errors bubble up to the errorHandler middleware
app.use(errorHandler);
```

| Error Type | HTTP Status | Example |
|------------|-------------|---------|
| Validation Error | `400` | Missing required field |
| Not Found | `404` | User/Product not found |
| Conflict | `409` | Email already exists |
| Business Rule | `400` | Insufficient stock |
| Server Error | `500` | Database connection lost |

---

## 📜 License

MIT License — feel free to use this project for learning or production.

---

## 🙏 Acknowledgments

- **Robert C. Martin (Uncle Bob)** — Clean Architecture
- **SOLID Principles** — SRP, DIP, ISP
- **Hexagonal Architecture** — Ports & Adapters pattern

---

> **Built with ❤️ for clean code and maintainable software.**