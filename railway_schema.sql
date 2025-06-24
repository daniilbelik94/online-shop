-- Railway Database Schema Setup
-- Run this SQL in your Railway PostgreSQL database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    is_staff BOOLEAN DEFAULT false,
    is_superuser BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    short_description TEXT,
    sku VARCHAR(100) UNIQUE NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    compare_price DECIMAL(10,2),
    weight DECIMAL(8,3),
    dimensions VARCHAR(100),
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 10,
    manage_stock BOOLEAN DEFAULT true,
    stock_status VARCHAR(20) DEFAULT 'in_stock',
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    category_id UUID REFERENCES categories(id),
    brand VARCHAR(255),
    images TEXT[], -- Array of image URLs
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create product_images table for multiple images per product
CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create cart table
CREATE TABLE cart (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(255), -- For guest users
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create cart_items table
CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID REFERENCES cart(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    price DECIMAL(10,2) NOT NULL, -- Store price at time of adding
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(cart_id, product_id)
);

-- Create orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    shipping_address TEXT,
    billing_address TEXT,
    payment_method VARCHAR(50),
    payment_status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create order_items table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample categories
INSERT INTO categories (name, slug, description) VALUES
('Electronics', 'electronics', 'Latest electronic gadgets and devices'),
('Clothing', 'clothing', 'Fashion and apparel for all occasions'),
('Books', 'books', 'Books, magazines, and educational materials'),
('Home & Garden', 'home-garden', 'Everything for your home and garden'),
('Sports', 'sports', 'Sports equipment and fitness gear'),
('Beauty', 'beauty', 'Beauty and personal care products'),
('Automotive', 'automotive', 'Car accessories and automotive products'),
('Toys & Games', 'toys-games', 'Toys, games, and entertainment'),
('Health', 'health', 'Health and wellness products'),
('Office', 'office', 'Office supplies and equipment');

-- Insert sample products
INSERT INTO products (name, slug, description, short_description, sku, price, compare_price, stock_quantity, is_featured, category_id, brand, images) VALUES
-- Electronics
('iPhone 15 Pro', 'iphone-15-pro', 'The iPhone 15 Pro features a titanium design, advanced camera system with 5x optical zoom, and the powerful A17 Pro chip.', 'Premium smartphone with cutting-edge technology', 'APPL-IPH15P-001', 999.99, 1099.99, 50, true, (SELECT id FROM categories WHERE slug = 'electronics'), 'Apple', '{"https://via.placeholder.com/400x400?text=iPhone+15+Pro"}'),

('Samsung Galaxy S24 Ultra', 'samsung-galaxy-s24-ultra', 'Unleash your creativity with the Galaxy S24 Ultra. Featuring a 200MP camera with AI-enhanced photography.', 'Flagship Android smartphone with S Pen', 'SAMS-GS24U-001', 1199.99, 1299.99, 35, true, (SELECT id FROM categories WHERE slug = 'electronics'), 'Samsung', '{"https://via.placeholder.com/400x400?text=Galaxy+S24+Ultra"}'),

('MacBook Pro 14-inch M3', 'macbook-pro-14-m3', 'The MacBook Pro 14-inch with M3 chip delivers exceptional performance for professionals.', 'Professional laptop with M3 chip', 'APPL-MBP14-M3-001', 1999.99, 2199.99, 25, true, (SELECT id FROM categories WHERE slug = 'electronics'), 'Apple', '{"https://via.placeholder.com/400x400?text=MacBook+Pro+M3"}'),

('Sony WH-1000XM5', 'sony-wh1000xm5', 'Industry-leading noise canceling headphones with exceptional sound quality.', 'Premium noise-canceling headphones', 'SONY-WH1000XM5-001', 399.99, 449.99, 75, false, (SELECT id FROM categories WHERE slug = 'electronics'), 'Sony', '{"https://via.placeholder.com/400x400?text=Sony+WH-1000XM5"}'),

('iPad Air 5th Gen', 'ipad-air-5th-gen', 'The iPad Air features the powerful M1 chip and stunning 10.9-inch Liquid Retina display.', 'Versatile tablet with M1 chip', 'APPL-IPAD-AIR5-001', 599.99, 649.99, 40, false, (SELECT id FROM categories WHERE slug = 'electronics'), 'Apple', '{"https://via.placeholder.com/400x400?text=iPad+Air"}'),

-- Clothing
('Nike Air Max 270', 'nike-air-max-270', 'Experience all-day comfort with the Air Max 270 featuring Nike''s largest heel Air unit.', 'Comfortable lifestyle sneakers', 'NIKE-AM270-001', 150.00, 180.00, 100, true, (SELECT id FROM categories WHERE slug = 'clothing'), 'Nike', '{"https://via.placeholder.com/400x400?text=Nike+Air+Max+270"}'),

('Levi''s 501 Original Jeans', 'levis-501-original-jeans', 'The original blue jean since 1873. Crafted with premium denim and classic straight fit.', 'Classic straight-fit denim jeans', 'LEVI-501-001', 89.99, 99.99, 150, false, (SELECT id FROM categories WHERE slug = 'clothing'), 'Levi''s', '{"https://via.placeholder.com/400x400?text=Levis+501"}'),

('Adidas Ultraboost 22', 'adidas-ultraboost-22', 'Revolutionary running shoe with responsive BOOST midsole and Primeknit upper.', 'High-performance running shoes', 'ADID-UB22-001', 190.00, 220.00, 80, false, (SELECT id FROM categories WHERE slug = 'clothing'), 'Adidas', '{"https://via.placeholder.com/400x400?text=Ultraboost+22"}'),

-- Books
('The Psychology of Money', 'psychology-of-money', 'Morgan Housel explores the strange ways people think about money and financial decision-making.', 'Bestselling book on financial psychology', 'BOOK-POM-001', 16.99, 19.99, 200, true, (SELECT id FROM categories WHERE slug = 'books'), 'Harriman House', '{"https://via.placeholder.com/400x400?text=Psychology+of+Money"}'),

('Atomic Habits', 'atomic-habits', 'James Clear reveals practical strategies for forming good habits and breaking bad ones.', 'Life-changing guide to building good habits', 'BOOK-AH-001', 18.99, 21.99, 180, true, (SELECT id FROM categories WHERE slug = 'books'), 'Avery', '{"https://via.placeholder.com/400x400?text=Atomic+Habits"}'),

-- Home & Garden
('Dyson V15 Detect', 'dyson-v15-detect', 'Advanced cordless vacuum with laser dust detection and intelligent suction adjustment.', 'High-tech cordless vacuum cleaner', 'DYSON-V15-001', 749.99, 799.99, 30, true, (SELECT id FROM categories WHERE slug = 'home-garden'), 'Dyson', '{"https://via.placeholder.com/400x400?text=Dyson+V15"}'),

('Instant Pot Duo 7-in-1', 'instant-pot-duo-7in1', 'Multi-functional electric pressure cooker that replaces 7 kitchen appliances.', 'Multi-use electric pressure cooker', 'IP-DUO7-001', 99.99, 129.99, 85, false, (SELECT id FROM categories WHERE slug = 'home-garden'), 'Instant Pot', '{"https://via.placeholder.com/400x400?text=Instant+Pot"}'),

-- Sports
('Yeti Rambler Tumbler', 'yeti-rambler-tumbler', 'Double-wall vacuum insulated tumbler that keeps drinks cold for hours.', 'Insulated stainless steel tumbler', 'YETI-RAMBLER-001', 39.99, 44.99, 200, false, (SELECT id FROM categories WHERE slug = 'sports'), 'Yeti', '{"https://via.placeholder.com/400x400?text=Yeti+Rambler"}'),

('Hydro Flask Water Bottle', 'hydro-flask-water-bottle', 'Double-wall vacuum insulated water bottle perfect for outdoor activities.', 'Insulated stainless steel water bottle', 'HF-BOTTLE-001', 44.99, 49.99, 150, false, (SELECT id FROM categories WHERE slug = 'sports'), 'Hydro Flask', '{"https://via.placeholder.com/400x400?text=Hydro+Flask"}'),

-- Beauty
('Dyson Airwrap Styler', 'dyson-airwrap-styler', 'Revolutionary hair styling tool that uses controlled airflow without extreme heat damage.', 'Multi-styling hair tool', 'DYSON-AIRWRAP-001', 599.99, 649.99, 35, true, (SELECT id FROM categories WHERE slug = 'beauty'), 'Dyson', '{"https://via.placeholder.com/400x400?text=Dyson+Airwrap"}');

-- Create admin user
INSERT INTO users (username, email, password_hash, first_name, last_name, is_staff, is_superuser) VALUES
('admin', 'admin@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', true, true);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active ON products(is_active);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_product_images_product ON product_images(product_id);
CREATE INDEX idx_cart_user ON cart(user_id);
CREATE INDEX idx_cart_session ON cart(session_id);
CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX idx_cart_items_product ON cart_items(product_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_order_items_order ON order_items(order_id); 