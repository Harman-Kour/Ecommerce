# SnapDelivery

Snap Delivery is a full-stack grocery storefront using a clean-architecture Node.js backend and a lightweight static frontend served from the `public/` directory.

The app includes:
- a REST API for users, products, cart, and orders
- SQLite persistence
- a browser UI for creating customers, adding products, managing cart items, and checking out
- backend validation and stock checks before creating orders

---

## Project overview

### Frontend
The browser app is served directly from `public/index.html` and uses `public/app.js` to:
- call `/health` to check backend uptime
- load users, products, and order history from the API
- create a customer and select the active user
- add products to the cart
- clear the cart
- create an order and refresh product stock

The storefront UI is a grocery-style landing page featuring a search bar, category chips, product cards, a customer panel, cart summary, and recent orders.

### Backend
The backend is an Express server defined in `src/app.js` and structured with clean architecture layers:
- `src/domain/`: entities and domain rules
- `src/application/`: use cases and DTOs
- `src/infrastructure/`: SQLite repositories, HTTP controllers, routes, middleware, and bcrypt service
- `src/config/container.js`: dependency injection setup

---

## Tech stack

- Node.js 20+
- Express.js
- SQLite with `sqlite` and `sqlite3`
- bcrypt for password hashing
- dotenv for environment configuration
- static HTML/CSS/JS frontend in `public/`

---

## Project structure

```text
.
├── public/
│   ├── app.js
│   ├── index.html
│   └── styles.css
├── src/
│   ├── app.js
│   ├── application/
│   │   ├── dto/
│   │   └── usecases/
│   ├── config/
│   │   └── container.js
│   ├── domain/
│   │   ├── entities/
│   │   ├── repositories/
│   │   └── services/
│   ├── infrastructure/
│   │   ├── database/
│   │   ├── repositories/
│   │   ├── services/
│   │   └── web/
│   └── ...
├── instruction.md
├── package.json
├── readme.MD
└── ecommerce.db
```

---

## Local setup

### Prerequisites

- Node.js 18 or newer
- npm

### Install dependencies

```bash
cd /path/to/ecommerce
npm install
```

### Environment variables

Create a `.env` file if needed:

```env
PORT=3000
NODE_ENV=development
```

### Start the app

```bash
npm start
```

For development watching:

```bash
npm run dev
```

Open the frontend in the browser:

```text
http://localhost:3000
```

### Health check

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "status": "ok",
  "timestamp": "2026-08-15T09:00:57.246Z"
}
```

> Note: if port `3000` is already in use, set `PORT` to another free port, for example `PORT=3100`.

---

## API contract

Base URL:

```text
http://localhost:3000/api
```

All API responses are wrapped in a success envelope like:

```json
{
  "success": true,
  "data": { ... }
}
```

Errors are returned as:

```json
{
  "success": false,
  "error": "Message describing the issue"
}
```

---

## Users API

### Create user

```http
POST /api/users
Content-Type: application/json
```

Body:

```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "secret123"
}
```

Validation:
- `name` is required
- `email` is required and must be valid
- `password` is required and minimum length is 6

Response:

```json
{
  "success": true,
  "data": {
    "id": 5,
    "email": "alice@example.com",
    "passwordHash": "$2b$10$...",
    "name": "Alice",
    "role": "customer",
    "createdAt": "2026-08-15T09:00:57.427Z"
  }
}
```

Important: the current implementation returns `passwordHash` in user data. This is existing behavior and should be treated as internal data, not safe client output.

### List users

```http
GET /api/users
```

### Get user by id

```http
GET /api/users/:id
```

Example:

```bash
curl http://localhost:3000/api/users/1
```

---

## Products API

### Create product

```http
POST /api/products
Content-Type: application/json
```

Body:

```json
{
  "name": "Milk",
  "description": "Fresh dairy",
  "price": 3.5,
  "stock": 10,
  "category": "dairy"
}
```

Validation:
- `name` is required
- `price` is required, numeric, and greater than or equal to 0
- `stock` is required, numeric, and greater than or equal to 0

Response:

```json
{
  "success": true,
  "data": {
    "id": 7,
    "name": "Milk",
    "description": "Fresh dairy",
    "price": 3.5,
    "stock": 10,
    "category": "dairy",
    "createdAt": "2026-08-15T09:00:57.472Z",
    "updatedAt": "2026-08-15T09:00:57.472Z"
  }
}
```

### List products

```http
GET /api/products
```

Optional filters supported by the repository implementation:

```http
GET /api/products?category=dairy
GET /api/products?minPrice=10&maxPrice=30
```

### Get product by id

```http
GET /api/products/:id
```

### Update product

```http
PUT /api/products/:id
Content-Type: application/json
```

Example:

```json
{
  "price": 4.25,
  "stock": 15,
  "category": "dairy"
}
```

### Delete product

```http
DELETE /api/products/:id
```

Response:

```json
{
  "success": true,
  "data": {
    "deleted": true
  }
}
```

---

## Cart API

### Add item to cart

```http
POST /api/cart/add
Content-Type: application/json
```

Body:

```json
{
  "userId": 1,
  "productId": 1,
  "quantity": 2
}
```

Validation:
- `userId` required as number
- `productId` required as number
- `quantity` required as number and minimum 1

Behavior:
- product existence is checked
- stock is checked against requested quantity
- if the cart does not exist for the user, it is created
- repeated adds increase quantity on the same product

Example response:

```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 1,
    "items": [
      { "productId": 1, "quantity": 2 }
    ]
  }
}
```

### Get cart by user

```http
GET /api/cart/:userId
```

Response shape:

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
          "name": "Test Hoodie",
          "price": 49.99
        }
      }
    ],
    "total": 99.98
  }
}
```

### Clear cart

```http
DELETE /api/cart/:userId
```

This removes all cart items for that user.

---

## Orders API

### Create order

```http
POST /api/orders
Content-Type: application/json
```

Body:

```json
{
  "userId": 1,
  "items": [
    { "productId": 1, "quantity": 1 }
  ]
}
```

Behavior:
- validates every requested product exists
- validates product stock against each quantity
- reduces product stock as items are ordered
- creates an order record with `pending` status
- clears that user's cart after the order is saved

Example response:

```json
{
  "success": true,
  "data": {
    "id": 6,
    "userId": 1,
    "items": [
      { "productId": 1, "quantity": 1, "unitPrice": 49.99 }
    ],
    "status": "pending",
    "totalAmount": 49.99,
    "createdAt": "2026-08-15T09:00:57.565Z"
  }
}
```

### List orders

```http
GET /api/orders
```

Optional filter:

```http
GET /api/orders?userId=1
```

### Get order by id

```http
GET /api/orders/:id
```

---

## Database schema

The app uses SQLite and creates these tables on startup via `src/infrastructure/database/schema.sql`:

```sql
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'customer',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL CHECK(price >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK(stock >= 0),
  category TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  total_amount REAL NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price REAL NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE IF NOT EXISTS carts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS cart_items (
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

## Frontend behavior from the browser

The UI in `public/app.js` loads data in this order:

1. `GET /health`
2. `GET /api/users`
3. `GET /api/products`
4. `GET /api/orders`
5. `GET /api/cart/:userId`

When a user adds an item to cart, the frontend posts to:

```http
POST /api/cart/add
```

When the customer clicks checkout, the frontend posts:

```http
POST /api/orders
```

The frontend then refreshes the product list and cart state so the inventory and totals stay in sync.

---

## Tested API matrix

I validated the app with live HTTP requests against the running server.

### Verified successful routes

```bash
curl http://localhost:3000/health
curl -X POST http://localhost:3000/api/users -H 'Content-Type: application/json' -d '{"name":"Alice","email":"alice@example.com","password":"secret123"}'
curl http://localhost:3000/api/users
curl -X POST http://localhost:3000/api/products -H 'Content-Type: application/json' -d '{"name":"Milk","description":"Fresh dairy","price":3.5,"stock":10,"category":"dairy"}'
curl http://localhost:3000/api/products
curl -X POST http://localhost:3000/api/cart/add -H 'Content-Type: application/json' -d '{"userId":1,"productId":1,"quantity":2}'
curl http://localhost:3000/api/cart/1
curl -X POST http://localhost:3000/api/orders -H 'Content-Type: application/json' -d '{"userId":1,"items":[{"productId":1,"quantity":1}]}'
curl http://localhost:3000/api/orders
```

### Verified validation/error behavior

- duplicate user registration returns `409` with `Resource already exists`
- invalid payloads fail with `400` and a validation message
- insufficient product stock returns `500` with `Insufficient stock` in the current app flow
- product checkout decreases stock and clears the cart

---

## Known caveats

- The app currently returns `passwordHash` in user JSON responses.
- Product validation is handled mostly in middleware and repository/business logic; not all cases are normalized before the response is sent.
- If `PORT=3000` is busy, choose another port via the environment variable.
- The native `bcrypt` and `sqlite3` modules may need a rebuild in some Linux containers or environments.

---

## Summary

This project is a working full-stack grocery storefront with a cleanly layered backend and a static frontend. The frontend is fully wired to the API, and the route behavior above matches the live app that was tested during verification.


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
