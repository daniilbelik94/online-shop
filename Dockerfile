# Multi-stage build for Railway
FROM node:20-slim as frontend-build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --only=production
COPY frontend/ .
RUN npm run build

# Backend stage
FROM php:8.3-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpq-dev \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip

# Clear cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd

# Enable Apache modules
RUN a2enmod rewrite headers

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy backend files
COPY backend/ .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Copy frontend build
COPY --from=frontend-build /app/frontend/dist ./public/frontend

# Create uploads directory
RUN mkdir -p public/uploads && chmod 755 public/uploads

# Set proper permissions
RUN chown -R www-data:www-data /var/www/html && chmod -R 755 /var/www/html

# Configure Apache DocumentRoot to serve from public directory
RUN sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf
RUN sed -i 's|/var/www/|/var/www/html/public/|g' /etc/apache2/apache2.conf

# Create .htaccess for URL rewriting and CORS
RUN echo "RewriteEngine On\n\
# Handle API routes\n\
RewriteCond %{REQUEST_URI} ^/api/\n\
RewriteCond %{REQUEST_FILENAME} !-f\n\
RewriteCond %{REQUEST_FILENAME} !-d\n\
RewriteRule ^(.*)$ index.php [QSA,L]\n\
\n\
# Handle frontend routes (React Router)\n\
RewriteCond %{REQUEST_URI} !^/api/\n\
RewriteCond %{REQUEST_URI} !^/uploads/\n\
RewriteCond %{REQUEST_FILENAME} !-f\n\
RewriteCond %{REQUEST_FILENAME} !-d\n\
RewriteRule ^(.*)$ frontend/index.html [QSA,L]\n\
\n\
# CORS headers\n\
Header always set Access-Control-Allow-Origin \"*\"\n\
Header always set Access-Control-Allow-Methods \"GET, POST, PUT, DELETE, OPTIONS\"\n\
Header always set Access-Control-Allow-Headers \"Content-Type, Authorization\"\n\
\n\
# Handle preflight requests\n\
RewriteCond %{REQUEST_METHOD} OPTIONS\n\
RewriteRule ^(.*)$ $1 [R=200,L]" > /var/www/html/public/.htaccess

EXPOSE 80

CMD ["apache2-foreground"] 