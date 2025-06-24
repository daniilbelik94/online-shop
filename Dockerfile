# Simple Railway-compatible build
FROM node:20-alpine as frontend-build

WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --only=production --silent
COPY frontend/ .
RUN npm run build

# Backend stage
FROM php:8.3-apache

# Install dependencies quickly
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev libpng-dev libonig-dev libxml2-dev zip unzip \
    && docker-php-ext-install -j$(nproc) pdo pdo_pgsql mbstring gd \
    && a2enmod rewrite headers \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy and install backend dependencies
COPY backend/composer*.json ./
RUN composer install --no-dev --optimize-autoloader --no-scripts
COPY backend/ .
RUN composer dump-autoload --optimize

# Copy frontend build
COPY --from=frontend-build /app/frontend/dist ./public/frontend

# Set permissions
RUN mkdir -p public/uploads && \
    chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html

# Configure Apache
RUN sed -i 's|/var/www/html|/var/www/html/public|g' /etc/apache2/sites-available/000-default.conf

# Create .htaccess file
RUN echo 'RewriteEngine On\n\
RewriteCond %{REQUEST_URI} ^/api/\n\
RewriteCond %{REQUEST_FILENAME} !-f\n\
RewriteCond %{REQUEST_FILENAME} !-d\n\
RewriteRule ^(.*)$ index.php [QSA,L]\n\
RewriteCond %{REQUEST_URI} !^/api/\n\
RewriteCond %{REQUEST_URI} !^/uploads/\n\
RewriteCond %{REQUEST_FILENAME} !-f\n\
RewriteCond %{REQUEST_FILENAME} !-d\n\
RewriteRule ^(.*)$ frontend/index.html [QSA,L]\n\
Header always set Access-Control-Allow-Origin "*"\n\
Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"\n\
Header always set Access-Control-Allow-Headers "Content-Type, Authorization"' > /var/www/html/public/.htaccess

EXPOSE 80
CMD ["apache2-foreground"] 