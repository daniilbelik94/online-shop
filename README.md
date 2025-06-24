# 🛒 Online Shop - Full Stack E-commerce Platform

A modern, full-stack e-commerce application built with React (TypeScript) frontend and PHP backend, deployed on Vercel and Railway.

## 🌟 Live Demo

- **Frontend**: https://online-shop-front-b01nq38pk-daniil-beliks-projects.vercel.app/
- **Backend API**: https://online-shop-production-1da0.up.railway.app/api
- **Admin Panel**: Available after login with admin credentials

## 🚀 Features

### Frontend (React + TypeScript)

- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **Product Catalog** - Browse and search products
- ✅ **Shopping Cart** - Add/remove items, quantity management
- ✅ **User Authentication** - Login, register, profile management
- ✅ **Admin Dashboard** - Product management, user management
- ✅ **Image Gallery** - Product image carousel
- ✅ **Modern UI** - Material-UI components with custom styling

### Backend (PHP + PostgreSQL)

- ✅ **RESTful API** - Clean API endpoints
- ✅ **JWT Authentication** - Secure token-based auth
- ✅ **Admin Panel** - Full CRUD operations
- ✅ **Image Upload** - Product image management
- ✅ **Database** - PostgreSQL with proper relations
- ✅ **CORS Support** - Proper cross-origin handling

## 🛠️ Tech Stack

### Frontend

- **React** 18 with TypeScript
- **Material-UI** for components
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Axios** for API calls
- **Swiper** for product sliders
- **Vite** for build tooling

### Backend

- **PHP** 8.3 with Apache
- **PostgreSQL** database
- **JWT** for authentication
- **Clean Architecture** with DDD principles
- **Docker** for containerization

### Infrastructure

- **Vercel** - Frontend hosting
- **Railway** - Backend hosting + PostgreSQL
- **Docker** - Containerization

## 📦 Installation & Setup

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for local development)
- Git

### Local Development

1. **Clone the repository:**

   ```bash
   git clone <your-repo-url>
   cd online-shop
   ```

2. **Frontend Setup:**

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Backend Setup (Docker):**

   ```bash
   # From project root
   docker-compose up -d
   ```

4. **Environment Variables:**
   Create `.env` file in project root:

   ```bash
   # Database
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=ecommerce
   DB_USERNAME=postgres
   DB_PASSWORD=password

   # JWT
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRATION=3600

   # Frontend
   VITE_API_URL=http://localhost:8080/api
   ```

## 🚀 Production Deployment

### Railway Backend Setup

1. **Environment Variables** (Already configured):

   ```
   DB_HOST=interchange.proxy.rlwy.net
   DB_PORT=45401
   DB_NAME=railway
   DB_USERNAME=postgres
   DB_PASSWORD=BOreDfeaiQUZeSJCtAUELdcwDISAwkfA
   JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
   APP_ENV=production
   ```

2. **Database Initialization:**

   ```sql
   -- Execute in Railway Console
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

   -- Create tables (see SETUP_GUIDE.md for full SQL)
   ```

3. **Deploy:** Railway automatically deploys from your repository

### Vercel Frontend Setup

1. **Environment Variables:**

   ```
   VITE_API_URL=https://online-shop-production-1da0.up.railway.app/api
   ```

2. **Deploy:** Vercel automatically deploys from your repository

## 📖 API Documentation

### Authentication Endpoints

```
POST /api/auth/login
POST /api/auth/refresh
POST /api/users (register)
```

### Product Endpoints

```
GET /api/products
GET /api/products/{slug}
POST /api/admin/products (admin only)
PUT /api/admin/products/{id} (admin only)
DELETE /api/admin/products/{id} (admin only)
```

### User Endpoints

```
GET /api/user/me
PUT /api/user/me
GET /api/user/orders
```

### Admin Endpoints

```
GET /api/admin/users
PUT /api/admin/users/{id}
GET /api/admin/products/stats
```

## 🔐 Default Credentials

**Admin User:**

- Email: `admin@example.com`
- Password: `password`

**Note:** Change these credentials in production!

## 🛠️ Development Commands

```bash
# Frontend development
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Backend development
docker-compose up -d       # Start backend services
docker-compose logs -f     # View logs
docker-compose down        # Stop services

# Database
docker-compose exec db psql -U postgres -d ecommerce
```

## 📁 Project Structure

```
online-shop/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Route components
│   │   ├── features/        # Feature-specific components
│   │   ├── store/           # Redux store
│   │   ├── lib/             # API and utilities
│   │   └── main.tsx         # App entry point
│   ├── public/              # Static assets
│   └── package.json
├── backend/                 # PHP backend
│   ├── src/
│   │   ├── Application/     # Application services
│   │   ├── Domain/          # Domain entities
│   │   ├── Infrastructure/  # Database repositories
│   │   └── Presentation/    # Controllers
│   ├── public/              # Web root
│   └── composer.json
├── docker/                  # Docker configuration
├── docker-compose.yml       # Local development
└── README.md
```

## 🧪 Testing

### Frontend Testing

```bash
cd frontend
npm test
```

### Backend Testing

```bash
cd backend
composer test
```

## 🔧 Troubleshooting

### Common Issues

1. **CORS Errors:**

   - Check VITE_API_URL in frontend
   - Verify CORS headers in backend

2. **Database Connection:**

   - Verify environment variables
   - Check Railway database status

3. **Build Errors:**

   - Clear npm cache: `npm cache clean --force`
   - Restart Vite: `npm run dev`

4. **Docker Issues:**
   - Restart Docker: `docker-compose down && docker-compose up -d`
   - Clear volumes: `docker-compose down -v`

### Performance Optimization

- Images are optimized for web
- API responses are paginated
- Frontend uses lazy loading
- Database queries are optimized

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section
2. Review the setup guide
3. Check the logs for error messages
4. Open an issue on GitHub

---

**Happy Shopping! 🛍️**
