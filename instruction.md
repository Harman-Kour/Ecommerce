# Project Start Instructions

This project is a Node.js + Express e-commerce app with:

- REST API backend
- SQLite database
- Plain HTML/CSS/JavaScript frontend served from `public/`

The app runs on port `3000` by default. If port `3000` is busy, use another host port such as `3001`.

## 1. Prerequisites

Use either Node.js directly or Docker.

Recommended local setup:

- Node.js 18 or newer
- npm

Docker setup:

- Docker installed and running

## 2. Clone And Enter Project

```bash
git clone <your-repository-url>
cd ecommerce
```

If the project is already on your machine, just go to the project folder:

```bash
cd /path/to/ecommerce
```

## 3. Environment File

Create a `.env` file in the project root:

```env
PORT=3000
NODE_ENV=development
```

## 4. Start With Node.js

Install dependencies:

```bash
npm install
```

Start the project:

```bash
npm start
```

For development with auto-restart:

```bash
npm run dev
```

Open the frontend:

```text
http://localhost:3000
```

Check backend health:

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "status": "ok"
}
```

## 5. Start With Docker

Use this method if Node.js/npm are not installed on the host machine.

Install dependencies through Docker:

```bash
docker run --rm -v "$PWD:/app" -w /app node:20-alpine npm install
```

Start the app on host port `3001`:

```bash
docker run -d \
  --name ecommerce-clean-api \
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

