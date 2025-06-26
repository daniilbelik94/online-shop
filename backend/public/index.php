<?php

// Start the PHP session early so controllers relying on \$_SESSION work correctly
session_start();

// Enable error reporting for development
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Autoload classes using Composer
require_once __DIR__ . '/../vendor/autoload.php';

// Load configuration
$appEnv = $_ENV['APP_ENV'] ?? 'development';

if ($appEnv === 'production') {
    // Production configuration with environment variables
    $productionConfigFile = __DIR__ . '/../config/production.php';
    if (file_exists($productionConfigFile)) {
        $config = require $productionConfigFile;
        // Environment variables are already loaded, config just provides fallbacks
    }

    // Debug: log environment variables for Railway
    error_log("APP_ENV: " . ($_ENV['APP_ENV'] ?? 'not-set'));
    error_log("DATABASE_URL exists: " . (isset($_ENV['DATABASE_URL']) ? 'yes' : 'no'));
    if (isset($_ENV['DATABASE_URL'])) {
        error_log("DATABASE_URL first 20 chars: " . substr($_ENV['DATABASE_URL'], 0, 20));
    }

    // Emergency debug output
    if (isset($_GET['debug'])) {
        header('Content-Type: application/json');
        echo json_encode([
            'APP_ENV' => $_ENV['APP_ENV'] ?? 'not-set',
            'DATABASE_URL_exists' => isset($_ENV['DATABASE_URL']),
            'DATABASE_URL_preview' => isset($_ENV['DATABASE_URL']) ? substr($_ENV['DATABASE_URL'], 0, 50) . '...' : 'not-set',
            'config_file_used' => $appEnv === 'production' ? 'production.php' : 'local.php'
        ], JSON_PRETTY_PRINT);
        exit;
    }
} else {
    // Local development configuration
    $localConfigFile = __DIR__ . '/../config/local.php';
    if (file_exists($localConfigFile)) {
        $config = require $localConfigFile;
        $_ENV['DB_HOST'] ??= $config['database']['host'];
        $_ENV['DB_PORT'] ??= $config['database']['port'];
        $_ENV['DB_NAME'] ??= $config['database']['name'];
        $_ENV['DB_USERNAME'] ??= $config['database']['username'];
        $_ENV['DB_PASSWORD'] ??= $config['database']['password'];
        $_ENV['JWT_SECRET'] ??= $config['app']['jwt_secret'];
        $_ENV['APP_ENV'] ??= $config['app']['env'];
    } else {
        // Load environment variables from .env file
        $envFile = __DIR__ . '/../../.env';
        if (file_exists($envFile)) {
            $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                if (strpos(trim($line), '#') === 0) continue;
                if (strpos($line, '=') === false) continue;
                list($name, $value) = explode('=', $line, 2);
                $_ENV[trim($name)] = trim($value);
            }
        }
    }
}

// CORS headers configuration
if ($appEnv === 'production') {
    // Production environment: Railway proxy already sets "Access-Control-Allow-Origin".
    // We avoid duplicating that header, but we still need to expose the custom
    // X-Session-ID header and allow credentials/methods so that the browser
    // passes the pre-flight check.

    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Session-ID');
} else {
    // Development environment: allow local dev servers
    $allowedOrigins = [
        'http://localhost:5173',
        'http://localhost:5175',
    ];

    if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
        header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
    } else {
        // Fallback for tools or other clients
        header('Access-Control-Allow-Origin: http://localhost:5173');
    }

    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Session-ID');
    header('Access-Control-Expose-Headers: Authorization');
}

header('Content-Type: application/json');

// Handle preflight OPTIONS requests
if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    // Database connection using config
    $dsn = sprintf(
        'pgsql:host=%s;port=%s;dbname=%s',
        $config['database']['host'],
        $config['database']['port'],
        $config['database']['name']
    );

    $pdo = new PDO($dsn, $config['database']['username'], $config['database']['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    // Dependency injection setup
    $userRepository = new \App\Infrastructure\Persistence\Postgres\PostgresUserRepository($pdo);
    $productRepository = new \App\Infrastructure\Persistence\Postgres\PostgresProductRepository($pdo);
    $categoryRepository = new \App\Infrastructure\Persistence\Postgres\PostgresCategoryRepository($pdo);
    $orderRepository = new \App\Infrastructure\Persistence\Postgres\PostgresOrderRepository($pdo);
    $wishlistRepository = new \App\Infrastructure\Persistence\Postgres\PostgresWishlistRepository($pdo);

    $emailService = new \App\Infrastructure\Service\EmailService($config);
    $userService = new \App\Application\Service\UserService($userRepository, $emailService);
    $productService = new \App\Application\Service\ProductService($productRepository);
    $categoryService = new \App\Application\Service\CategoryService($categoryRepository);
    $cartService = new \App\Application\Service\CartService($pdo, $productRepository, $userRepository);
    $orderService = new \App\Application\Service\OrderService($orderRepository, $productRepository, $userRepository, $cartService, $emailService);
    $wishlistService = new \App\Application\Service\WishlistService($wishlistRepository, $productRepository);

    $authService = new \App\Application\Service\AuthService(
        $userService,
        $config['app']['jwt_secret'] ?? 'your-super-secret-jwt-key-here-make-it-long-and-random',
        $config['app']['jwt_expiration'] ?? 3600
    );

    // Middleware
    $authMiddleware = new \App\Presentation\Middleware\AuthMiddleware($authService);

    // Controllers
    $authController = new \App\Presentation\Controller\AuthController($authService);
    $userController = new \App\Presentation\Controller\UserController($userService);
    $productController = new \App\Presentation\Controller\ProductController($productService, $categoryService);
    $adminProductController = new \App\Presentation\Controller\AdminProductController($productService, $authMiddleware);
    $cartController = new \App\Presentation\Controller\CartController($cartService, $authMiddleware);
    $orderController = new \App\Presentation\Controller\OrderController($orderService, $authMiddleware);
    $imageUploadController = new \App\Presentation\Controller\ImageUploadController();
    $userProfileController = new \App\Presentation\Controller\UserProfileController($authMiddleware);
    $wishlistController = new \App\Presentation\Controller\WishlistController($wishlistService, $authMiddleware);

    // Basic routing
    $requestUri = $_SERVER['REQUEST_URI'] ?? '/';
    $requestMethod = $_SERVER['REQUEST_METHOD'] ?? 'GET';

    // Remove query string from URI
    $uri = parse_url($requestUri, PHP_URL_PATH);

    // Route handling
    if (strpos($uri, '/api/') === 0) {
        $route = substr($uri, 4); // Remove /api prefix

        switch (true) {
            // Health check
            case $route === '/health' && $requestMethod === 'GET':
                http_response_code(200);
                echo json_encode([
                    'status' => 'healthy',
                    'timestamp' => date('Y-m-d H:i:s'),
                    'environment' => $_ENV['APP_ENV'] ?? 'development',
                    'database' => 'connected'
                ]);
                break;

            // Authentication endpoints
            case $route === '/auth/login' && $requestMethod === 'POST':
                $authController->login();
                break;

            case $route === '/auth/refresh' && $requestMethod === 'POST':
                $authController->refreshToken();
                break;

            // User registration (public)
            case $route === '/users' && $requestMethod === 'POST':
                $userController->register();
                break;

            // Protected user endpoints
            case $route === '/user/me' && $requestMethod === 'GET':
                $currentUser = $authMiddleware->handle();
                if ($currentUser) {
                    $userController->getCurrentUser($currentUser);
                }
                break;

            case $route === '/user/me' && $requestMethod === 'PUT':
                $currentUser = $authMiddleware->handle();
                if ($currentUser) {
                    $userController->updateCurrentUser($currentUser);
                }
                break;

            case $route === '/user/profile' && $requestMethod === 'GET':
                $currentUser = $authMiddleware->handle();
                if ($currentUser) {
                    $userController->getCurrentUser($currentUser);
                }
                break;

            case $route === '/user/profile' && $requestMethod === 'PUT':
                $currentUser = $authMiddleware->handle();
                if ($currentUser) {
                    $userController->updateCurrentUser($currentUser);
                }
                break;

            case $route === '/user/change-password' && $requestMethod === 'POST':
                $currentUser = $authMiddleware->handle();
                if ($currentUser) {
                    $userController->changePassword($currentUser);
                }
                break;

            case $route === '/user/orders' && $requestMethod === 'GET':
                $orderController->getMyOrders();
                break;

            case preg_match('/^\/user\/orders\/([^\/]+)$/', $route, $matches) && $requestMethod === 'GET':
                $orderController->getOrderById($matches[1]);
                break;

            // User profile data endpoints
            case $route === '/user/addresses' && $requestMethod === 'GET':
                $userProfileController->getAddresses();
                break;

            case $route === '/user/addresses' && $requestMethod === 'POST':
                $userProfileController->saveAddress();
                break;

            case $route === '/user/payment-methods' && $requestMethod === 'GET':
                $userProfileController->getPaymentMethods();
                break;

            case $route === '/user/payment-methods' && $requestMethod === 'POST':
                $userProfileController->savePaymentMethod();
                break;

            case $route === '/user/addresses/delete' && $requestMethod === 'POST':
                $userProfileController->deleteAddress();
                break;

            case $route === '/user/payment-methods/delete' && $requestMethod === 'POST':
                $userProfileController->deletePaymentMethod();
                break;

            // Wishlist endpoints
            case $route === '/user/wishlist' && $requestMethod === 'GET':
                $wishlistController->getWishlist();
                break;

            case $route === '/user/wishlist' && $requestMethod === 'POST':
                $wishlistController->addToWishlist();
                break;

            case preg_match('/^\/user\/wishlist\/([^\/]+)$/', $route, $matches) && $requestMethod === 'DELETE':
                $_REQUEST['product_id'] = $matches[1];
                $wishlistController->removeFromWishlist();
                break;

            case $route === '/user/wishlist/check' && $requestMethod === 'GET':
                $wishlistController->checkWishlist();
                break;

            case $route === '/user/wishlist/clear' && $requestMethod === 'DELETE':
                $wishlistController->clearWishlist();
                break;

            case $route === '/user/wishlist/count' && $requestMethod === 'GET':
                $wishlistController->getWishlistCount();
                break;

            // Admin endpoints
            case $route === '/admin/users' && $requestMethod === 'GET':
                $currentUser = $authMiddleware->handle('is_staff');
                if ($currentUser) {
                    $users = $userService->getAllUsers();
                    echo json_encode([
                        'data' => array_map(function ($user) {
                            return [
                                'id' => $user->getId(),
                                'username' => $user->getUsername(),
                                'email' => $user->getEmail(),
                                'first_name' => $user->getFirstName(),
                                'last_name' => $user->getLastName(),
                                'role' => $user->getRole(),
                                'is_active' => $user->isActive(),
                                'is_staff' => $user->getRole() === 'admin',
                                'email_verified' => $user->isEmailVerified(),
                                'created_at' => $user->getCreatedAt()->format('Y-m-d\TH:i:s\Z')
                            ];
                        }, $users)
                    ]);
                }
                break;

            case preg_match('/^\/admin\/users\/([^\/]+)$/', $route, $matches) && $requestMethod === 'PUT':
                $currentUser = $authMiddleware->handle('is_superuser');
                if ($currentUser) {
                    $userId = $matches[1];
                    $input = json_decode(file_get_contents('php://input'), true);

                    try {
                        if (isset($input['role'])) {
                            $userService->updateUserRole($userId, $input['role']);
                        }
                        if (isset($input['is_active'])) {
                            if ($input['is_active']) {
                                $userService->activateUser($userId);
                            } else {
                                $userService->deactivateUser($userId);
                            }
                        }
                        if (isset($input['first_name']) || isset($input['last_name'])) {
                            $userService->updateUserProfile(
                                $userId,
                                $input['first_name'] ?? '',
                                $input['last_name'] ?? '',
                                $input['phone'] ?? null
                            );
                        }

                        $user = $userService->getUserById($userId);
                        echo json_encode([
                            'id' => $user->getId(),
                            'username' => $user->getUsername(),
                            'email' => $user->getEmail(),
                            'first_name' => $user->getFirstName(),
                            'last_name' => $user->getLastName(),
                            'role' => $user->getRole(),
                            'is_active' => $user->isActive(),
                            'is_staff' => $user->getRole() === 'admin',
                            'email_verified' => $user->isEmailVerified(),
                            'created_at' => $user->getCreatedAt()->format('Y-m-d\TH:i:s\Z'),
                            'updated_at' => $user->getUpdatedAt()->format('Y-m-d\TH:i:s\Z')
                        ]);
                    } catch (\InvalidArgumentException $e) {
                        http_response_code(400);
                        echo json_encode(['error' => $e->getMessage()]);
                    }
                }
                break;

            // Admin product endpoints
            case $route === '/admin/products/stats' && $requestMethod === 'GET':
                $adminProductController->stats();
                break;

            case $route === '/admin/products/low-stock' && $requestMethod === 'GET':
                $adminProductController->lowStock();
                break;

            case $route === '/admin/products' && $requestMethod === 'GET':
                $adminProductController->index();
                break;

            case $route === '/admin/products' && $requestMethod === 'POST':
                $adminProductController->store();
                break;

            case preg_match('/^\/admin\/products\/([^\/]+)$/', $route, $matches) && $requestMethod === 'GET':
                $adminProductController->show($matches[1]);
                break;

            case preg_match('/^\/admin\/products\/([^\/]+)$/', $route, $matches) && $requestMethod === 'PUT':
                $adminProductController->update($matches[1]);
                break;

            case preg_match('/^\/admin\/products\/([^\/]+)$/', $route, $matches) && $requestMethod === 'DELETE':
                $adminProductController->destroy($matches[1]);
                break;

            case $route === '/admin/orders' && $requestMethod === 'GET':
                $orderController->getAllOrders();
                break;

            case $route === '/admin/orders/statistics' && $requestMethod === 'GET':
                $orderController->getOrderStatistics();
                break;

            case preg_match('/^\/admin\/orders\/([^\/]+)\/status$/', $route, $matches) && $requestMethod === 'PUT':
                $orderController->updateOrderStatus($matches[1]);
                break;

            case preg_match('/^\/admin\/orders\/([^\/]+)\/payment-status$/', $route, $matches) && $requestMethod === 'PUT':
                $orderController->updatePaymentStatus($matches[1]);
                break;

            // Public product endpoints
            case $route === '/products' && $requestMethod === 'GET':
                $productController->index();
                break;

            case $route === '/products/search' && $requestMethod === 'GET':
                $productController->search();
                break;

            case $route === '/products/recommended' && $requestMethod === 'GET':
                $productController->recommended();
                break;

            case $route === '/products/featured' && $requestMethod === 'GET':
                $productController->featured();
                break;

            case preg_match('/^\/products\/([^\/]+)$/', $route, $matches) && $requestMethod === 'GET':
                $productController->show($matches[1]);
                break;

            case $route === '/categories' && $requestMethod === 'GET':
                $productController->categories();
                break;

            // Order endpoints
            case $route === '/orders' && $requestMethod === 'GET':
                $orderController->getMyOrders();
                break;

            case $route === '/orders' && $requestMethod === 'POST':
                $orderController->createOrder();
                break;

            case preg_match('/^\/orders\/([^\/]+)$/', $route, $matches) && $requestMethod === 'GET':
                $orderController->getOrderById($matches[1]);
                break;

            case preg_match('/^\/orders\/([^\/]+)\/cancel$/', $route, $matches) && $requestMethod === 'POST':
                $orderController->cancelOrder($matches[1]);
                break;

            // Cart endpoints
            case $route === '/cart' && $requestMethod === 'GET':
                $cartController->getCart();
                break;

            case $route === '/cart/add' && $requestMethod === 'POST':
                $cartController->addToCart();
                break;

            case $route === '/cart/update' && $requestMethod === 'PUT':
                $cartController->updateCartItem();
                break;

            case $route === '/cart/remove' && $requestMethod === 'DELETE':
                $cartController->removeFromCart();
                break;

            case $route === '/cart/clear' && $requestMethod === 'DELETE':
                $cartController->clearCart();
                break;

            case $route === '/cart/merge' && $requestMethod === 'POST':
                $cartController->mergeGuestCart();
                break;

            // Image upload endpoints (Admin only)
            case $route === '/admin/upload/image' && $requestMethod === 'POST':
                $currentUser = $authMiddleware->handle('is_staff');
                if ($currentUser) {
                    $imageUploadController->uploadSingle();
                }
                break;

            case $route === '/admin/upload/images' && $requestMethod === 'POST':
                $currentUser = $authMiddleware->handle('is_staff');
                if ($currentUser) {
                    $imageUploadController->uploadMultiple();
                }
                break;

            case $route === '/admin/delete/image' && $requestMethod === 'DELETE':
                $currentUser = $authMiddleware->handle('is_staff');
                if ($currentUser) {
                    $imageUploadController->deleteImage();
                }
                break;

            default:
                http_response_code(404);
                echo json_encode([
                    'error' => 'Endpoint not found',
                    'requested_route' => $route,
                    'method' => $requestMethod
                ]);
                break;
        }
    } else {
        // Serve API documentation for non-API routes
        echo json_encode([
            'message' => 'Amazon Clone API',
            'version' => '1.0.0',
            'architecture' => 'Layered Architecture (DDD)',
            'endpoints' => [
                'health' => 'GET /api/health',
                'auth' => [
                    'login' => 'POST /api/auth/login',
                    'refresh' => 'POST /api/auth/refresh'
                ],
                'users' => [
                    'register' => 'POST /api/users',
                    'current_user' => 'GET /api/user/me',
                    'update_profile' => 'PUT /api/user/me'
                ],
                'products' => [
                    'list' => 'GET /api/products',
                    'details' => 'GET /api/products/{slug}'
                ],
                'orders' => [
                    'list' => 'GET /api/orders',
                    'create' => 'POST /api/orders'
                ],
                'admin' => [
                    'users' => 'GET /api/admin/users'
                ]
            ]
        ]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Database connection failed',
        'message' => $e->getMessage()
    ]);
} catch (\Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Internal server error',
        'message' => $e->getMessage()
    ]);
}
