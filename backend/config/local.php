<?php
// Local development configuration for PostgreSQL

return [
    'database' => [
        'host' => 'localhost',  // Local connection
        'port' => '5432',
        'name' => 'amazon_clone',
        'username' => 'postgres',
        'password' => 'postgres'
    ],
    'jwt' => [
        'secret' => 'your-super-secret-jwt-key-change-this-in-production',
        'issuer' => 'amazon-clone-api',
        'audience' => 'amazon-clone-frontend',
        'expiration' => 86400 // 24 hours (24 * 60 * 60)
    ],
    'email' => [
        'smtp_host' => 'localhost',
        'smtp_port' => 587,
        'smtp_username' => '',
        'smtp_password' => '',
        'smtp_secure' => 'tls', // tls, ssl, or false
        'from_email' => 'noreply@localhost.com',
        'from_name' => 'Online Shop',
        'use_smtp' => false, // Set to true to use SMTP, false to use PHP mail()
    ],
    'stripe' => [
        'secret_key' => 'sk_test_51Rff8gQLCO1WKCZZTKxGrrLS9jYTFGeuSn5mQm8njMvElxCsxIs9c3Q927kyHmyrk2EDE8ZUqlk4PDtd6k9aisjV00cmBMItqf',
        'publishable_key' => 'pk_test_51Rff8gQLCO1WKCZZ6fywgQWTJY6EbOXRsxGcp1PTTXjbw7GeFfFiNfsJVrIIyEGlyURV2xXHXmud4myEPkZOziId00H33hA0pR',
        'webhook_secret' => '', // Add webhook secret if needed
    ],
    'app' => [
        'env' => 'development',
        'name' => 'Online Shop',
        'url' => 'http://localhost:5173',
        'debug' => true,
        'jwt_secret' => 'your-super-secret-jwt-key-here-make-it-long-and-random',
        'jwt_expiration' => 86400 // 24 hours - for fallback
    ]
];
