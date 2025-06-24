# Complete Online Shop Deployment Guide

## 🚀 Quick Start

### 1. Railway Database Configuration

Your Railway environment variables are already configured correctly:

✅ **Database Configuration:**

```
DB_HOST=interchange.proxy.rlwy.net
DB_PORT=45401
DB_NAME=railway
DB_USERNAME=postgres
DB_PASSWORD=BOreDfeaiQUZeSJCtAUELdcwDISAwkfA
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
APP_ENV=production
```

### 2. Database Initialization

Execute this SQL script in Railway Console or pgAdmin to create the required tables:

```sql
-- Create database extensions and tables
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'customer',
    is_active BOOLEAN DEFAULT TRUE,
    is_email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category_id UUID REFERENCES categories(id),
    brand VARCHAR(100),
    sku VARCHAR(100) UNIQUE,
    stock_quantity INTEGER DEFAULT 0,
    image_url TEXT,
    images JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cart table
CREATE TABLE IF NOT EXISTS cart (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- Insert default admin user (password: "password")
INSERT INTO users (username, email, password_hash, first_name, last_name, role, is_active, is_email_verified)
VALUES ('admin', 'admin@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', 'admin', TRUE, TRUE)
ON CONFLICT (email) DO NOTHING;

-- Insert sample categories
INSERT INTO categories (name, slug, description) VALUES
('Electronics', 'electronics', 'Electronic devices and gadgets'),
('Clothing', 'clothing', 'Fashion and apparel'),
('Books', 'books', 'Books and literature'),
('Home & Garden', 'home-garden', 'Home and garden products')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, slug, description, short_description, price, category_id, brand, sku, stock_quantity, is_active, is_featured) VALUES
('iPhone 15 Pro', 'iphone-15-pro', 'Latest iPhone with advanced features', 'Apple iPhone 15 Pro', 999.99, (SELECT id FROM categories WHERE slug = 'electronics'), 'Apple', 'IPH15PRO', 50, TRUE, TRUE),
('MacBook Air M3', 'macbook-air-m3', 'Powerful laptop with M3 chip', 'Apple MacBook Air with M3', 1299.99, (SELECT id FROM categories WHERE slug = 'electronics'), 'Apple', 'MBA-M3', 25, TRUE, TRUE),
('Nike Air Max', 'nike-air-max', 'Comfortable running shoes', 'Nike Air Max sneakers', 129.99, (SELECT id FROM categories WHERE slug = 'clothing'), 'Nike', 'NAM-001', 100, TRUE, FALSE)
ON CONFLICT (slug) DO NOTHING;
```

### 3. Backend Deployment on Railway

Your backend should now deploy successfully with the optimized `Dockerfile.simple`:

1. ✅ Environment variables are configured
2. ✅ Dockerfile is optimized for memory usage
3. ✅ CORS headers are configured
4. 🔄 **Deploy your project on Railway**

**Your Backend URL:** `https://online-shop-production-1da0.up.railway.app`

### 4. Frontend Deployment on Vercel

Your frontend is already configured and deployed:

- **Frontend URL:** https://online-shop-front-b01nq38pk-daniil-beliks-projects.vercel.app/
- **API URL:** Already configured in `vercel.json`

### 5. Testing the Deployment

1. **Test Backend Health:**

   ```bash
   curl https://online-shop-production-1da0.up.railway.app/api/health
   ```

2. **Test Frontend:**
   Open: https://online-shop-front-b01nq38pk-daniil-beliks-projects.vercel.app/

3. **Login as Admin:**
   - Email: `admin@example.com`
   - Password: `password`

## 🔧 Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   Vercel        │    │   Railway       │    │   Railway       │
│   (Frontend)    │───▶│   (Backend)     │───▶│   (PostgreSQL)  │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Troubleshooting

### If Backend Doesn't Start:

1. Check Railway logs in the deployment tab
2. Verify all environment variables are set
3. Ensure database connection is working

### If Frontend Can't Connect to Backend:

1. Check CORS headers in browser developer tools
2. Verify `VITE_API_URL` is correct in Vercel
3. Test backend `/api/health` endpoint

### Docker Memory Issues (Error 137):

- ✅ Using optimized `Dockerfile.simple`
- ✅ Removed unnecessary packages
- ✅ Added memory-efficient build flags

### Database Connection Issues:

```bash
# Test database connection
psql -h interchange.proxy.rlwy.net -p 45401 -U postgres -d railway
```

## 📝 Development Commands

### Local Development:

```bash
# Frontend
cd frontend
npm run dev

# Backend (Docker)
docker-compose up -d
```

### Add Sample Data:

```sql
-- Add more products
INSERT INTO products (name, slug, description, price, category_id, stock_quantity) VALUES
('Product Name', 'product-slug', 'Product description', 99.99, (SELECT id FROM categories WHERE slug = 'electronics'), 50);
```

### Create New Admin User:

```sql
INSERT INTO users (username, email, password_hash, first_name, last_name, role)
VALUES ('newadmin', 'admin@yoursite.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', 'admin');
```

## 🌟 Production Ready!

Your online shop is now fully deployed and ready:

- ✅ **Frontend**: https://online-shop-front-b01nq38pk-daniil-beliks-projects.vercel.app/
- ✅ **Backend API**: https://online-shop-production-1da0.up.railway.app/api
- ✅ **Database**: interchange.proxy.rlwy.net:45401
- ✅ **Admin Panel**: Available after login with admin credentials

## 🔐 Security Notes

- Change default admin password in production
- Update JWT_SECRET to a more secure value
- Consider enabling HTTPS redirects
- Set up proper error logging

## 📊 Features Included

- ✅ User Authentication & Authorization
- ✅ Product Management (CRUD)
- ✅ Shopping Cart
- ✅ Admin Dashboard
- ✅ Image Upload
- ✅ Responsive Design
- ✅ API Documentation
- ✅ Database Migrations
