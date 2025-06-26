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
        'expiration' => 3600 // 1 hour
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
    'app' => [
        'env' => 'development',
        'name' => 'Online Shop',
        'url' => 'http://localhost:5173',
        'debug' => true,
        'jwt_secret' => 'your-super-secret-jwt-key-here-make-it-long-and-random'
    ]
];
