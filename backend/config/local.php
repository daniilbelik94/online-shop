<?php
// Local development configuration for Docker PostgreSQL

return [
    'database' => [
        'host' => 'db',  // Docker service name
        'port' => '5432',
        'name' => 'ecommerce',
        'username' => 'postgres',
        'password' => 'postgres'
    ],
    'app' => [
        'env' => 'development',
        'jwt_secret' => 'your-super-secret-jwt-key-here-make-it-long-and-random'
    ]
];