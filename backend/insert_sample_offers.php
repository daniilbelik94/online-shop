<?php
require_once __DIR__ . '/vendor/autoload.php';

// Database configuration
$config = require __DIR__ . '/config/local.php';
$dbConfig = $config['database'];

try {
    $pdo = new PDO(
        "pgsql:host={$dbConfig['host']};port={$dbConfig['port']};dbname={$dbConfig['name']}",
        $dbConfig['username'],
        $dbConfig['password']
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Sample offers data
    $offers = [
        [
            'title' => 'Flash Sale: Electronics Up to 50% Off!',
            'description' => 'Limited time flash sale on all electronics. Get amazing discounts on smartphones, laptops, and accessories.',
            'type' => 'flash',
            'discount_percent' => 50,
            'min_order_amount' => 100,
            'max_discount_amount' => 500,
            'is_active' => 1,
            'is_limited' => 1,
            'max_uses' => 100,
            'used_count' => 0,
            'start_date' => date('Y-m-d H:i:s'),
            'end_date' => date('Y-m-d H:i:s', strtotime('+24 hours')),
            'image_url' => 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
            'conditions' => json_encode(['electronics_category' => true])
        ],
        [
            'title' => 'Weekend Special: Fashion & Beauty',
            'description' => 'Weekend special discounts on fashion items, beauty products, and accessories.',
            'type' => 'weekend',
            'discount_percent' => 30,
            'min_order_amount' => 50,
            'max_discount_amount' => 200,
            'is_active' => 1,
            'is_limited' => 0,
            'max_uses' => null,
            'used_count' => 0,
            'start_date' => date('Y-m-d H:i:s', strtotime('friday this week')),
            'end_date' => date('Y-m-d H:i:s', strtotime('sunday this week +23:59:59')),
            'image_url' => 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
            'conditions' => json_encode(['fashion_category' => true])
        ],
        [
            'title' => 'Student Discount: 20% Off Everything',
            'description' => 'Exclusive student discount on all products. Valid student ID required.',
            'type' => 'student',
            'discount_percent' => 20,
            'min_order_amount' => 25,
            'max_discount_amount' => 100,
            'is_active' => 1,
            'is_limited' => 1,
            'max_uses' => 500,
            'used_count' => 0,
            'start_date' => date('Y-m-d H:i:s'),
            'end_date' => date('Y-m-d H:i:s', strtotime('+30 days')),
            'image_url' => 'https://images.unsplash.com/photo-1523050854058-8df90110c9a1?w=400&h=300&fit=crop',
            'conditions' => json_encode(['student_verification' => true])
        ],
        [
            'title' => 'Clearance Sale: Up to 70% Off',
            'description' => 'Massive clearance sale on selected items. Prices slashed up to 70% off original prices.',
            'type' => 'clearance',
            'discount_percent' => 70,
            'min_order_amount' => 0,
            'max_discount_amount' => null,
            'is_active' => 1,
            'is_limited' => 0,
            'max_uses' => null,
            'used_count' => 0,
            'start_date' => date('Y-m-d H:i:s'),
            'end_date' => date('Y-m-d H:i:s', strtotime('+7 days')),
            'image_url' => 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&h=300&fit=crop',
            'conditions' => json_encode(['clearance_items' => true])
        ],
        [
            'title' => 'New Arrivals: 15% Off First Purchase',
            'description' => 'Get 15% off on all new arrivals. Be the first to try our latest products.',
            'type' => 'new',
            'discount_percent' => 15,
            'min_order_amount' => 75,
            'max_discount_amount' => 150,
            'is_active' => 1,
            'is_limited' => 1,
            'max_uses' => 200,
            'used_count' => 0,
            'start_date' => date('Y-m-d H:i:s'),
            'end_date' => date('Y-m-d H:i:s', strtotime('+14 days')),
            'image_url' => 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
            'conditions' => json_encode(['new_products' => true])
        ]
    ];

    // Insert offers
    $stmt = $pdo->prepare("
        INSERT INTO offers (
            title, description, type, discount_percent, min_order_amount, 
            max_discount_amount, is_active, is_limited, max_uses, used_count,
            start_date, end_date, image_url, conditions,
            created_at, updated_at
        ) VALUES (
            :title, :description, :type, :discount_percent, :min_order_amount,
            :max_discount_amount, :is_active, :is_limited, :max_uses, :used_count,
            :start_date, :end_date, :image_url, :conditions,
            NOW(), NOW()
        )
    ");

    foreach ($offers as $offer) {
        $stmt->execute($offer);
    }

    echo "✅ Successfully inserted " . count($offers) . " sample offers!\n";
    echo "You can now test the offers page at: http://localhost:5173/offers\n";
} catch (PDOException $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
