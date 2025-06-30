<?php
// Local development configuration for PostgreSQL

return [
    'database' => [
        'host' => $_ENV['DB_HOST'] ?? 'localhost',
        'port' => $_ENV['DB_PORT'] ?? '5432',
        'name' => $_ENV['DB_NAME'] ?? 'amazon_clone',
        'username' => $_ENV['DB_USERNAME'] ?? 'postgres',
        'password' => $_ENV['DB_PASSWORD'] ?? 'postgres'
    ],
    'jwt' => [
        'secret' => $_ENV['JWT_SECRET'] ?? 'your-super-secret-jwt-key-change-this-in-production',
        'issuer' => $_ENV['JWT_ISSUER'] ?? 'amazon-clone-api',
        'audience' => $_ENV['JWT_AUDIENCE'] ?? 'amazon-clone-frontend',
        'expiration' => (int)($_ENV['JWT_EXPIRATION'] ?? 86400) // 24 hours (24 * 60 * 60)
    ],
    'email' => [
        'smtp_host' => $_ENV['SMTP_HOST'] ?? 'localhost',
        'smtp_port' => (int)($_ENV['SMTP_PORT'] ?? 587),
        'smtp_username' => $_ENV['SMTP_USERNAME'] ?? '',
        'smtp_password' => $_ENV['SMTP_PASSWORD'] ?? '',
        'smtp_secure' => $_ENV['SMTP_SECURE'] ?? 'tls', // tls, ssl, or false
        'from_email' => $_ENV['FROM_EMAIL'] ?? 'noreply@localhost.com',
        'from_name' => $_ENV['FROM_NAME'] ?? 'Online Shop',
        'use_smtp' => ($_ENV['USE_SMTP'] ?? 'false') === 'true', // Set to true to use SMTP, false to use PHP mail()
    ],
    'stripe' => [
        'secret_key' => $_ENV['STRIPE_SECRET_KEY'] ?? 'sk_test_your_stripe_secret_key_here',
        'publishable_key' => $_ENV['STRIPE_PUBLISHABLE_KEY'] ?? 'pk_test_your_stripe_publishable_key_here',
        'webhook_secret' => $_ENV['STRIPE_WEBHOOK_SECRET'] ?? '', // Add webhook secret if needed
    ],
    'app' => [
        'env' => $_ENV['APP_ENV'] ?? 'development',
        'name' => $_ENV['APP_NAME'] ?? 'Online Shop',
        'url' => $_ENV['APP_URL'] ?? 'http://localhost:5173',
        'debug' => ($_ENV['APP_DEBUG'] ?? 'true') === 'true',
        'jwt_secret' => $_ENV['JWT_SECRET'] ?? 'your-super-secret-jwt-key-here-make-it-long-and-random',
        'jwt_expiration' => (int)($_ENV['JWT_EXPIRATION'] ?? 86400) // 24 hours - for fallback
    ]
];
