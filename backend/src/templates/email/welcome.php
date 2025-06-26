<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Your Store</title>
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
            padding: 50px 30px;
            text-align: center;
            color: white;
        }

        .header h1 {
            font-size: 32px;
            margin-bottom: 15px;
            font-weight: 300;
        }

        .header .subtitle {
            font-size: 18px;
            opacity: 0.9;
        }

        .welcome-icon {
            width: 80px;
            height: 80px;
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 30px;
            font-size: 40px;
        }

        .content {
            padding: 50px 30px;
        }

        .greeting {
            text-align: center;
            margin-bottom: 40px;
        }

        .greeting h2 {
            color: #333;
            font-size: 28px;
            margin-bottom: 15px;
            font-weight: 300;
        }

        .greeting p {
            font-size: 18px;
            color: #666;
            line-height: 1.8;
        }

        .features {
            background-color: #f8f9fa;
            border-radius: 12px;
            padding: 40px 30px;
            margin: 40px 0;
        }

        .features h3 {
            color: #333;
            margin-bottom: 30px;
            text-align: center;
            font-size: 24px;
        }

        .feature-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
        }

        .feature-item {
            text-align: center;
        }

        .feature-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 15px;
            color: white;
            font-size: 24px;
        }

        .feature-title {
            font-weight: 600;
            color: #333;
            margin-bottom: 8px;
            font-size: 16px;
        }

        .feature-description {
            color: #666;
            font-size: 14px;
            line-height: 1.5;
        }

        .cta-section {
            text-align: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 12px;
            padding: 40px 30px;
            margin: 40px 0;
        }

        .cta-section h3 {
            font-size: 24px;
            margin-bottom: 15px;
            font-weight: 300;
        }

        .cta-section p {
            font-size: 16px;
            margin-bottom: 30px;
            opacity: 0.9;
        }

        .cta-button {
            display: inline-block;
            background-color: white;
            color: #667eea;
            padding: 15px 40px;
            text-decoration: none;
            border-radius: 30px;
            font-weight: 600;
            font-size: 16px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            transition: transform 0.3s ease;
        }

        .cta-button:hover {
            transform: translateY(-2px);
        }

        .tips {
            background-color: #e8f4fd;
            border-radius: 12px;
            padding: 30px;
            margin: 40px 0;
            border: 1px solid #b3d9f2;
        }

        .tips h3 {
            color: #1976d2;
            margin-bottom: 20px;
            text-align: center;
        }

        .tips ul {
            list-style: none;
            padding: 0;
        }

        .tips li {
            padding: 12px 0;
            padding-left: 30px;
            position: relative;
            border-bottom: 1px solid rgba(25, 118, 210, 0.1);
        }

        .tips li:last-child {
            border-bottom: none;
        }

        .tips li:before {
            content: "💡";
            position: absolute;
            left: 0;
            top: 12px;
        }

        .footer {
            background-color: #2c3e50;
            color: white;
            text-align: center;
            padding: 40px 30px;
        }

        .footer h3 {
            margin-bottom: 20px;
            color: #ecf0f1;
            font-size: 20px;
        }

        .footer p {
            margin-bottom: 15px;
            opacity: 0.8;
            line-height: 1.6;
        }

        .footer-links {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .footer-links a {
            color: #ecf0f1;
            text-decoration: none;
            margin: 0 15px;
            opacity: 0.8;
            font-size: 14px;
        }

        .footer-links a:hover {
            opacity: 1;
            text-decoration: underline;
        }

        @media (max-width: 600px) {
            .email-container {
                margin: 0;
                border-radius: 0;
            }

            .header,
            .content,
            .footer {
                padding: 30px 20px;
            }

            .feature-list {
                grid-template-columns: 1fr;
                gap: 20px;
            }

            .cta-section {
                padding: 30px 20px;
            }

            .tips {
                padding: 20px;
            }
        }
    </style>
</head>

<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="welcome-icon">👋</div>
            <h1>Welcome!</h1>
            <p class="subtitle">You're now part of our community</p>
        </div>

        <!-- Content -->
        <div class="content">
            <!-- Greeting -->
            <div class="greeting">
                <h2>Hello <?= htmlspecialchars($user['first_name'] ?? 'there') ?>!</h2>
                <p>
                    Welcome to our store! We're thrilled to have you join our community of satisfied customers.
                    Your account has been successfully created and you're ready to start exploring our amazing products.
                </p>
            </div>

            <!-- Features -->
            <div class="features">
                <h3>What You Can Do Now</h3>
                <div class="feature-list">
                    <div class="feature-item">
                        <div class="feature-icon">🛍️</div>
                        <div class="feature-title">Shop Products</div>
                        <div class="feature-description">Browse our extensive catalog of quality products with detailed descriptions and reviews.</div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">🛒</div>
                        <div class="feature-title">Easy Checkout</div>
                        <div class="feature-description">Secure checkout process with multiple payment options and fast shipping.</div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">📦</div>
                        <div class="feature-title">Track Orders</div>
                        <div class="feature-description">Keep track of your orders from purchase to delivery with real-time updates.</div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">⭐</div>
                        <div class="feature-title">Exclusive Deals</div>
                        <div class="feature-description">Get access to member-only discounts and special promotional offers.</div>
                    </div>
                </div>
            </div>

            <!-- Call to Action -->
            <div class="cta-section">
                <h3>Ready to Start Shopping?</h3>
                <p>Discover thousands of products carefully selected just for you!</p>
                <a href="#" class="cta-button">Start Shopping Now</a>
            </div>

            <!-- Tips -->
            <div class="tips">
                <h3>Pro Tips for the Best Experience</h3>
                <ul>
                    <li>Complete your profile to get personalized product recommendations</li>
                    <li>Add items to your wishlist to save them for later</li>
                    <li>Enable notifications to stay updated on order status and special offers</li>
                    <li>Check out our customer reviews to make informed purchasing decisions</li>
                    <li>Contact our support team anytime if you need assistance</li>
                </ul>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <h3>We're Here to Help!</h3>
            <p>
                If you have any questions or need assistance, our friendly customer support team
                is here to help you 24/7. Don't hesitate to reach out!
            </p>
            <p>
                <strong>Customer Support:</strong> support@yourstore.com<br>
                <strong>Phone:</strong> 1-800-SHOP-NOW
            </p>

            <div class="footer-links">
                <a href="#">Shop Now</a>
                <a href="#">Help Center</a>
                <a href="#">Account Settings</a>
                <a href="#">Contact Us</a>
                <a href="#">Privacy Policy</a>
            </div>
        </div>
    </div>
</body>

</html>