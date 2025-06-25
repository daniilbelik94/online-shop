<?php
// Debug file to check environment variables on Railway

header('Content-Type: application/json');

echo json_encode([
    'APP_ENV' => $_ENV['APP_ENV'] ?? 'not-set',
    'DATABASE_URL_exists' => isset($_ENV['DATABASE_URL']),
    'DATABASE_URL_preview' => isset($_ENV['DATABASE_URL']) ? substr($_ENV['DATABASE_URL'], 0, 30) . '...' : 'not-set',
    'DB_HOST' => $_ENV['DB_HOST'] ?? 'not-set',
    'DB_NAME' => $_ENV['DB_NAME'] ?? 'not-set',
    'all_env_vars' => array_keys($_ENV)
], JSON_PRETTY_PRINT);
