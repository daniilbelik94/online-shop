# 🚨 Критические исправления - Пошаговое руководство

## 1. 🔐 Исправление JWT валидации в UserSettingsController

### Проблема

В файле `backend/src/Presentation/Controller/UserSettingsController.php` на строке 130 есть TODO комментарий, указывающий на незавершенную реализацию JWT валидации.

### Исправление

**Шаг 1:** Обновить конструктор контроллера

```php
<?php

namespace App\Presentation\Controller;

use App\Application\Service\UserSettingsService;
use App\Application\Service\AuthService;
use App\Infrastructure\Persistence\Postgres\PostgresUserSettingsRepository;

class UserSettingsController
{
    private UserSettingsService $userSettingsService;
    private AuthService $authService;

    public function __construct(UserSettingsService $userSettingsService, AuthService $authService)
    {
        $this->userSettingsService = $userSettingsService;
        $this->authService = $authService;
    }
```

**Шаг 2:** Заменить метод `getCurrentUserId()`

```php
private function getCurrentUserId(): ?string
{
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';

    if (!preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        return null;
    }

    $token = $matches[1];
    $payload = $this->authService->validateToken($token);

    return $payload ? $payload['user_id'] : null;
}
```

**Шаг 3:** Обновить dependency injection в `backend/public/index.php`

```php
// Добавить в секцию dependency injection
$userSettingsRepository = new \App\Infrastructure\Persistence\Postgres\PostgresUserSettingsRepository($pdo);
$userSettingsService = new \App\Application\Service\UserSettingsService($userSettingsRepository);
$userSettingsController = new \App\Presentation\Controller\UserSettingsController($userSettingsService, $authService);
```

## 2. 🔒 Добавление Rate Limiting

### Создать новый middleware

**Файл:** `backend/src/Presentation/Middleware/RateLimitMiddleware.php`

```php
<?php

namespace App\Presentation\Middleware;

class RateLimitMiddleware
{
    private $redis;
    private $maxRequests;
    private $window;

    public function __construct($redis, int $maxRequests = 100, int $window = 3600)
    {
        $this->redis = $redis;
        $this->maxRequests = $maxRequests;
        $this->window = $window;
    }

    public function handle(): bool
    {
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $key = "rate_limit:$ip";

        try {
            $requests = $this->redis->incr($key);

            if ($requests === 1) {
                $this->redis->expire($key, $this->window);
            }

            if ($requests > $this->maxRequests) {
                http_response_code(429);
                header('Content-Type: application/json');
                echo json_encode([
                    'success' => false,
                    'error' => 'Too many requests. Please try again later.',
                    'retry_after' => $this->window
                ]);
                return false;
            }

            return true;
        } catch (\Exception $e) {
            // Если Redis недоступен, пропускаем rate limiting
            error_log("Rate limiting error: " . $e->getMessage());
            return true;
        }
    }
}
```

### Интегрировать в роутинг

**Обновить `backend/public/index.php`:**

```php
// Добавить в секцию middleware
$rateLimitMiddleware = new \App\Presentation\Middleware\RateLimitMiddleware($redis);

// Применить к критическим эндпоинтам
case $route === '/auth/login' && $requestMethod === 'POST':
    if (!$rateLimitMiddleware->handle()) {
        return;
    }
    $authController->login();
    break;

case $route === '/users' && $requestMethod === 'POST':
    if (!$rateLimitMiddleware->handle()) {
        return;
    }
    $userController->register();
    break;
```

## 3. 🔐 Интеграция Stripe для платежей

### Frontend интеграция

**Установить зависимости:**

```bash
cd frontend
npm install @stripe/stripe-js @stripe/react-stripe-js
```

**Создать компонент платежа:**

```typescript
// frontend/src/components/StripePayment.tsx
import React from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button, Alert, Box } from "@mui/material";

interface StripePaymentProps {
  amount: number;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
}

const StripePayment: React.FC<StripePaymentProps> = ({
  amount,
  onSuccess,
  onError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string>("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Создать payment intent на бэкенде
      const response = await fetch("/api/payments/create-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ amount }),
      });

      const { clientSecret } = await response.json();

      // Подтвердить платеж
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement)!,
          },
        });

      if (stripeError) {
        setError(stripeError.message || "Payment failed");
        onError(stripeError.message || "Payment failed");
      } else {
        onSuccess(paymentIntent);
      }
    } catch (err) {
      setError("Payment failed. Please try again.");
      onError("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#424770",
              "::placeholder": {
                color: "#aab7c4",
              },
            },
            invalid: {
              color: "#9e2146",
            },
          },
        }}
      />

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={!stripe || loading}
        sx={{ mt: 2 }}
      >
        {loading ? "Processing..." : `Pay $${(amount / 100).toFixed(2)}`}
      </Button>
    </Box>
  );
};

export default StripePayment;
```

### Backend интеграция

**Установить Stripe PHP SDK:**

```bash
cd backend
composer require stripe/stripe-php
```

**Создать Payment Controller:**

```php
<?php

namespace App\Presentation\Controller;

use Stripe\Stripe;
use Stripe\PaymentIntent;

class PaymentController
{
    private string $stripeSecretKey;

    public function __construct(string $stripeSecretKey)
    {
        $this->stripeSecretKey = $stripeSecretKey;
        Stripe::setApiKey($this->stripeSecretKey);
    }

    public function createPaymentIntent(): void
    {
        header('Content-Type: application/json');

        try {
            $input = json_decode(file_get_contents('php://input'), true);

            if (!isset($input['amount']) || $input['amount'] <= 0) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid amount']);
                return;
            }

            $paymentIntent = PaymentIntent::create([
                'amount' => $input['amount'], // в центах
                'currency' => 'usd',
                'metadata' => [
                    'user_id' => $input['user_id'] ?? null,
                    'order_id' => $input['order_id'] ?? null
                ]
            ]);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'clientSecret' => $paymentIntent->client_secret
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Failed to create payment intent: ' . $e->getMessage()
            ]);
        }
    }

    public function confirmPayment(): void
    {
        header('Content-Type: application/json');

        try {
            $input = json_decode(file_get_contents('php://input'), true);

            if (!isset($input['payment_intent_id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Payment intent ID required']);
                return;
            }

            $paymentIntent = PaymentIntent::retrieve($input['payment_intent_id']);

            if ($paymentIntent->status === 'succeeded') {
                // Обновить статус заказа
                // $this->orderService->updatePaymentStatus($orderId, 'paid');

                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'message' => 'Payment confirmed successfully'
                ]);
            } else {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Payment not completed'
                ]);
            }
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Failed to confirm payment: ' . $e->getMessage()
            ]);
        }
    }
}
```

**Добавить роуты в `backend/public/index.php`:**

```php
// Payment endpoints
case $route === '/payments/create-intent' && $requestMethod === 'POST':
    $paymentController = new \App\Presentation\Controller\PaymentController($_ENV['STRIPE_SECRET_KEY']);
    $paymentController->createPaymentIntent();
    break;

case $route === '/payments/confirm' && $requestMethod === 'POST':
    $paymentController = new \App\Presentation\Controller\PaymentController($_ENV['STRIPE_SECRET_KEY']);
    $paymentController->confirmPayment();
    break;
```

## 4. 📝 Улучшенная валидация данных

### Frontend валидация

**Установить Yup:**

```bash
cd frontend
npm install yup @hookform/resolvers react-hook-form
```

**Создать схемы валидации:**

```typescript
// frontend/src/utils/validation.ts
import * as yup from "yup";

export const registerSchema = yup.object({
  username: yup
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers and underscores"
    )
    .required("Username is required"),

  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),

  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])/,
      "Password must contain at least one lowercase letter"
    )
    .matches(
      /^(?=.*[A-Z])/,
      "Password must contain at least one uppercase letter"
    )
    .matches(/^(?=.*\d)/, "Password must contain at least one number")
    .matches(
      /^(?=.*[@$!%*?&])/,
      "Password must contain at least one special character"
    )
    .required("Password is required"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),

  first_name: yup
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .required("First name is required"),

  last_name: yup
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .required("Last name is required"),

  phone: yup
    .string()
    .matches(/^\+?[\d\s\-\(\)]+$/, "Please enter a valid phone number")
    .optional(),
});

export const loginSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),

  password: yup.string().required("Password is required"),
});

export const productSchema = yup.object({
  name: yup
    .string()
    .min(3, "Product name must be at least 3 characters")
    .max(200, "Product name must be less than 200 characters")
    .required("Product name is required"),

  description: yup
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be less than 2000 characters")
    .required("Description is required"),

  price: yup
    .number()
    .positive("Price must be positive")
    .required("Price is required"),

  stock_quantity: yup
    .number()
    .integer("Stock quantity must be a whole number")
    .min(0, "Stock quantity cannot be negative")
    .required("Stock quantity is required"),

  category_id: yup.string().required("Please select a category"),
});
```

### Backend валидация

**Улучшить Validator класс:**

```php
<?php

namespace App\Utils;

class Validator
{
    private array $errors = [];
    private array $data = [];

    public function validate(array $data, array $rules): bool
    {
        $this->data = $data;
        $this->errors = [];

        foreach ($rules as $field => $fieldRules) {
            foreach ($fieldRules as $rule) {
                $this->applyRule($field, $rule);
            }
        }

        return empty($this->errors);
    }

    private function applyRule(string $field, string $rule): void
    {
        $value = $this->data[$field] ?? null;

        switch ($rule) {
            case 'required':
                if (empty($value)) {
                    $this->errors[$field] = ucfirst($field) . ' is required';
                }
                break;

            case 'email':
                if (!empty($value) && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
                    $this->errors[$field] = 'Please enter a valid email address';
                }
                break;

            case 'min:8':
                if (!empty($value) && strlen($value) < 8) {
                    $this->errors[$field] = ucfirst($field) . ' must be at least 8 characters';
                }
                break;

            case 'password_strength':
                if (!empty($value)) {
                    if (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/', $value)) {
                        $this->errors[$field] = 'Password must contain uppercase, lowercase, number and special character';
                    }
                }
                break;

            case 'positive_number':
                if (!empty($value) && (!is_numeric($value) || $value <= 0)) {
                    $this->errors[$field] = ucfirst($field) . ' must be a positive number';
                }
                break;

            case 'integer':
                if (!empty($value) && (!is_numeric($value) || floor($value) != $value)) {
                    $this->errors[$field] = ucfirst($field) . ' must be a whole number';
                }
                break;
        }
    }

    public function getErrors(): array
    {
        return $this->errors;
    }

    public function sanitize(array $data): array
    {
        $sanitized = [];

        foreach ($data as $key => $value) {
            if (is_string($value)) {
                $sanitized[$key] = htmlspecialchars(trim($value), ENT_QUOTES, 'UTF-8');
            } else {
                $sanitized[$key] = $value;
            }
        }

        return $sanitized;
    }
}
```

## 5. 🧪 Добавление базовых тестов

### Backend тесты

**Создать `backend/tests/Unit/ProductServiceTest.php`:**

```php
<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use App\Application\Service\ProductService;
use App\Domain\Entity\Product;
use App\Domain\Repository\ProductRepositoryInterface;

class ProductServiceTest extends TestCase
{
    private ProductService $productService;
    private $mockRepository;

    protected function setUp(): void
    {
        $this->mockRepository = $this->createMock(ProductRepositoryInterface::class);
        $this->productService = new ProductService($this->mockRepository);
    }

    public function testCreateProduct()
    {
        $productData = [
            'name' => 'Test Product',
            'description' => 'Test Description',
            'price' => 99.99,
            'category_id' => 'test-category',
            'stock_quantity' => 10
        ];

        $this->mockRepository
            ->expects($this->once())
            ->method('save')
            ->willReturn(new Product(
                'test-id',
                'Test Product',
                'test-product',
                'Test Description',
                99.99,
                'test-category',
                10
            ));

        $product = $this->productService->createProduct($productData);

        $this->assertInstanceOf(Product::class, $product);
        $this->assertEquals('Test Product', $product->getName());
        $this->assertEquals(99.99, $product->getPrice());
    }

    public function testCreateProductWithInvalidData()
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Product name is required');

        $this->productService->createProduct([]);
    }
}
```

### Frontend тесты

**Создать `frontend/src/components/__tests__/ProductCard.test.tsx`:**

```typescript
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import ProductCard from "../ProductCard";
import authReducer from "../../store/slices/authSlice";
import cartReducer from "../../store/slices/cartSlice";

const mockProduct = {
  id: "1",
  name: "Test Product",
  slug: "test-product",
  description: "Test description",
  price: 99.99,
  category_id: "1",
  stock_quantity: 10,
  is_in_stock: true,
  is_featured: false,
  image_url: "/test-image.jpg",
  images: ["/test-image.jpg"],
};

const mockStore = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
  preloadedState: {
    auth: {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    },
    cart: {
      cart: null,
      loading: false,
      error: null,
      lastAction: null,
      notification: null,
    },
  },
});

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <Provider store={mockStore}>
      <BrowserRouter>{component}</BrowserRouter>
    </Provider>
  );
};

describe("ProductCard", () => {
  test("renders product information correctly", () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("$99.99")).toBeInTheDocument();
  });

  test("calls onAddToCart when add to cart button is clicked", () => {
    const mockOnAddToCart = jest.fn();
    renderWithProviders(
      <ProductCard product={mockProduct} onAddToCart={mockOnAddToCart} />
    );

    const addToCartButton = screen.getByRole("button", {
      name: /add to cart/i,
    });
    fireEvent.click(addToCartButton);

    expect(mockOnAddToCart).toHaveBeenCalledWith(mockProduct);
  });

  test("shows out of stock message when product is not in stock", () => {
    const outOfStockProduct = {
      ...mockProduct,
      is_in_stock: false,
      stock_quantity: 0,
    };
    renderWithProviders(<ProductCard product={outOfStockProduct} />);

    expect(screen.getByText("Out of Stock")).toBeInTheDocument();
  });
});
```

## 6. 📋 Чек-лист внедрения

### Приоритет 1 (Критические)

- [ ] Исправить JWT валидацию в UserSettingsController
- [ ] Добавить Rate Limiting middleware
- [ ] Интегрировать Stripe для платежей
- [ ] Добавить валидацию данных

### Приоритет 2 (Важные)

- [ ] Написать базовые тесты
- [ ] Добавить кэширование
- [ ] Улучшить обработку ошибок
- [ ] Добавить логирование

### Приоритет 3 (Улучшения)

- [ ] Добавить toast уведомления
- [ ] Улучшить loading states
- [ ] Добавить PWA функциональность
- [ ] Оптимизировать изображения

После выполнения этих исправлений проект будет значительно более безопасным, надежным и готовым к продакшену.
