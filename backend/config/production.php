<?php
// Production configuration with environment variables

// Parse DATABASE_URL if available (Railway format)
$databaseUrl = $_ENV['DATABASE_URL'] ?? null;
$dbConfig = [
    'host' => $_ENV['DB_HOST'] ?? 'localhost',
    'port' => $_ENV['DB_PORT'] ?? '5432',
    'name' => $_ENV['DB_NAME'] ?? $_ENV['DB_DATABASE'] ?? 'ecommerce',
    'username' => $_ENV['DB_USERNAME'] ?? 'postgres',
    'password' => $_ENV['DB_PASSWORD'] ?? 'postgres'
];

if ($databaseUrl) {
    $parsed = parse_url($databaseUrl);
    if ($parsed) {
        $dbConfig = [
            'host' => $parsed['host'] ?? 'localhost',
            'port' => $parsed['port'] ?? '5432',
            'name' => ltrim($parsed['path'] ?? '/ecommerce', '/'),
            'username' => $parsed['user'] ?? 'postgres',
            'password' => $parsed['pass'] ?? 'postgres'
        ];
    }
}

return [
    'database' => $dbConfig,
    'app' => [
        'env' => $_ENV['APP_ENV'] ?? 'production',
        'debug' => ($_ENV['APP_DEBUG'] ?? 'false') === 'true',
        'jwt_secret' => $_ENV['JWT_SECRET'] ?? 'default-secret-change-me',
        'jwt_expiration' => (int)($_ENV['JWT_EXPIRATION'] ?? 3600)
    ]
];
