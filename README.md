# Amazon Clone - Full-Stack E-Commerce Platform

A modern, enterprise-grade e-commerce platform built with **PHP backend using layered architecture**, **React TypeScript frontend with Vite**, and **PostgreSQL database**, all orchestrated with Docker Compose.

## 🏗️ Architecture Overview

This project follows a **strict 3-tier layered architecture** with clean separation of concerns:

- **Backend**: PHP 8.3 with FPM, implementing Domain-Driven Design (DDD)
  - **Presentation Layer**: Controllers and Middleware
  - **Application Layer**: Business logic and Services
  - **Infrastructure Layer**: Database repositories and external services
- **Frontend**: React 18 with TypeScript and Vite for fast development
- **Database**: PostgreSQL 16 with comprehensive e-commerce schema
- **Web Server**: Nginx as reverse proxy and static file server
- **Containerization**: Docker Compose for development and deployment

## 📁 Project Structure

```
amazon-clone/
├── backend/                          # PHP backend application
│   ├── public/
│   │   └── index.php                # Front Controller (single entry point)
│   ├── src/                         # PSR-4 autoloaded source code
│   │   ├── Domain/                  # Domain layer (entities, interfaces)
│   │   │   ├── Entity/              # Domain entities (User, Product, etc.)
│   │   │   └── Repository/          # Repository interfaces
│   │   ├── Application/             # Application layer (business logic)
│   │   │   └── Service/             # Service classes
│   │   ├── Infrastructure/          # Infrastructure layer
│   │   │   └── Persistence/         # Database implementations
│   │   │       └── Postgres/        # PostgreSQL repository implementations
│   │   └── Presentation/            # Presentation layer
│   │       ├── Controller/          # HTTP controllers
│   │       └── Middleware/          # Authentication middleware
│   ├── vendor/                      # Composer dependencies
│   └── composer.json                # PHP dependencies and PSR-4 autoloading
├── frontend/                        # React TypeScript frontend with Vite
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   ├── pages/                   # Page components
│   │   ├── main.tsx                 # Vite entry point
│   │   └── App.tsx                  # Main application component
│   ├── index.html                   # Main HTML template (Vite)
│   ├── vite.config.ts               # Vite configuration
│   └── package.json                 # Node.js dependencies
├── docker/                          # Docker configuration files
│   ├── nginx/
│   │   └── default.conf             # Nginx server configuration
│   ├── php/
│   │   └── Dockerfile               # PHP container config
│   └── postgres/
│       └── init.sql                 # Database schema and seed data
├── docker-compose.yml               # Main orchestration file
├── .env.example                     # Environment variables template
└── README.md                        # This file
```

## 🚀 Quick Start

### Prerequisites

- Docker (version 20.0 or higher)
- Docker Compose (version 2.0 or higher)

### Environment Setup

1. **Clone the repository** (if not already done):

   ```bash
   git clone <your-repo-url>
   cd amazon-clone
   ```

2. **Create environment file**:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your preferred values:

   ```env
   # PostgreSQL Configuration
   DB_HOST=db
   DB_PORT=5432
   DB_DATABASE=amazon_clone_db
   DB_USERNAME=your_db_user
   DB_PASSWORD=your_strong_db_password

   # JWT (JSON Web Token) Configuration
   JWT_SECRET=your_super_secret_key_for_jwt_that_is_at_least_256_bits_long
   JWT_EXPIRATION=3600
   ```

3. **Start the application**:

   ```bash
   # Install PHP dependencies first
   docker-compose run --rm php composer install

   # Start all services
   docker-compose up -d
   ```

4. **Install Frontend Dependencies**:

   ```bash
   docker-compose run --rm frontend npm install
   ```

5. **Verify the setup**:
   - **Frontend (Vite)**: http://localhost:5173
   - **Backend API**: http://localhost:8080
   - **Admin Dashboard**: http://localhost:5173/admin
   - **API Health Check**: http://localhost:8080/api/health
   - **Database**: localhost:5433 (user: your_db_user, password: your_strong_db_password)

## 👤 Admin Access

### Default Admin User

**Login Credentials:**

- **Email**: `superadmin@amazon-clone.com`
- **Password**: `admin123456`
- **Role**: Admin (full access)

### Admin Dashboard Features

The admin dashboard is accessible at http://localhost:5173/admin and includes:

#### 🏠 Dashboard Overview

- Key metrics and statistics
- Quick action buttons
- Recent activity feed
- System status indicators

#### 👥 User Management

- **View all users** with searchable data grid
- **Edit user profiles** (first name, last name)
- **Role management** (customer, seller, admin)
- **Account status** (activate/deactivate users)
- **Staff privileges** (superuser-only feature)

#### 📦 Product Management

- Product listing with advanced filtering
- Create/edit product forms
- Inventory management
- Product status controls
- _Coming soon: Full product management_

#### 📋 Order Management

- Order listing with status filtering
- Order details and tracking
- Payment status monitoring
- Shipping management
- _Coming soon: Complete order processing_

### Admin Authentication

- **Role-based access control** with JWT tokens
- **is_staff** flag for general admin access
- **is_superuser** flag for advanced admin features
- **Automatic redirect** based on user role after login
- **Protected routes** with AdminRoute component

## 🐳 Docker Services

### Service Architecture

The application runs on 4 Docker services:

#### 1. Database Service (`db`)

- **Image**: postgres:16-alpine
- **Port**: 5433:5432 (to avoid conflicts with local PostgreSQL)
- **Features**:
  - Persistent data storage with named volumes
  - Automatic schema initialization via `init.sql`
  - Pre-seeded with sample categories and admin user

#### 2. PHP Service (`php`)

- **Image**: Custom build from php:8.3-fpm
- **Features**:
  - PDO and PDO_PGSQL extensions for database connectivity
  - Xdebug enabled for development debugging
  - Composer for dependency management
  - Volume mounting for live code changes

#### 3. Nginx Service (`nginx`)

- **Image**: nginx:latest
- **Port**: 8080:80
- **Features**:
  - Reverse proxy for PHP-FPM
  - Static file serving
  - Security headers
  - CORS configuration for API endpoints
  - Front Controller pattern support

#### 4. Frontend Service (`frontend`)

- **Image**: node:20-slim
- **Port**: 5173:5173
- **Features**:
  - Vite development server with HMR
  - TypeScript compilation
  - Hot Module Replacement (HMR)
  - Direct container access (not through nginx in development)

## 🏛️ Backend Architecture

### Layered Architecture Implementation

#### Domain Layer (`src/Domain/`)

- **Entities**: Plain Old PHP Objects (POPOs) representing business concepts
- **Repository Interfaces**: Contracts for data access
- **No dependencies** on infrastructure or frameworks

#### Application Layer (`src/Application/`)

- **Services**: Orchestrate business logic and use cases
- **Depend only on Domain interfaces**, not concrete implementations
- Handle transactions and coordinate multiple repositories

#### Infrastructure Layer (`src/Infrastructure/`)

- **Repository Implementations**: Concrete PostgreSQL implementations
- **External Service Integrations**: Email, payment gateways, etc.
- **Dependency Injection**: Manual DI setup in `index.php`

#### Presentation Layer (`src/Presentation/`)

- **Controllers**: Thin HTTP request/response handlers
- **Middleware**: Authentication, authorization, CORS
- **No business logic** - delegates to Application layer

### Authentication & Authorization

- **JWT-based authentication** using Firebase JWT library
- **Role-based access control**: customer, admin, seller
- **Middleware protection** for sensitive endpoints
- **Token expiration and refresh** mechanisms

## 📡 API Endpoints

The backend implements RESTful API endpoints as specified:

### Public Endpoints

- `GET /api/health` - API health check
- `POST /api/users` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/products` - List products (with pagination)
- `GET /api/products/{slug}` - Product details

### Protected Endpoints (JWT Required)

- `GET /api/user/me` - Current user profile
- `PUT /api/user/me` - Update user profile
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/orders` - User's order history
- `POST /api/orders` - Create new order

### Admin Endpoints (Staff Role Required)

- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/{id}` - Update user (superuser only)
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/{id}` - Update product

## 🗄️ Database Schema

PostgreSQL database with comprehensive e-commerce tables:

### Core Tables

- **users**: Customer and admin accounts with role-based access
- **categories**: Hierarchical product categories
- **products**: Complete product information with inventory management
- **orders**: Order processing with status tracking
- **payment_transactions**: Payment processing records

### Supporting Tables

- **user_addresses**: Customer billing and shipping addresses
- **product_images**: Multiple images per product
- **product_attributes**: Product variations (size, color, etc.)
- **cart_items**: Shopping cart functionality
- **order_items**: Detailed order line items
- **product_reviews**: Customer reviews and ratings
- **coupons**: Discount codes and promotions
- **wishlist_items**: Customer wish lists

## 🔧 Development

### Running in Development Mode

```bash
# Start all services
docker-compose up

# View logs
docker-compose logs -f [service-name]

# Execute commands in containers
docker-compose exec php bash
docker-compose exec frontend sh

# Install PHP dependencies
docker-compose exec php composer install

# Install Node.js dependencies
docker-compose exec frontend npm install
```

### Making Changes

- **Backend changes**: Edit files in `backend/src/` - changes are immediately reflected
- **Frontend changes**: Edit files in `frontend/src/` - Vite HMR enabled
- **Database changes**: Modify `docker/postgres/init.sql` and rebuild database

### Testing API Endpoints

```bash
# Health check
curl http://localhost:8080/api/health

# Register user
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@example.com","password":"password123","first_name":"Test","last_name":"User"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🔒 Security Features

### Backend Security

- **Input validation and sanitization**
- **SQL injection prevention** with prepared statements
- **Password hashing** using PHP's password_hash()
- **JWT token-based authentication**
- **Role-based authorization**
- **CORS configuration**

### Infrastructure Security

- **Container isolation**
- **Environment variable management**
- **Security headers in Nginx**
- **Database credentials isolation**

## 🧪 Testing

```bash
# Backend tests (when implemented)
docker-compose exec php composer test

# Frontend tests (when implemented)
docker-compose exec frontend npm test

# Type checking
docker-compose exec frontend npm run type-check
```

## 🚀 Production Deployment

### Building for Production

```bash
# Build frontend
docker-compose exec frontend npm run build

# Production environment variables
APP_ENV=production
APP_DEBUG=false
DB_PASSWORD=<strong-production-password>
JWT_SECRET=<secure-jwt-secret-256-bits-minimum>
```

## 🆘 Troubleshooting

### Common Issues

1. **Port conflicts**: Change ports in `docker-compose.yml`
2. **Permission issues**: Ensure Docker has proper permissions
3. **Composer dependencies**: Run `docker-compose exec php composer install`
4. **Node dependencies**: Run `docker-compose exec frontend npm install`
5. **Database connection**: Verify `.env` variables match service configuration

### Development Commands

```bash
# Clean restart
docker-compose down && docker-compose up --build

# Reset database
docker-compose down -v && docker-compose up -d

# View PHP logs
docker-compose logs php

# View frontend logs
docker-compose logs frontend
```

---

**Built with modern web technologies following enterprise-grade architectural patterns.**

- **Backend**: PHP 8.3, PDO, JWT, PSR-4 Autoloading
- **Frontend**: React 18, TypeScript, Vite, Material-UI
- **Database**: PostgreSQL 16, UUID primary keys
- **Infrastructure**: Docker, Nginx, Composer
