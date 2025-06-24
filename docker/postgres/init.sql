-- Amazon Clone Database Schema
-- This script initializes the database with all necessary tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create database
CREATE DATABASE ecommerce;

-- Connect to the database
\c ecommerce;

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
    stock_status VARCHAR(20) DEFAULT 'in_stock',
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    category_id UUID REFERENCES categories(id),
    brand VARCHAR(255),
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
INSERT INTO products (name, slug, description, short_description, sku, price, compare_price, stock_quantity, is_featured, category_id, brand) VALUES
-- Electronics
('iPhone 15 Pro', 'iphone-15-pro', 'The iPhone 15 Pro features a titanium design, advanced camera system with 5x optical zoom, and the powerful A17 Pro chip. Experience professional photography with ProRAW and ProRes capabilities, all in a lightweight, durable frame.', 'Premium smartphone with cutting-edge technology', 'APPL-IPH15P-001', 999.99, 1099.99, 50, true, (SELECT id FROM categories WHERE slug = 'electronics'), 'Apple'),

('Samsung Galaxy S24 Ultra', 'samsung-galaxy-s24-ultra', 'Unleash your creativity with the Galaxy S24 Ultra. Featuring a 200MP camera with AI-enhanced photography, S Pen integration, and a brilliant 6.8-inch Dynamic AMOLED display. Perfect for productivity and entertainment.', 'Flagship Android smartphone with S Pen', 'SAMS-GS24U-001', 1199.99, 1299.99, 35, true, (SELECT id FROM categories WHERE slug = 'electronics'), 'Samsung'),

('MacBook Pro 14-inch M3', 'macbook-pro-14-m3', 'The MacBook Pro 14-inch with M3 chip delivers exceptional performance for professionals. Features a stunning Liquid Retina XDR display, up to 22 hours of battery life, and advanced connectivity options.', 'Professional laptop with M3 chip', 'APPL-MBP14-M3-001', 1999.99, 2199.99, 25, true, (SELECT id FROM categories WHERE slug = 'electronics'), 'Apple'),

('Sony WH-1000XM5', 'sony-wh1000xm5', 'Industry-leading noise canceling headphones with exceptional sound quality. Features 30-hour battery life, quick charge, and multipoint connection. Perfect for travel and daily use.', 'Premium noise-canceling headphones', 'SONY-WH1000XM5-001', 399.99, 449.99, 75, false, (SELECT id FROM categories WHERE slug = 'electronics'), 'Sony'),

('iPad Air 5th Gen', 'ipad-air-5th-gen', 'The iPad Air features the powerful M1 chip, a stunning 10.9-inch Liquid Retina display, and support for Apple Pencil (2nd generation). Perfect for creativity and productivity on the go.', 'Versatile tablet with M1 chip', 'APPL-IPAD-AIR5-001', 599.99, 649.99, 40, false, (SELECT id FROM categories WHERE slug = 'electronics'), 'Apple'),

('Dell XPS 13 Plus', 'dell-xps-13-plus', 'Ultra-thin laptop with InfinityEdge display and premium materials. Features 12th Gen Intel processors, exceptional build quality, and stunning visuals for professionals and creators.', 'Premium ultrabook laptop', 'DELL-XPS13P-001', 1299.99, 1399.99, 20, false, (SELECT id FROM categories WHERE slug = 'electronics'), 'Dell'),

('Nintendo Switch OLED', 'nintendo-switch-oled', 'Enhanced gaming experience with a vibrant 7-inch OLED screen, improved audio, and enhanced kickstand. Play at home or on-the-go with this versatile gaming console.', 'Handheld gaming console with OLED display', 'NINT-SWITCH-OLED-001', 349.99, 399.99, 60, true, (SELECT id FROM categories WHERE slug = 'electronics'), 'Nintendo'),

-- Clothing
('Nike Air Max 270', 'nike-air-max-270', 'Experience all-day comfort with the Air Max 270. Features Nike''s largest heel Air unit for exceptional cushioning and a sleek, modern design that transitions from gym to street.', 'Comfortable lifestyle sneakers', 'NIKE-AM270-001', 150.00, 180.00, 100, true, (SELECT id FROM categories WHERE slug = 'clothing'), 'Nike'),

('Levi''s 501 Original Jeans', 'levis-501-original-jeans', 'The original blue jean since 1873. Crafted with premium denim and a classic straight fit, these jeans are a timeless wardrobe staple that only gets better with age.', 'Classic straight-fit denim jeans', 'LEVI-501-001', 89.99, 99.99, 150, false, (SELECT id FROM categories WHERE slug = 'clothing'), 'Levi''s'),

('Adidas Ultraboost 22', 'adidas-ultraboost-22', 'Revolutionary running shoe with responsive BOOST midsole and Primeknit upper. Engineered for comfort and performance, perfect for daily runs and casual wear.', 'High-performance running shoes', 'ADID-UB22-001', 190.00, 220.00, 80, false, (SELECT id FROM categories WHERE slug = 'clothing'), 'Adidas'),

('Patagonia Down Jacket', 'patagonia-down-jacket', 'Lightweight, packable down jacket with 800-fill-power recycled down. Water-resistant shell and ethical sourcing make this perfect for outdoor adventures and urban exploration.', 'Lightweight packable down jacket', 'PATA-DOWN-001', 299.99, 329.99, 45, false, (SELECT id FROM categories WHERE slug = 'clothing'), 'Patagonia'),

('Ralph Lauren Polo Shirt', 'ralph-lauren-polo-shirt', 'Classic polo shirt crafted from soft cotton mesh. Features the iconic polo player emblem and timeless design that works for both casual and smart-casual occasions.', 'Classic cotton polo shirt', 'RL-POLO-001', 89.99, 109.99, 120, false, (SELECT id FROM categories WHERE slug = 'clothing'), 'Ralph Lauren'),

-- Books
('The Psychology of Money', 'psychology-of-money', 'Morgan Housel explores the strange ways people think about money and teaches you how to make better sense of one of life''s most important topics. A fascinating look at human behavior and financial decision-making.', 'Bestselling book on financial psychology', 'BOOK-POM-001', 16.99, 19.99, 200, true, (SELECT id FROM categories WHERE slug = 'books'), 'Harriman House'),

('Atomic Habits', 'atomic-habits', 'James Clear reveals practical strategies for forming good habits, breaking bad ones, and mastering the tiny behaviors that lead to remarkable results. A transformative approach to personal development.', 'Life-changing guide to building good habits', 'BOOK-AH-001', 18.99, 21.99, 180, true, (SELECT id FROM categories WHERE slug = 'books'), 'Avery'),

('The Midnight Library', 'midnight-library', 'Matt Haig''s philosophical novel about a magical library between life and death, where each book represents a different life you could have lived. A thought-provoking exploration of regret and possibility.', 'Philosophical fiction novel', 'BOOK-ML-001', 14.99, 17.99, 90, false, (SELECT id FROM categories WHERE slug = 'books'), 'Viking'),

('Sapiens: A Brief History', 'sapiens-brief-history', 'Yuval Noah Harari explores how Homo sapiens came to dominate the world. From the Stone Age to the present, this book challenges everything we thought we knew about being human.', 'Groundbreaking book on human history', 'BOOK-SAP-001', 19.99, 24.99, 150, false, (SELECT id FROM categories WHERE slug = 'books'), 'Harper'),

-- Home & Garden
('Dyson V15 Detect', 'dyson-v15-detect', 'Advanced cordless vacuum with laser dust detection and intelligent suction adjustment. Features powerful cyclone technology and versatile attachments for every cleaning task.', 'High-tech cordless vacuum cleaner', 'DYSON-V15-001', 749.99, 799.99, 30, true, (SELECT id FROM categories WHERE slug = 'home-garden'), 'Dyson'),

('Instant Pot Duo 7-in-1', 'instant-pot-duo-7in1', 'Multi-functional electric pressure cooker that replaces 7 kitchen appliances. Features smart programming, safety features, and the ability to cook meals 70% faster than traditional methods.', 'Multi-use electric pressure cooker', 'IP-DUO7-001', 99.99, 129.99, 85, false, (SELECT id FROM categories WHERE slug = 'home-garden'), 'Instant Pot'),

('Philips Hue Smart Bulbs', 'philips-hue-smart-bulbs', 'Transform your home with smart lighting that adapts to your lifestyle. Control with voice commands or smartphone app, choose from millions of colors, and create the perfect ambiance.', 'Smart LED light bulbs starter kit', 'PHIL-HUE-001', 199.99, 229.99, 70, false, (SELECT id FROM categories WHERE slug = 'home-garden'), 'Philips'),

('KitchenAid Stand Mixer', 'kitchenaid-stand-mixer', 'Iconic stand mixer with 10-speed control and tilt-head design. Includes dough hook, flat beater, and wire whip. Perfect for baking enthusiasts and professional chefs alike.', 'Professional-grade stand mixer', 'KA-MIXER-001', 379.99, 429.99, 25, false, (SELECT id FROM categories WHERE slug = 'home-garden'), 'KitchenAid'),

-- Sports
('Peloton Bike+', 'peloton-bike-plus', 'Premium indoor cycling bike with rotating HD touchscreen, immersive classes, and real-time performance tracking. Transform your home into a world-class fitness studio.', 'Smart indoor exercise bike', 'PELO-BIKEPLUS-001', 2495.00, 2695.00, 15, true, (SELECT id FROM categories WHERE slug = 'sports'), 'Peloton'),

('Yeti Rambler Tumbler', 'yeti-rambler-tumbler', 'Double-wall vacuum insulated tumbler that keeps drinks cold for hours and hot drinks steaming. Durable construction perfect for outdoor adventures and daily use.', 'Insulated stainless steel tumbler', 'YETI-RAMBLER-001', 39.99, 44.99, 200, false, (SELECT id FROM categories WHERE slug = 'sports'), 'Yeti'),

('Wilson Pro Staff Tennis Racket', 'wilson-pro-staff-tennis', 'Professional-grade tennis racket used by top players worldwide. Features precision engineering, optimal weight distribution, and exceptional control for serious tennis players.', 'Professional tennis racket', 'WILS-PROSTAFF-001', 249.99, 299.99, 40, false, (SELECT id FROM categories WHERE slug = 'sports'), 'Wilson'),

('Hydro Flask Water Bottle', 'hydro-flask-water-bottle', 'Double-wall vacuum insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours. BPA-free and perfect for outdoor activities and daily hydration.', 'Insulated stainless steel water bottle', 'HF-BOTTLE-001', 44.99, 49.99, 150, false, (SELECT id FROM categories WHERE slug = 'sports'), 'Hydro Flask'),

-- Beauty
('Dyson Airwrap Styler', 'dyson-airwrap-styler', 'Revolutionary hair styling tool that uses controlled airflow to curl, wave, smooth, and dry hair without extreme heat damage. Includes multiple attachments for versatile styling.', 'Multi-styling hair tool', 'DYSON-AIRWRAP-001', 599.99, 649.99, 35, true, (SELECT id FROM categories WHERE slug = 'beauty'), 'Dyson'),

('Fenty Beauty Foundation', 'fenty-beauty-foundation', 'Inclusive foundation with 50 shades for all skin tones. Provides buildable medium to full coverage with a natural finish that lasts all day without caking or fading.', 'Inclusive liquid foundation', 'FENTY-FOUND-001', 39.99, 44.99, 100, false, (SELECT id FROM categories WHERE slug = 'beauty'), 'Fenty Beauty'),

('The Ordinary Skincare Set', 'ordinary-skincare-set', 'Complete skincare routine with scientifically-backed ingredients. Includes cleanser, serums, and moisturizer for healthy, glowing skin at an affordable price point.', 'Complete skincare routine set', 'ORD-SKINCARE-001', 89.99, 109.99, 80, false, (SELECT id FROM categories WHERE slug = 'beauty'), 'The Ordinary'),

-- Automotive
('Tesla Model Y Floor Mats', 'tesla-model-y-floor-mats', 'Custom-fit all-weather floor mats designed specifically for Tesla Model Y. Made from premium materials with raised edges to protect your vehicle''s interior from dirt and moisture.', 'Custom-fit all-weather floor mats', 'TESLA-MATS-001', 199.99, 229.99, 60, false, (SELECT id FROM categories WHERE slug = 'automotive'), 'Tesla'),

('Garmin DriveSmart GPS', 'garmin-drivesmart-gps', 'Advanced GPS navigator with bright, easy-to-read display and voice-activated navigation. Features real-time traffic updates, smart notifications, and driver alerts for safer driving.', 'Advanced GPS navigation system', 'GARM-GPS-001', 249.99, 299.99, 45, false, (SELECT id FROM categories WHERE slug = 'automotive'), 'Garmin'),

-- Toys & Games
('LEGO Creator Expert Set', 'lego-creator-expert-set', 'Challenging building set for adult fans of LEGO. Features intricate details, advanced building techniques, and makes an impressive display piece when completed. Perfect for relaxation and creativity.', 'Advanced LEGO building set for adults', 'LEGO-CREATOR-001', 299.99, 349.99, 30, false, (SELECT id FROM categories WHERE slug = 'toys-games'), 'LEGO'),

('Nintendo Switch Pro Controller', 'nintendo-switch-pro-controller', 'Premium wireless controller with traditional button layout, precision controls, and HD rumble. Features motion controls, built-in amiibo functionality, and 40-hour battery life.', 'Premium wireless game controller', 'NINT-PROCON-001', 69.99, 79.99, 90, false, (SELECT id FROM categories WHERE slug = 'toys-games'), 'Nintendo'),

-- Health
('Fitbit Charge 5', 'fitbit-charge-5', 'Advanced fitness tracker with built-in GPS, heart rate monitoring, and stress management tools. Features 6+ day battery life, sleep tracking, and smartphone notifications.', 'Advanced fitness and health tracker', 'FITB-CHARGE5-001', 199.99, 229.99, 85, false, (SELECT id FROM categories WHERE slug = 'health'), 'Fitbit'),

('Vitamix Blender', 'vitamix-blender', 'Professional-grade blender with aircraft-grade stainless steel blades. Perfect for smoothies, soups, nut butters, and more. Features variable speed control and self-cleaning program.', 'High-performance blender', 'VITA-BLEND-001', 449.99, 499.99, 40, false, (SELECT id FROM categories WHERE slug = 'health'), 'Vitamix'),

-- Office
('Herman Miller Aeron Chair', 'herman-miller-aeron-chair', 'Iconic ergonomic office chair with advanced PostureFit SL back support. Features breathable mesh design, adjustable armrests, and tilt mechanisms for all-day comfort and productivity.', 'Premium ergonomic office chair', 'HM-AERON-001', 1395.00, 1495.00, 20, true, (SELECT id FROM categories WHERE slug = 'office'), 'Herman Miller'),

('Apple Studio Display', 'apple-studio-display', '27-inch 5K Retina display with exceptional color accuracy and brightness. Features built-in camera, microphones, and speakers. Perfect for creative professionals and productivity.', '27-inch 5K professional display', 'APPL-STUDIO-001', 1599.99, 1699.99, 25, false, (SELECT id FROM categories WHERE slug = 'office'), 'Apple');

-- Insert sample product images
INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
-- iPhone 15 Pro images
((SELECT id FROM products WHERE slug = 'iphone-15-pro'), 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=600&fit=crop', 'iPhone 15 Pro front view', 1, true),
((SELECT id FROM products WHERE slug = 'iphone-15-pro'), 'https://images.unsplash.com/photo-1695048071356-8c7e4d0e3c96?w=800&h=600&fit=crop', 'iPhone 15 Pro back view', 2, false),
((SELECT id FROM products WHERE slug = 'iphone-15-pro'), 'https://images.unsplash.com/photo-1695048071356-8c7e4d0e3c96?w=800&h=600&fit=crop&crop=top', 'iPhone 15 Pro side view', 3, false),

-- Samsung Galaxy S24 Ultra images
((SELECT id FROM products WHERE slug = 'samsung-galaxy-s24-ultra'), 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=600&fit=crop', 'Samsung Galaxy S24 Ultra front', 1, true),
((SELECT id FROM products WHERE slug = 'samsung-galaxy-s24-ultra'), 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&h=600&fit=crop', 'Samsung Galaxy S24 Ultra with S Pen', 2, false),

-- MacBook Pro images
((SELECT id FROM products WHERE slug = 'macbook-pro-14-m3'), 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=600&fit=crop', 'MacBook Pro 14-inch open', 1, true),
((SELECT id FROM products WHERE slug = 'macbook-pro-14-m3'), 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop', 'MacBook Pro 14-inch closed', 2, false),

-- Sony headphones
((SELECT id FROM products WHERE slug = 'sony-wh1000xm5'), 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=600&fit=crop', 'Sony WH-1000XM5 headphones', 1, true),
((SELECT id FROM products WHERE slug = 'sony-wh1000xm5'), 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&h=600&fit=crop', 'Sony WH-1000XM5 folded', 2, false),

-- Nike Air Max 270
((SELECT id FROM products WHERE slug = 'nike-air-max-270'), 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=600&fit=crop', 'Nike Air Max 270 side view', 1, true),
((SELECT id FROM products WHERE slug = 'nike-air-max-270'), 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&h=600&fit=crop', 'Nike Air Max 270 top view', 2, false),

-- Dyson V15
((SELECT id FROM products WHERE slug = 'dyson-v15-detect'), 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop', 'Dyson V15 Detect vacuum', 1, true),
((SELECT id FROM products WHERE slug = 'dyson-v15-detect'), 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop', 'Dyson V15 with attachments', 2, false),

-- Books (using book cover images)
((SELECT id FROM products WHERE slug = 'psychology-of-money'), 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=600&fit=crop', 'The Psychology of Money book cover', 1, true),
((SELECT id FROM products WHERE slug = 'atomic-habits'), 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop', 'Atomic Habits book cover', 1, true),
((SELECT id FROM products WHERE slug = 'midnight-library'), 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop', 'The Midnight Library book cover', 1, true),
((SELECT id FROM products WHERE slug = 'sapiens-brief-history'), 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&h=600&fit=crop', 'Sapiens book cover', 1, true),

-- Add more images for other products
((SELECT id FROM products WHERE slug = 'peloton-bike-plus'), 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop', 'Peloton Bike+ in home gym', 1, true),
((SELECT id FROM products WHERE slug = 'dyson-airwrap-styler'), 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&h=600&fit=crop', 'Dyson Airwrap with attachments', 1, true),
((SELECT id FROM products WHERE slug = 'herman-miller-aeron-chair'), 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop', 'Herman Miller Aeron chair', 1, true),
((SELECT id FROM products WHERE slug = 'ipad-air-5th-gen'), 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&h=600&fit=crop', 'iPad Air 5th generation', 1, true),
((SELECT id FROM products WHERE slug = 'nintendo-switch-oled'), 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=600&fit=crop', 'Nintendo Switch OLED', 1, true);

-- Insert sample users
INSERT INTO users (username, email, password_hash, first_name, last_name, is_staff, is_superuser) VALUES
('admin', 'admin@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', true, true),
('testuser', 'test@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Test', 'User', false, false),
('testadmin', 'testadmin@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Test', 'Admin', true, false);

-- Create indexes for better performance
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