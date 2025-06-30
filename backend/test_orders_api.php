<?php
// Test script to check orders API

require_once __DIR__ . '/vendor/autoload.php';

try {
    // Database connection
    $pdo = new PDO('pgsql:host=localhost;port=5432;dbname=amazon_clone', 'postgres', 'postgres');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Get admin user
    $stmt = $pdo->query("SELECT id, username, email FROM users WHERE is_staff = true OR is_superuser = true LIMIT 1");
    $adminUser = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$adminUser) {
        echo "No admin user found.\n";
        exit(1);
    }

    echo "Admin user: {$adminUser['username']} ({$adminUser['email']})\n";

    // Get orders count
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM orders");
    $orderCount = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "Total orders in database: {$orderCount['count']}\n";

    // Get sample orders with user info
    $stmt = $pdo->query("
        SELECT 
            o.id,
            o.order_number,
            o.status,
            o.payment_status,
            o.total_amount,
            o.created_at,
            u.first_name,
            u.last_name,
            u.email
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        LIMIT 5
    ");

    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo "\nSample orders:\n";
    foreach ($orders as $order) {
        $userName = $order['first_name'] && $order['last_name']
            ? $order['first_name'] . ' ' . $order['last_name']
            : 'Unknown User';
        echo "- {$order['order_number']}: {$userName} ({$order['email']}) - {$order['status']} - \${$order['total_amount']}\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}
