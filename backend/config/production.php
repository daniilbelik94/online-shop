<?php
// Production configuration with environment variables

return [
    'database' => [
        'host' => $_ENV['DB_HOST'] ?? 'localhost',
        'port' => $_ENV['DB_PORT'] ?? '5432',
        'name' => $_ENV['DB_NAME'] ?? $_ENV['DB_DATABASE'] ?? 'ecommerce',
        'username' => $_ENV['DB_USERNAME'] ?? 'postgres',
        'password' => $_ENV['DB_PASSWORD'] ?? 'postgres'
    ],
    'app' => [
        'env' => $_ENV['APP_ENV'] ?? 'production',
        'debug' => ($_ENV['APP_DEBUG'] ?? 'false') === 'true',
        'jwt_secret' => $_ENV['JWT_SECRET'] ?? 'default-secret-change-me',
        'jwt_expiration' => (int)($_ENV['JWT_EXPIRATION'] ?? 3600)
    ]
];
