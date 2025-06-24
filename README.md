# Amazon Clone - Full-Stack E-Commerce Platform

A modern, enterprise-grade e-commerce platform built with **PHP backend using layered architecture**, **React TypeScript frontend with Vite**, and **PostgreSQL database**, all orchestrated with Docker Compose.

## 🎯 Current Status & Features

**✅ Core E-commerce Features Implemented:**

- User authentication & authorization (JWT-based)
- Product catalog with categories and advanced filtering
- Shopping cart functionality with persistent storage
- Admin panel with comprehensive product management
- Image upload system for products
- Responsive UI with Material-UI components
- Multi-language support infrastructure

**🔧 Recent Major Updates:**

- Fixed critical 500 error in product loading API
- Complete admin panel localization (Russian → English)
- Enhanced product card consistency and display
- Improved category assignment functionality
- Added shopping cart with drawer interface
- Implemented image gallery and upload system

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
online-shop/
├── backend/                          # PHP backend application
│   ├── public/
│   │   ├── index.php                # Front Controller (single entry point)
│   │   └── uploads/                 # Image uploads directory
│   ├── src/                         # PSR-4 autoloaded source code
│   │   ├── Domain/                  # Domain layer (entities, interfaces)
│   │   │   ├── Entity/              # Domain entities (User, Product, etc.)
│   │   │   └── Repository/          # Repository interfaces
│   │   ├── Application/             # Application layer (business logic)
│   │   │   └── Service/             # Service classes (User, Product, Cart)
│   │   ├── Infrastructure/          # Infrastructure layer
│   │   │   └── Persistence/         # Database implementations
│   │   │       └── Postgres/        # PostgreSQL repository implementations
│   │   └── Presentation/            # Presentation layer
│   │       ├── Controller/          # HTTP controllers (Auth, Product, Admin, Cart)
│   │       └── Middleware/          # Authentication middleware
│   ├── vendor/                      # Composer dependencies
│   └── composer.json                # PHP dependencies and PSR-4 autoloading
├── frontend/                        # React TypeScript frontend with Vite
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── Cart/               # Shopping cart components
│   │   │   ├── ImageGallery/       # Product image display
│   │   │   └── ...                 # Other UI components
│   │   ├── features/               # Feature-based components
│   │   │   └── admin/              # Admin panel components
│   │   ├── pages/                  # Page components
│   │   ├── store/                  # Redux state management
│   │   │   └── slices/             # Redux slices (auth, cart)
│   │   ├── services/               # API service layer
│   │   ├── main.tsx                # Vite entry point
│   │   └── App.tsx                 # Main application component
│   ├── public/                     # Static assets
│   ├── index.html                  # Main HTML template (Vite)
│   ├── vite.config.ts              # Vite configuration
│   └── package.json                # Node.js dependencies
├── docker/                         # Docker configuration files
│   ├── nginx/
│   │   └── default.conf            # Nginx server configuration
│   ├── php/
│   │   └── Dockerfile              # PHP container config
│   └── postgres/
│       └── init.sql                # Database schema and seed data
├── docker-compose.yml              # Main orchestration file
├── .env.example                    # Environment variables template
└── README.md                       # This file
```

## 🚀 Quick Start

### Prerequisites

- Docker (version 20.0 or higher)
- Docker Compose (version 2.0 or higher)
- Git

### Environment Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/daniilbelik94/online-shop.git
   cd online-shop
   ```

2. **Create environment file**:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your preferred values:

   ```env
   # Application Configuration
   APP_ENV=production
   APP_DEBUG=false

   # PostgreSQL Configuration
   DB_HOST=db
   DB_PORT=5432
   DB_DATABASE=railway
   DB_USERNAME=postgres
   DB_PASSWORD=your_strong_db_password

   # JWT (JSON Web Token) Configuration
   JWT_SECRET=your-super-secure-256-bit-secret-key-here
   JWT_EXPIRATION=3600
   ```

3. **Start the application**:

   ```bash
   # Start all services (will auto-install dependencies)
   docker-compose up -d

   # Alternative: Install dependencies manually first
   docker-compose run --rm php composer install
   docker-compose run --rm frontend npm install
   docker-compose up -d
   ```

4. **Verify the setup**:
   - **Frontend (React + Vite)**: http://localhost:5173
   - **Backend API**: http://localhost:8080
   - **Admin Dashboard**: http://localhost:5173/admin
   - **API Health Check**: http://localhost:8080/api/health
   - **Database**: localhost:5433 (user: postgres)

## 👤 Admin Access & Features

### Default Admin User

**Login Credentials:**

- **Email**: `admin@example.com`
- **Password**: `admin123`
- **Role**: Admin (full access)

_Note: Change these credentials in production!_

### Admin Dashboard Features

The admin dashboard is accessible at http://localhost:5173/admin and includes:

#### 🏠 Dashboard Overview

- **Statistics Cards**: Total products, active products, out of stock, low stock, and total inventory value
- **Quick Actions**: Create product, manage users, view orders
- **Modern UI**: Clean, professional interface with Material-UI

#### 👥 User Management

- **View all users** with searchable, sortable data grid
- **Edit user profiles** (first name, last name, role)
- **Role management** (customer, admin)
- **Account status** (activate/deactivate users)
- **Advanced search and filtering**

#### 📦 Product Management

- **Complete CRUD operations** for products
- **Category assignment** with full category support
- **Image upload and management** (multiple images per product)
- **Inventory tracking** (stock quantity, low stock alerts)
- **Product status controls** (active/inactive, featured)
- **Advanced filtering** (by category, status, stock level)
- **Bulk operations** and status management
- **Rich text descriptions** with proper formatting

#### 🛒 Shopping Cart System

- **Persistent cart** across sessions
- **Add/remove items** with quantity management
- **Real-time price calculations**
- **Cart drawer interface** for quick access
- **Guest cart support** with session merging

#### 📷 Image Management

- **Multi-image upload** for products
- **Image gallery** with zoom functionality
- **Drag-and-drop interface** for easy uploads
- **Image optimization** and validation
- **Delete/reorder** image functionality

## 🐳 Docker Services

### Service Architecture

The application runs on 4 Docker services:

#### 1. Database Service (`db`)

- **Image**: postgres:16-alpine
- **Port**: 5433:5432 (to avoid conflicts with local PostgreSQL)
- **Features**:
  - Persistent data storage with named volumes
  - Automatic schema initialization via `init.sql`
  - Pre-seeded with sample categories, products, and admin user
  - UUID primary keys for all entities

#### 2. PHP Service (`php`)

- **Image**: Custom build from php:8.3-fpm
- **Features**:
  - PDO and PDO_PGSQL extensions for database connectivity
  - Xdebug enabled for development debugging
  - Composer for dependency management
  - Volume mounting for live code changes
  - File upload support for product images

#### 3. Nginx Service (`nginx`)

- **Image**: nginx:latest
- **Port**: 8080:80
- **Features**:
  - Reverse proxy for PHP-FPM
  - Static file serving (including uploaded images)
  - Security headers and CORS configuration
  - Front Controller pattern support
  - Optimized for both API and static content

#### 4. Frontend Service (`frontend`)

- **Image**: node:20-slim
- **Port**: 5173:5173
- **Features**:
  - Vite development server with HMR
  - TypeScript compilation and type checking
  - Hot Module Replacement for fast development
  - Redux DevTools integration
  - Material-UI theming support

## 🏛️ Backend Architecture

### Layered Architecture Implementation

#### Domain Layer (`src/Domain/`)

- **Entities**: Rich domain objects (User, Product, Category)
  - Product entity with full e-commerce functionality
  - User entity with role-based permissions
  - Category entity with hierarchical support
- **Repository Interfaces**: Contracts for data access
- **No dependencies** on infrastructure or frameworks

#### Application Layer (`src/Application/`)

- **Services**: Orchestrate business logic and use cases
  - **UserService**: User management and authentication
  - **ProductService**: Product CRUD with advanced filtering
  - **CartService**: Shopping cart operations
  - **CategoryService**: Category management
- **Depend only on Domain interfaces**, not concrete implementations
- Handle transactions and coordinate multiple repositories

#### Infrastructure Layer (`src/Infrastructure/`)

- **Repository Implementations**: Concrete PostgreSQL implementations
  - Advanced query building with filtering and sorting
  - Proper JOIN operations for category data
  - Pagination and performance optimization
- **External Service Integrations**: File uploads, email (planned)
- **Dependency Injection**: Manual DI setup in `index.php`

#### Presentation Layer (`src/Presentation/`)

- **Controllers**: Thin HTTP request/response handlers
  - **ProductController**: Public product API
  - **AdminProductController**: Admin product management
  - **CartController**: Shopping cart API
  - **ImageUploadController**: File upload handling
- **Middleware**: JWT authentication and authorization
- **No business logic** - delegates to Application layer

### Authentication & Authorization

- **JWT-based authentication** using Firebase JWT library
- **Role-based access control**: customer, admin
- **Middleware protection** for sensitive endpoints
- **Token expiration and refresh** mechanisms
- **Admin-only routes** with proper access control

## 📡 API Endpoints

The backend implements RESTful API endpoints with proper HTTP status codes:

### Public Endpoints

- `GET /api/health` - API health check
- `POST /api/users` - User registration
- `POST /api/auth/login` - User authentication
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/products` - List products (with pagination and filtering)
- `GET /api/products/search` - Search products
- `GET /api/products/featured` - Featured products
- `GET /api/products/recommended` - Recommended products
- `GET /api/products/{slug}` - Product details
- `GET /api/categories` - List all categories

### Protected Endpoints (JWT Required)

- `GET /api/user/me` - Current user profile
- `PUT /api/user/me` - Update user profile
- `POST /api/user/change-password` - Change password
- `GET /api/user/orders` - User's order history

### Cart Endpoints (Session/JWT)

- `GET /api/cart` - Get cart contents
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/remove` - Remove item from cart
- `DELETE /api/cart/clear` - Clear entire cart
- `POST /api/cart/merge` - Merge guest cart with user cart

### Admin Endpoints (Staff Role Required)

- `GET /api/admin/users` - List all users
- `PUT /api/admin/users/{id}` - Update user (admin only)
- `GET /api/admin/products` - List all products (admin view)
- `POST /api/admin/products` - Create new product
- `GET /api/admin/products/{id}` - Get product details
- `PUT /api/admin/products/{id}` - Update product
- `DELETE /api/admin/products/{id}` - Delete product
- `GET /api/admin/products/stats` - Product statistics
- `GET /api/admin/products/low-stock` - Low stock alerts

### File Upload Endpoints (Admin Only)

- `POST /api/admin/upload/image` - Upload single image
- `POST /api/admin/upload/images` - Upload multiple images
- `DELETE /api/admin/delete/image` - Delete uploaded image

## 🗄️ Database Schema

PostgreSQL database with comprehensive e-commerce tables using UUID primary keys:

### Core Tables

- **users**: Customer and admin accounts with role-based access
  - Fields: id (UUID), username, email, password_hash, role, is_active, etc.
  - Includes profile information and timestamps
- **categories**: Hierarchical product categories
  - Fields: id (UUID), name, slug, description, is_active
  - Ready for nested category implementation
- **products**: Complete product information with inventory management
  - Fields: id (UUID), name, slug, description, price, stock_quantity, category_id, etc.
  - Support for multiple images, variations, and full e-commerce attributes
- **cart_items**: Shopping cart functionality
  - Session-based and user-based cart support
  - Automatic cleanup of old cart items

### Future Tables (Planned)

- **orders**: Order processing with status tracking
- **order_items**: Detailed order line items
- **payment_transactions**: Payment processing records
- **user_addresses**: Customer billing and shipping addresses
- **product_reviews**: Customer reviews and ratings
- **coupons**: Discount codes and promotions
- **wishlist_items**: Customer wish lists

## 🛠️ Development Workflow

### Running in Development Mode

```bash
# Start all services
docker-compose up

# Start with rebuild (after code changes)
docker-compose up --build

# View logs for specific service
docker-compose logs -f [php|frontend|nginx|db]

# Execute commands in containers
docker-compose exec php bash
docker-compose exec frontend sh

# Install dependencies
docker-compose exec php composer install
docker-compose exec frontend npm install

# Database operations
docker-compose exec db psql -U postgres -d railway
```

### Making Changes

- **Backend changes**: Edit files in `backend/src/` - changes are immediately reflected
- **Frontend changes**: Edit files in `frontend/src/` - Vite HMR enabled for instant updates
- **Database changes**: Modify `docker/postgres/init.sql` and rebuild database
- **Configuration changes**: Update `docker-compose.yml` or service configs

### Frontend Development

```bash
# Run frontend independently (if needed)
cd frontend
npm install
npm run dev

# Type checking
npm run type-check

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend Development

```bash
# Install PHP dependencies
docker-compose exec php composer install

# Run PHP syntax check
docker-compose exec php php -l src/Domain/Entity/Product.php

# Access PHP container for debugging
docker-compose exec php bash
```

### Testing API Endpoints

```bash
# Health check
curl http://localhost:8080/api/health

# Get all products
curl http://localhost:8080/api/products

# Register new user
curl -X POST http://localhost:8080/api/users \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123","first_name":"Test","last_name":"User"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Get categories
curl http://localhost:8080/api/categories

# Search products
curl "http://localhost:8080/api/products/search?q=macbook"
```

## 🔒 Security Features

### Backend Security

- **Input validation and sanitization** for all user inputs
- **SQL injection prevention** with prepared statements and parameter binding
- **Password hashing** using PHP's password_hash() with strong algorithms
- **JWT token-based authentication** with configurable expiration
- **Role-based authorization** with middleware protection
- **CORS configuration** for API security
- **File upload validation** with type and size restrictions

### Infrastructure Security

- **Container isolation** with Docker
- **Environment variable management** for sensitive data
- **Security headers** configured in Nginx
- **Database credentials isolation** from application code
- **No sensitive data in logs** or error messages

### Frontend Security

- **XSS prevention** with React's built-in protections
- **CSRF protection** through JWT tokens
- **Secure token storage** in localStorage with proper cleanup
- **Route protection** based on user roles
- **Input sanitization** for all form fields

## 🐛 Troubleshooting

### Common Issues and Solutions

1. **Port conflicts**:

   ```bash
   # Change ports in docker-compose.yml
   # Frontend: 5173:5173 → 3000:5173
   # Backend: 8080:80 → 8000:80
   # Database: 5433:5432 → 5434:5432
   ```

2. **Database connection issues**:

   ```bash
   # Check if database is running
   docker-compose ps

   # Restart database service
   docker-compose restart db

   # Check database logs
   docker-compose logs db
   ```

3. **Frontend build issues**:

   ```bash
   # Clear node_modules and reinstall
   docker-compose exec frontend rm -rf node_modules package-lock.json
   docker-compose exec frontend npm install

   # Clear Vite cache
   docker-compose exec frontend npm run dev -- --force
   ```

4. **Backend 500 errors**:

   ```bash
   # Check PHP logs
   docker-compose logs php

   # Verify database connection
   docker-compose exec php php -r "
   try {
     \$pdo = new PDO('pgsql:host=db;dbname=railway', 'postgres', 'your_password');
     echo 'Database connection successful';
   } catch (Exception \$e) {
     echo 'Database connection failed: ' . \$e->getMessage();
   }"
   ```

5. **Image upload not working**:

   ```bash
   # Check uploads directory permissions
   docker-compose exec php ls -la public/uploads

   # Create uploads directory if missing
   docker-compose exec php mkdir -p public/uploads
   docker-compose exec php chmod 755 public/uploads
   ```

### Development Commands

```bash
# Complete system restart
docker-compose down && docker-compose up --build

# Reset database (WARNING: destroys all data)
docker-compose down -v
docker-compose up -d

# View all service logs
docker-compose logs

# Monitor specific service
docker-compose logs -f php
docker-compose logs -f frontend

# Execute SQL queries
docker-compose exec db psql -U postgres -d railway -c "SELECT * FROM products LIMIT 5;"

# Check container resource usage
docker stats
```

## 🚀 Production Deployment

### Building for Production

```bash
# Build optimized frontend
docker-compose exec frontend npm run build

# Set production environment variables
cat > .env.production << EOF
APP_ENV=production
APP_DEBUG=false
DB_PASSWORD=<STRONG_PRODUCTION_PASSWORD>
JWT_SECRET=<SECURE_JWT_SECRET_256_BITS_MINIMUM>
EOF

# Use production docker-compose file (create docker-compose.prod.yml)
docker-compose -f docker-compose.prod.yml up -d
```

### Production Checklist

- [ ] Change default admin credentials
- [ ] Use strong database passwords
- [ ] Generate secure JWT secret (minimum 256 bits)
- [ ] Configure proper SSL/TLS certificates
- [ ] Set up proper backup strategy
- [ ] Configure log rotation
- [ ] Enable firewall rules
- [ ] Set up monitoring and alerts
- [ ] Configure proper CORS settings
- [ ] Implement rate limiting

## 📊 Performance Optimization

### Database Optimization

- UUID primary keys for better distribution
- Proper indexing on frequently queried columns
- Connection pooling and prepared statements
- Query optimization with JOINs instead of N+1 queries

### Frontend Optimization

- Vite for fast development and optimized builds
- Code splitting and lazy loading
- Image optimization and lazy loading
- Redux for efficient state management
- Material-UI with tree shaking

### Backend Optimization

- PHP-FPM with optimized process management
- Nginx reverse proxy with proper caching headers
- Prepared statements for database queries
- Efficient file upload handling

## 🧪 Testing

```bash
# Backend tests (when implemented)
docker-compose exec php composer test

# Frontend tests (when implemented)
docker-compose exec frontend npm test

# Type checking
docker-compose exec frontend npm run type-check

# Linting
docker-compose exec frontend npm run lint

# API testing with curl (see examples above)
```

## 📈 Roadmap

### Short Term (Next Updates)

- [ ] Order management system
- [ ] Payment integration (Stripe/PayPal)
- [ ] Email notifications
- [ ] Advanced search with Elasticsearch
- [ ] Product reviews and ratings
- [ ] Inventory management improvements

### Medium Term

- [ ] Multi-vendor marketplace
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Internationalization (i18n)
- [ ] Advanced caching (Redis)
- [ ] API rate limiting

### Long Term

- [ ] Microservices architecture
- [ ] Machine learning recommendations
- [ ] Real-time chat support
- [ ] Advanced reporting
- [ ] Third-party integrations
- [ ] Performance monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Development Guidelines

- Follow PSR-4 autoloading standards for PHP
- Use TypeScript for all frontend code
- Write descriptive commit messages
- Add comments for complex business logic
- Test your changes thoroughly
- Update documentation when needed

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React team for the excellent frontend framework
- Vite team for the lightning-fast build tool
- Material-UI team for the comprehensive component library
- PostgreSQL team for the robust database system
- Docker team for containerization technology
- PHP community for the solid backend foundation

---

**Built with modern web technologies following enterprise-grade architectural patterns.**

**Tech Stack:**

- **Backend**: PHP 8.3, PDO, JWT, PSR-4 Autoloading, Layered Architecture
- **Frontend**: React 18, TypeScript, Vite, Material-UI, Redux Toolkit
- **Database**: PostgreSQL 16, UUID primary keys, Advanced queries
- **Infrastructure**: Docker, Nginx, Composer, npm
- **Development**: Hot Module Replacement, Docker Compose, Git

**Repository**: [https://github.com/daniilbelik94/online-shop](https://github.com/daniilbelik94/online-shop)
