#!/bin/bash

# Online Shop Deployment Script
echo "🚀 Starting Online Shop Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "railway.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

print_status "Project structure verified"

# Frontend build and cache clearing
echo "🔧 Building frontend..."
cd frontend

# Clear cache
print_status "Clearing cache..."
npm cache clean --force
rm -rf node_modules/.cache
rm -rf dist

# Install dependencies
print_status "Installing dependencies..."
npm install

# Build frontend
print_status "Building frontend..."
npm run build

if [ $? -eq 0 ]; then
    print_status "Frontend build successful"
else
    print_error "Frontend build failed"
    exit 1
fi

cd ..

# Backend validation
echo "🔧 Validating backend..."
if [ -f "Dockerfile.simple" ]; then
    print_status "Backend Docker configuration found"
else
    print_error "Dockerfile.simple not found"
    exit 1
fi

# Railway deployment
echo "🚀 Deploying to Railway..."
print_warning "Make sure your Railway environment variables are set:"
echo "  - DB_HOST=interchange.proxy.rlwy.net"
echo "  - DB_PORT=45401"
echo "  - DB_NAME=railway"
echo "  - DB_USERNAME=postgres"
echo "  - DB_PASSWORD=BOreDfeaiQUZeSJCtAUELdcwDISAwkfA"
echo "  - JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random"
echo "  - APP_ENV=production"

echo ""
print_status "Backend ready for Railway deployment"

# Database check
echo "🗄️  Database setup reminder..."
print_warning "Don't forget to run the database initialization SQL in Railway Console:"
echo "  1. Go to Railway Console"
echo "  2. Connect to PostgreSQL"
echo "  3. Run the SQL from SETUP_GUIDE.md"

# Vercel deployment
echo "🌍 Vercel deployment..."
print_status "Frontend is configured for Vercel deployment"
print_warning "Vercel environment variables should be set:"
echo "  - VITE_API_URL=https://online-shop-production-1da0.up.railway.app/api"

# Final status
echo ""
echo "🎉 Deployment preparation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Push your changes to git repository"
echo "2. Railway will automatically deploy backend"
echo "3. Vercel will automatically deploy frontend"
echo "4. Run database initialization if not done yet"
echo ""
echo "🔗 Your URLs:"
echo "Frontend: https://online-shop-front-b01nq38pk-daniil-beliks-projects.vercel.app/"
echo "Backend:  https://online-shop-production-1da0.up.railway.app/api"
echo ""
echo "🧪 Test your deployment:"
echo "curl https://online-shop-production-1da0.up.railway.app/api/health" 