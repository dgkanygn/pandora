# Çiçekçi API - PHP + MySQL

RESTful API for the flower shop application built with PHP and MySQL.

## Requirements

- PHP 7.4 or higher
- MySQL 5.7 or higher
- Apache/Nginx web server (or built-in PHP server for development)

## Installation

### 1. Clone and Setup

```bash
cd api-php
cp .env.example .env
```

### 2. Configure Environment

Edit `.env` file with your database credentials:

```env
DB_HOST=localhost
DB_NAME=cicekci
DB_USER=root
DB_PASS=your_password

JWT_SECRET=your-super-secret-key-change-this-in-production
UPLOAD_BASE_URL=http://localhost:8080/uploads
```

### 3. Create Database

Run the SQL schema to create the database and tables:

```bash
mysql -u root -p < database/schema.sql
```

Or import via phpMyAdmin.

### 4. Start Development Server

```bash
# Using PHP built-in server
php -S localhost:8080 index.php

# Or with router for uploads
php -S localhost:8080 -t .
```

The API will be available at `http://localhost:8080/api`

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/signup` | Register new user | - |
| POST | `/api/auth/signin` | Login | - |
| POST | `/api/auth/signout` | Logout | ✓ |
| GET | `/api/auth/me` | Get current user | ✓ |
| POST | `/api/auth/reset-password` | Request password reset | - |
| POST | `/api/auth/update-password` | Update password | ✓ |

### Profiles

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/profiles/me` | Get my profile | ✓ |
| PUT | `/api/profiles/me` | Update my profile | ✓ |
| GET | `/api/profiles` | Get all profiles | Admin |
| GET | `/api/profiles/{id}` | Get profile by ID | Admin |
| PATCH | `/api/profiles/{id}/toggle-active` | Toggle active status | Admin |
| PATCH | `/api/profiles/{id}/role` | Update role | Admin |

### Categories

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/categories` | Get active categories | - |
| GET | `/api/categories/slug/{slug}` | Get category by slug | - |
| GET | `/api/categories/admin/all` | Get all categories | Admin |
| GET | `/api/categories/{id}` | Get category by ID | Admin |
| POST | `/api/categories` | Create category | Admin |
| PUT | `/api/categories/{id}` | Update category | Admin |
| DELETE | `/api/categories/{id}` | Delete category | Admin |
| PATCH | `/api/categories/{id}/toggle-active` | Toggle active status | Admin |

### Products

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/products` | Get active products | - |
| GET | `/api/products/{id}` | Get product by ID | - |
| GET | `/api/products/admin/all` | Get all products | Admin |
| POST | `/api/products` | Create product | Admin |
| PUT | `/api/products/{id}` | Update product | Admin |
| DELETE | `/api/products/{id}` | Delete product | Admin |
| PATCH | `/api/products/{id}/toggle-active` | Toggle active status | Admin |
| PATCH | `/api/products/{id}/stock` | Update stock | Admin |

**Product Query Parameters:**
- `category` - Filter by category slugs (comma-separated)
- `search` - Search by product name
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `sortBy` - Sort field (name, price, created_at, stock)
- `sortOrder` - Sort order (asc, desc)
- `limit` - Limit results
- `offset` - Offset for pagination

### Orders

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/orders/track/{orderCode}` | Track order by code | - |
| POST | `/api/orders` | Create order | Optional |
| GET | `/api/orders/my-orders` | Get my orders | ✓ |
| GET | `/api/orders/{id}` | Get order by ID | ✓ |
| POST | `/api/orders/{id}/cancel` | Cancel order | ✓ |
| GET | `/api/orders` | Get all orders | Admin |
| GET | `/api/orders/admin/stats` | Get order stats | Admin |
| PATCH | `/api/orders/{id}/status` | Update order status | Admin |

### Order Items

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/order-items/order/{orderId}` | Get items by order | ✓ |
| GET | `/api/order-items/{id}` | Get item by ID | ✓ |
| POST | `/api/order-items` | Create item | Admin |
| POST | `/api/order-items/bulk` | Create items bulk | Admin |
| PATCH | `/api/order-items/{id}` | Update item | Admin |
| DELETE | `/api/order-items/{id}` | Delete item | Admin |
| DELETE | `/api/order-items/order/{orderId}` | Delete order items | Admin |

### Blogs

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/blogs` | Get published posts | - |
| GET | `/api/blogs/slug/{slug}` | Get post by slug | - |
| GET | `/api/blogs/{id}` | Get post by ID | - |
| GET | `/api/blogs/admin/all` | Get all posts | Admin |
| POST | `/api/blogs` | Create post | Admin |
| PUT | `/api/blogs/{id}` | Update post | Admin |
| DELETE | `/api/blogs/{id}` | Delete post | Admin |
| PATCH | `/api/blogs/{id}/toggle-published` | Toggle published | Admin |

## Authentication

The API uses JWT (JSON Web Token) for authentication.

### Getting a Token

```bash
curl -X POST http://localhost:8080/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@cicekci.com", "password": "admin123"}'
```

### Using the Token

Include the token in the `Authorization` header:

```bash
curl http://localhost:8080/api/profiles/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## File Uploads

For endpoints that support file uploads (categories, products, blogs), use `multipart/form-data`:

```bash
curl -X POST http://localhost:8080/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=Test Product" \
  -F "price=99.99" \
  -F "image=@/path/to/image.jpg"
```

## Default Admin Credentials

- **Email:** admin@cicekci.com
- **Password:** admin123

⚠️ **Change these in production!**

## Project Structure

```
api-php/
├── config/
│   ├── config.php      # App configuration
│   └── database.php    # Database connection
├── database/
│   └── schema.sql      # MySQL schema
├── helpers/
│   ├── jwt.php         # JWT utilities
│   ├── response.php    # Response helpers
│   └── upload.php      # File upload handler
├── middleware/
│   └── auth.php        # Authentication middleware
├── routes/
│   ├── auth.php
│   ├── profiles.php
│   ├── categories.php
│   ├── products.php
│   ├── orders.php
│   ├── order-items.php
│   └── blogs.php
├── services/
│   ├── AuthService.php
│   ├── ProfileService.php
│   ├── CategoryService.php
│   ├── ProductService.php
│   ├── OrderService.php
│   ├── OrderItemService.php
│   └── BlogService.php
├── uploads/            # Uploaded files
│   ├── categories/
│   ├── products/
│   └── blogs/
├── .env.example
├── index.php           # Main entry point
└── README.md
```

## Differences from Node.js Version

| Feature | Node.js (Supabase) | PHP (MySQL) |
|---------|-------------------|-------------|
| Database | Supabase PostgreSQL | MySQL |
| Auth | Supabase Auth | Custom JWT |
| File Storage | Supabase Storage | Local filesystem |
| Runtime | Node.js + Express | PHP |

## License

MIT
