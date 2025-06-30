<?php
// Script to insert sample orders for testing

require_once __DIR__ . '/vendor/autoload.php';

try {
    // Database connection
    $pdo = new PDO('pgsql:host=localhost;port=5432;dbname=amazon_clone', 'postgres', 'postgres');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // First, let's check if we have any users
    $stmt = $pdo->query("SELECT id, username, email FROM users LIMIT 1");
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo "No users found. Please create a user first.\n";
        exit(1);
    }

    echo "Using user: {$user['username']} ({$user['email']})\n";

    // Sample orders data
    $sampleOrders = [
        [
            'order_number' => 'ORD-2024-000001',
            'status' => 'pending',
            'payment_status' => 'pending',
            'payment_method' => 'credit_card',
            'shipping_method' => 'standard',
            'tax_amount' => 25.50,
            'shipping_cost' => 9.99,
            'discount_amount' => 0,
            'total_amount' => 335.48,
            'shipping_address' => '123 Main St, New York, NY 10001, USA',
            'billing_address' => '123 Main St, New York, NY 10001, USA',
            'customer_notes' => 'Please deliver in the morning',
            'created_at' => date('Y-m-d H:i:s', strtotime('-5 days'))
        ],
        [
            'order_number' => 'ORD-2024-000002',
            'status' => 'processing',
            'payment_status' => 'paid',
            'payment_method' => 'paypal',
            'shipping_method' => 'express',
            'tax_amount' => 12.75,
            'shipping_cost' => 19.99,
            'discount_amount' => 10.00,
            'total_amount' => 172.73,
            'shipping_address' => '456 Oak Ave, Los Angeles, CA 90210, USA',
            'billing_address' => '456 Oak Ave, Los Angeles, CA 90210, USA',
            'customer_notes' => 'Gift for birthday',
            'created_at' => date('Y-m-d H:i:s', strtotime('-3 days'))
        ],
        [
            'order_number' => 'ORD-2024-000003',
            'status' => 'shipped',
            'payment_status' => 'paid',
            'payment_method' => 'credit_card',
            'shipping_method' => 'standard',
            'tax_amount' => 7.65,
            'shipping_cost' => 9.99,
            'discount_amount' => 0,
            'total_amount' => 107.63,
            'shipping_address' => '789 Pine St, Chicago, IL 60601, USA',
            'billing_address' => '789 Pine St, Chicago, IL 60601, USA',
            'customer_notes' => '',
            'created_at' => date('Y-m-d H:i:s', strtotime('-2 days')),
            'shipped_at' => date('Y-m-d H:i:s', strtotime('-1 day'))
        ],
        [
            'order_number' => 'ORD-2024-000004',
            'status' => 'delivered',
            'payment_status' => 'paid',
            'payment_method' => 'bank_transfer',
            'shipping_method' => 'overnight',
            'tax_amount' => 51.00,
            'shipping_cost' => 29.99,
            'discount_amount' => 50.00,
            'total_amount' => 630.98,
            'shipping_address' => '321 Elm St, Miami, FL 33101, USA',
            'billing_address' => '321 Elm St, Miami, FL 33101, USA',
            'customer_notes' => 'Business delivery',
            'created_at' => date('Y-m-d H:i:s', strtotime('-7 days')),
            'shipped_at' => date('Y-m-d H:i:s', strtotime('-6 days')),
            'delivered_at' => date('Y-m-d H:i:s', strtotime('-5 days'))
        ]
    ];

    // Insert orders
    $orderStmt = $pdo->prepare("
        INSERT INTO orders (
            user_id, order_number, status, payment_status, payment_method, 
            shipping_method, shipping_cost, tax_amount, 
            discount_amount, total_amount, shipping_address, billing_address, 
            customer_notes, created_at, shipped_at, delivered_at
        ) VALUES (
            :user_id, :order_number, :status, :payment_status, :payment_method,
            :shipping_method, :shipping_cost, :tax_amount,
            :discount_amount, :total_amount, :shipping_address, :billing_address,
            :customer_notes, :created_at, :shipped_at, :delivered_at
        ) RETURNING id
    ");

    // Sample order items
    $sampleItems = [
        [
            'product_name' => 'MacBook Pro 14" M3',
            'quantity' => 1,
            'price' => 299.99
        ],
        [
            'product_name' => 'iPhone 15 Pro',
            'quantity' => 1,
            'price' => 149.99
        ],
        [
            'product_name' => 'AirPods Pro',
            'quantity' => 1,
            'price' => 89.99
        ],
        [
            'product_name' => 'iPad Air 5th Gen',
            'quantity' => 1,
            'price' => 599.99
        ],
        [
            'product_name' => 'Apple Watch Series 9',
            'quantity' => 1,
            'price' => 199.99
        ]
    ];

    $orderItemStmt = $pdo->prepare("
        INSERT INTO order_items (
            order_id, product_id, quantity, price
        ) VALUES (
            :order_id, :product_id, :quantity, :price
        )
    ");

    // Get a sample product for order items
    $productStmt = $pdo->query("SELECT id FROM products LIMIT 1");
    $product = $productStmt->fetch(PDO::FETCH_ASSOC);

    if (!$product) {
        echo "No products found. Please create products first.\n";
        exit(1);
    }

    $insertedCount = 0;
    foreach ($sampleOrders as $orderData) {
        try {
            $orderStmt->execute([
                'user_id' => $user['id'],
                'order_number' => $orderData['order_number'],
                'status' => $orderData['status'],
                'payment_status' => $orderData['payment_status'],
                'payment_method' => $orderData['payment_method'],
                'shipping_method' => $orderData['shipping_method'],
                'shipping_cost' => $orderData['shipping_cost'],
                'tax_amount' => $orderData['tax_amount'],
                'discount_amount' => $orderData['discount_amount'],
                'total_amount' => $orderData['total_amount'],
                'shipping_address' => $orderData['shipping_address'],
                'billing_address' => $orderData['billing_address'],
                'customer_notes' => $orderData['customer_notes'],
                'created_at' => $orderData['created_at'],
                'shipped_at' => $orderData['shipped_at'] ?? null,
                'delivered_at' => $orderData['delivered_at'] ?? null
            ]);

            $orderId = $orderStmt->fetchColumn();

            // Insert order item
            $orderItemStmt->execute([
                'order_id' => $orderId,
                'product_id' => $product['id'],
                'quantity' => $sampleItems[$insertedCount]['quantity'],
                'price' => $sampleItems[$insertedCount]['price']
            ]);

            echo "Inserted order: {$orderData['order_number']}\n";
            $insertedCount++;
        } catch (PDOException $e) {
            if ($e->getCode() == 23505) { // Unique constraint violation
                echo "Order {$orderData['order_number']} already exists, skipping...\n";
            } else {
                echo "Error inserting order {$orderData['order_number']}: " . $e->getMessage() . "\n";
            }
        }
    }

    echo "\nSuccessfully inserted {$insertedCount} sample orders.\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
