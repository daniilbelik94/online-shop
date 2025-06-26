<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation - #<?= htmlspecialchars($order['order_number'] ?? 'N/A') ?></title>
    <style>
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        line-height: 1.6;
        color: #333333;
        background-color: #f8f9fa;
    }

    .email-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    }

    .header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 40px 30px;
        text-align: center;
        color: white;
    }

    .header h1 {
        font-size: 28px;
        margin-bottom: 10px;
        font-weight: 300;
    }

    .header .subtitle {
        font-size: 16px;
        opacity: 0.9;
    }

    .content {
        padding: 40px 30px;
    }

    .order-info {
        background-color: #f8f9fa;
        border-radius: 8px;
        padding: 25px;
        margin-bottom: 30px;
        border-left: 4px solid #667eea;
    }

    .order-info h2 {
        color: #667eea;
        margin-bottom: 15px;
        font-size: 20px;
    }

    .order-details {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 15px;
    }

    .detail-item {
        flex: 1;
        min-width: 200px;
    }

    .detail-label {
        font-weight: 600;
        color: #666;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .detail-value {
        font-size: 16px;
        color: #333;
        margin-top: 2px;
    }

    .items-section h3 {
        color: #333;
        margin-bottom: 20px;
        font-size: 18px;
        border-bottom: 2px solid #eee;
        padding-bottom: 10px;
    }

    .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 0;
        border-bottom: 1px solid #eee;
    }

    .item:last-child {
        border-bottom: none;
    }

    .item-info {
        flex: 1;
    }

    .item-name {
        font-weight: 600;
        color: #333;
        margin-bottom: 5px;
    }

    .item-details {
        font-size: 14px;
        color: #666;
    }

    .item-price {
        font-weight: 600;
        color: #667eea;
        font-size: 16px;
    }

    .summary {
        background-color: #f8f9fa;
        border-radius: 8px;
        padding: 20px;
        margin-top: 30px;
    }

    .summary-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
    }

    .summary-row.total {
        border-top: 2px solid #667eea;
        margin-top: 10px;
        padding-top: 15px;
        font-weight: 600;
        font-size: 18px;
        color: #667eea;
    }

    .next-steps {
        background-color: #e8f4fd;
        border-radius: 8px;
        padding: 25px;
        margin-top: 30px;
        border: 1px solid #b3d9f2;
    }

    .next-steps h3 {
        color: #1976d2;
        margin-bottom: 15px;
    }

    .next-steps ul {
        list-style: none;
        padding-left: 0;
    }

    .next-steps li {
        margin-bottom: 8px;
        padding-left: 20px;
        position: relative;
    }

    .next-steps li:before {
        content: "✓";
        color: #4caf50;
        font-weight: bold;
        position: absolute;
        left: 0;
    }

    .footer {
        background-color: #2c3e50;
        color: white;
        text-align: center;
        padding: 30px;
    }

    .footer h3 {
        margin-bottom: 15px;
        color: #ecf0f1;
    }

    .footer p {
        margin-bottom: 10px;
        opacity: 0.8;
    }

    .social-links {
        margin-top: 20px;
    }

    .social-links a {
        color: #ecf0f1;
        text-decoration: none;
        margin: 0 10px;
        opacity: 0.8;
    }

    .social-links a:hover {
        opacity: 1;
    }

    @media (max-width: 600px) {
        .email-container {
            margin: 0;
            border-radius: 0;
        }

        .header,
        .content,
        .footer {
            padding: 20px;
        }

        .order-details {
            flex-direction: column;
        }

        .detail-item {
            margin-bottom: 15px;
        }

        .item {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
        }
    }
    </style>
</head>

<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <h1>Order Confirmed!</h1>
            <p class="subtitle">Thank you for your purchase</p>
        </div>

        <!-- Content -->
        <div class="content">
            <!-- Order Information -->
            <div class="order-info">
                <h2>Order Details</h2>
                <div class="order-details">
                    <div class="detail-item">
                        <div class="detail-label">Order Number</div>
                        <div class="detail-value">#<?= htmlspecialchars($order['order_number'] ?? 'N/A') ?></div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Order Date</div>
                        <div class="detail-value">
                            <?= htmlspecialchars(date('F j, Y', strtotime($order['created_at'] ?? 'now'))) ?></div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">Total Amount</div>
                        <div class="detail-value">$<?= number_format($order['total_amount'] ?? 0, 2) ?></div>
                    </div>
                </div>
            </div>

            <!-- Order Items -->
            <?php if (!empty($order['items'])): ?>
            <div class="items-section">
                <h3>Items Ordered</h3>
                <?php foreach ($order['items'] as $item): ?>
                <div class="item">
                    <div class="item-info">
                        <div class="item-name"><?= htmlspecialchars($item['product_name'] ?? 'Unknown Product') ?></div>
                        <div class="item-details">
                            Quantity: <?= intval($item['quantity'] ?? 1) ?>
                            <?php if (!empty($item['product_sku'])): ?>
                            • SKU: <?= htmlspecialchars($item['product_sku']) ?>
                            <?php endif; ?>
                        </div>
                    </div>
                    <div class="item-price">
                        $<?= number_format(($item['price'] ?? 0) * ($item['quantity'] ?? 1), 2) ?>
                    </div>
                </div>
                <?php endforeach; ?>
            </div>
            <?php endif; ?>

            <!-- Order Summary -->
            <div class="summary">
                <div class="summary-row">
                    <span>Subtotal</span>
                    <span>$<?= number_format($order['subtotal'] ?? ($order['total_amount'] ?? 0) - ($order['shipping_cost'] ?? 0) - ($order['tax_amount'] ?? 0), 2) ?></span>
                </div>
                <?php if (!empty($order['shipping_cost']) && $order['shipping_cost'] > 0): ?>
                <div class="summary-row">
                    <span>Shipping (<?= htmlspecialchars($order['shipping_method'] ?? 'Standard') ?>)</span>
                    <span>$<?= number_format($order['shipping_cost'], 2) ?></span>
                </div>
                <?php else: ?>
                <div class="summary-row">
                    <span>Shipping</span>
                    <span>Free</span>
                </div>
                <?php endif; ?>
                <?php if (!empty($order['tax_amount']) && $order['tax_amount'] > 0): ?>
                <div class="summary-row">
                    <span>Tax</span>
                    <span>$<?= number_format($order['tax_amount'], 2) ?></span>
                </div>
                <?php endif; ?>
                <div class="summary-row total">
                    <span>Total</span>
                    <span>$<?= number_format($order['total_amount'] ?? 0, 2) ?></span>
                </div>
            </div>

            <!-- Shipping Address -->
            <?php if (!empty($order['shipping_address'])): ?>
            <div class="order-info">
                <h2>Shipping Address</h2>
                <div style="white-space: pre-line;"><?= htmlspecialchars($order['shipping_address']) ?></div>
            </div>
            <?php endif; ?>

            <!-- Next Steps -->
            <div class="next-steps">
                <h3>What's Next?</h3>
                <ul>
                    <li>We're processing your order and will send updates via email</li>
                    <li>You'll receive a shipping confirmation when your order ships</li>
                    <li>Track your order status in your account dashboard</li>
                    <li>Need help? Contact our support team anytime</li>
                </ul>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <h3>Thank You for Your Order!</h3>
            <p>We appreciate your business and hope you love your purchase.</p>
            <p>If you have any questions, please don't hesitate to contact us.</p>

            <div class="social-links">
                <a href="#">Support</a> |
                <a href="#">Track Order</a> |
                <a href="#">Return Policy</a>
            </div>
        </div>
    </div>
</body>

</html>