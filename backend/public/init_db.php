<?php
// Temporary Database Initialization Script
// Visit: https://online-shop-production-1da0.up.railway.app/init_db.php

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Load environment variables
$envFile = __DIR__ . '/../../.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($name, $value) = explode('=', $line, 2);
        $_ENV[trim($name)] = trim($value);
    }
}

try {
    // Database connection
    $dsn = sprintf(
        'pgsql:host=%s;port=%s;dbname=%s',
        $_ENV['DB_HOST'] ?? 'db',
        $_ENV['DB_PORT'] ?? '5432',
        $_ENV['DB_NAME'] ?? $_ENV['DB_DATABASE'] ?? 'railway'
    );

    echo "<h1>🚀 Database Initialization</h1>";
    echo "<p>Connecting to database...</p>";

    $pdo = new PDO($dsn, $_ENV['DB_USERNAME'] ?? '', $_ENV['DB_PASSWORD'] ?? '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    echo "<p>✅ Connected successfully!</p>";

    // SQL commands
    $sqls = [
        // Enable UUID extension
        'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"',

        // Create users table
        'CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            first_name VARCHAR(50),
            last_name VARCHAR(50),
            phone VARCHAR(20),
            role VARCHAR(20) DEFAULT \'customer\',
            is_active BOOLEAN DEFAULT TRUE,
            is_email_verified BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )',

        // Create categories table
        'CREATE TABLE IF NOT EXISTS categories (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name VARCHAR(100) NOT NULL,
            slug VARCHAR(100) UNIQUE NOT NULL,
            description TEXT,
            parent_id UUID REFERENCES categories(id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )',

        // Create products table
        'CREATE TABLE IF NOT EXISTS products (
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
            images JSONB DEFAULT \'[]\',
            is_active BOOLEAN DEFAULT TRUE,
            is_featured BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )',

        // Create cart table
        'CREATE TABLE IF NOT EXISTS cart (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID REFERENCES users(id) ON DELETE CASCADE,
            product_id UUID REFERENCES products(id) ON DELETE CASCADE,
            quantity INTEGER NOT NULL DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(user_id, product_id)
        )',

        // Insert admin user
        'INSERT INTO users (username, email, password_hash, first_name, last_name, role, is_active, is_email_verified)
         VALUES (\'admin\', \'admin@example.com\', \'$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi\', \'Admin\', \'User\', \'admin\', TRUE, TRUE)
         ON CONFLICT (email) DO NOTHING',

        // Insert categories
        'INSERT INTO categories (name, slug, description) VALUES
         (\'Electronics\', \'electronics\', \'Electronic devices and gadgets\'),
         (\'Clothing\', \'clothing\', \'Fashion and apparel\'),
         (\'Books\', \'books\', \'Books and literature\'),
         (\'Home & Garden\', \'home-garden\', \'Home and garden products\')
         ON CONFLICT (slug) DO NOTHING'
    ];

    // Execute table creation
    foreach ($sqls as $sql) {
        try {
            $pdo->exec($sql);
            echo "<p>✅ Executed: " . substr($sql, 0, 50) . "...</p>";
        } catch (Exception $e) {
            echo "<p>⚠️ Error: " . $e->getMessage() . "</p>";
        }
    }

    // Insert products (separate because of category reference)
    $products = [
        [
            'name' => 'iPhone 15 Pro',
            'slug' => 'iphone-15-pro',
            'description' => 'Latest iPhone with advanced features and titanium design. Features cutting-edge camera system and powerful A17 Pro chip.',
            'short_description' => 'Apple iPhone 15 Pro',
            'price' => 999.99,
            'brand' => 'Apple',
            'sku' => 'IPH15PRO',
            'stock_quantity' => 50,
            'is_featured' => true,
            'image_url' => 'https://via.placeholder.com/400x400/007ACC/FFFFFF?text=iPhone+15+Pro'
        ],
        [
            'name' => 'MacBook Air M3',
            'slug' => 'macbook-air-m3',
            'description' => 'Powerful laptop with M3 chip, perfect for professionals and students. Lightweight design with exceptional performance.',
            'short_description' => 'Apple MacBook Air with M3',
            'price' => 1299.99,
            'brand' => 'Apple',
            'sku' => 'MBA-M3',
            'stock_quantity' => 25,
            'is_featured' => true,
            'image_url' => 'https://via.placeholder.com/400x400/007ACC/FFFFFF?text=MacBook+Air+M3'
        ],
        [
            'name' => 'Nike Air Max',
            'slug' => 'nike-air-max',
            'description' => 'Comfortable running shoes with innovative Air Max technology. Perfect for daily wear and sports activities.',
            'short_description' => 'Nike Air Max sneakers',
            'price' => 129.99,
            'brand' => 'Nike',
            'sku' => 'NAM-001',
            'stock_quantity' => 100,
            'is_featured' => false,
            'image_url' => 'https://via.placeholder.com/400x400/FF6B35/FFFFFF?text=Nike+Air+Max'
        ],
        [
            'name' => 'Samsung Galaxy S24',
            'slug' => 'samsung-galaxy-s24',
            'description' => 'Latest Samsung flagship with advanced camera and AI features. Premium Android experience with stunning display.',
            'short_description' => 'Samsung Galaxy S24',
            'price' => 899.99,
            'brand' => 'Samsung',
            'sku' => 'SGS24',
            'stock_quantity' => 40,
            'is_featured' => true,
            'image_url' => 'https://via.placeholder.com/400x400/1428A0/FFFFFF?text=Galaxy+S24'
        ],
        [
            'name' => 'Atomic Habits Book',
            'slug' => 'atomic-habits',
            'description' => 'Life-changing book by James Clear about building good habits and breaking bad ones. Essential read for personal development.',
            'short_description' => 'Bestselling habits book',
            'price' => 18.99,
            'brand' => 'Penguin Random House',
            'sku' => 'AH-001',
            'stock_quantity' => 200,
            'is_featured' => true,
            'image_url' => 'https://via.placeholder.com/400x400/28A745/FFFFFF?text=Atomic+Habits'
        ],
        [
            'name' => 'Dyson V15 Vacuum',
            'slug' => 'dyson-v15-vacuum',
            'description' => 'Advanced cordless vacuum with laser dust detection. Revolutionary cleaning technology for modern homes.',
            'short_description' => 'High-tech cordless vacuum',
            'price' => 749.99,
            'brand' => 'Dyson',
            'sku' => 'DV15',
            'stock_quantity' => 30,
            'is_featured' => true,
            'image_url' => 'https://via.placeholder.com/400x400/6F42C1/FFFFFF?text=Dyson+V15'
        ]
    ];

    // Get category IDs
    $categories = [
        'electronics' => null,
        'clothing' => null,
        'books' => null,
        'home-garden' => null
    ];

    $stmt = $pdo->query("SELECT id, slug FROM categories");
    while ($row = $stmt->fetch()) {
        $categories[$row['slug']] = $row['id'];
    }

    // Insert products
    $productInsert = $pdo->prepare("
        INSERT INTO products (name, slug, description, short_description, price, category_id, brand, sku, stock_quantity, is_active, is_featured, image_url)
        VALUES (:name, :slug, :description, :short_description, :price, :category_id, :brand, :sku, :stock_quantity, true, :is_featured, :image_url)
        ON CONFLICT (slug) DO NOTHING
    ");

    foreach ($products as $product) {
        $category_id = null;
        if ($product['slug'] == 'nike-air-max') {
            $category_id = $categories['clothing'];
        } elseif ($product['slug'] == 'atomic-habits') {
            $category_id = $categories['books'];
        } elseif ($product['slug'] == 'dyson-v15-vacuum') {
            $category_id = $categories['home-garden'];
        } else {
            $category_id = $categories['electronics'];
        }

        $productInsert->execute([
            'name' => $product['name'],
            'slug' => $product['slug'],
            'description' => $product['description'],
            'short_description' => $product['short_description'],
            'price' => $product['price'],
            'category_id' => $category_id,
            'brand' => $product['brand'],
            'sku' => $product['sku'],
            'stock_quantity' => $product['stock_quantity'],
            'is_featured' => $product['is_featured'],
            'image_url' => $product['image_url']
        ]);
        echo "<p>✅ Added product: " . $product['name'] . "</p>";
    }

    echo "<h2>🎉 Database initialization completed successfully!</h2>";
    echo "<p><strong>What was created:</strong></p>";
    echo "<ul>";
    echo "<li>✅ Users table with admin user (admin@example.com / password)</li>";
    echo "<li>✅ Categories table with 4 categories</li>";
    echo "<li>✅ Products table with 6 sample products</li>";
    echo "<li>✅ Cart table for shopping cart functionality</li>";
    echo "</ul>";

    echo "<h3>🔗 Next steps:</h3>";
    echo "<p>1. Visit your frontend: <a href='https://online-shop-front-b01nq38pk-daniil-beliks-projects.vercel.app/' target='_blank'>https://online-shop-front-b01nq38pk-daniil-beliks-projects.vercel.app/</a></p>";
    echo "<p>2. Test API: <a href='https://online-shop-production-1da0.up.railway.app/api/products' target='_blank'>https://online-shop-production-1da0.up.railway.app/api/products</a></p>";
    echo "<p>3. Login as admin: admin@example.com / password</p>";

    echo "<p><strong style='color: red;'>⚠️ IMPORTANT: Delete this file after use for security!</strong></p>";
} catch (Exception $e) {
    echo "<h2>❌ Error occurred:</h2>";
    echo "<p style='color: red;'>" . $e->getMessage() . "</p>";
    echo "<p>Please check your database credentials in Railway environment variables.</p>";
}
