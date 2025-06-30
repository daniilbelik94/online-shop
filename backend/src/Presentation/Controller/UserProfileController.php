<?php

namespace App\Presentation\Controller;

use App\Presentation\Middleware\AuthMiddleware;

class UserProfileController
{
    private AuthMiddleware $authMiddleware;

    public function __construct(AuthMiddleware $authMiddleware)
    {
        $this->authMiddleware = $authMiddleware;
    }

    public function getAddresses(): void
    {
        try {
            $user = $this->authMiddleware->getCurrentUser();
            if (!$user) {
                $this->sendUnauthorized('Authentication required');
                return;
            }

            // For simplicity, return success - addresses will be managed client-side
            // In a real app, you'd fetch from database
            $this->sendSuccess([
                'addresses' => [],
                'message' => 'Addresses managed client-side'
            ]);
        } catch (\Exception $e) {
            error_log("Error fetching addresses: " . $e->getMessage());
            $this->sendError('Failed to fetch addresses');
        }
    }

    public function saveAddress(): void
    {
        try {
            $user = $this->authMiddleware->getCurrentUser();
            if (!$user) {
                $this->sendUnauthorized('Authentication required');
                return;
            }

            $input = json_decode(file_get_contents('php://input'), true);

            if (!$input) {
                $this->sendBadRequest('Invalid JSON input');
                return;
            }

            // Validate required fields
            $requiredFields = ['name', 'street', 'city', 'state', 'postal_code'];
            foreach ($requiredFields as $field) {
                if (!isset($input[$field]) || empty($input[$field])) {
                    $this->sendBadRequest("Missing required field: {$field}");
                    return;
                }
            }

            $address = [
                'id' => $input['id'] ?? uniqid(),
                'type' => $input['type'] ?? 'custom',
                'name' => $input['name'],
                'street' => $input['street'],
                'city' => $input['city'],
                'state' => $input['state'],
                'postal_code' => $input['postal_code'],
                'country' => $input['country'] ?? 'United States',
                'phone' => $input['phone'] ?? '',
                'is_default' => $input['is_default'] ?? false
            ];

            // In a real app, you'd save to database
            // For now, just return success and let client handle storage
            $this->sendSuccess([
                'message' => 'Address saved successfully',
                'address' => $address
            ]);
        } catch (\Exception $e) {
            error_log("Error saving address: " . $e->getMessage());
            $this->sendError('Failed to save address');
        }
    }

    public function getPaymentMethods(): void
    {
        try {
            $user = $this->authMiddleware->getCurrentUser();
            if (!$user) {
                $this->sendUnauthorized('Authentication required');
                return;
            }

            // Get payment methods from session storage
            $sessionKey = 'user_payment_methods_' . $user['user_id'];
            $paymentMethods = $_SESSION[$sessionKey] ?? [];

            // If no payment methods saved, return default
            if (empty($paymentMethods)) {
                $paymentMethods = [
                    [
                        'id' => '1',
                        'type' => 'card',
                        'name' => 'Main Credit Card',
                        'last_four' => '4242',
                        'brand' => 'Visa',
                        'expires' => '12/25',
                        'is_default' => true
                    ]
                ];
            }

            $this->sendSuccess(['payment_methods' => $paymentMethods]);
        } catch (\Exception $e) {
            error_log("Error fetching payment methods: " . $e->getMessage());
            $this->sendError('Failed to fetch payment methods');
        }
    }

    public function savePaymentMethod(): void
    {
        try {
            $user = $this->authMiddleware->getCurrentUser();
            if (!$user) {
                $this->sendUnauthorized('Authentication required');
                return;
            }

            $input = json_decode(file_get_contents('php://input'), true);

            if (!$input) {
                $this->sendBadRequest('Invalid JSON input');
                return;
            }

            // Validate required fields
            $requiredFields = ['name', 'card_number', 'expires'];
            foreach ($requiredFields as $field) {
                if (!isset($input[$field]) || empty($input[$field])) {
                    $this->sendBadRequest("Missing required field: {$field}");
                    return;
                }
            }

            $cardNumber = preg_replace('/\s+/', '', $input['card_number']);
            $lastFour = substr($cardNumber, -4);
            $brand = $this->detectCardBrand($cardNumber);

            $sessionKey = 'user_payment_methods_' . $user['user_id'];
            $paymentMethods = $_SESSION[$sessionKey] ?? [];

            $paymentMethod = [
                'id' => $input['id'] ?? uniqid(),
                'type' => 'card',
                'name' => $input['name'],
                'last_four' => $lastFour,
                'brand' => $brand,
                'expires' => $input['expires'],
                'is_default' => $input['is_default'] ?? false
            ];

            // Update existing or add new payment method
            if ($input['id']) {
                // Update existing payment method
                $found = false;
                for ($i = 0; $i < count($paymentMethods); $i++) {
                    if ($paymentMethods[$i]['id'] === $input['id']) {
                        $paymentMethods[$i] = $paymentMethod;
                        $found = true;
                        break;
                    }
                }
                if (!$found) {
                    $paymentMethods[] = $paymentMethod;
                }
            } else {
                // Add new payment method
                $paymentMethods[] = $paymentMethod;
            }

            // Save to session
            $_SESSION[$sessionKey] = $paymentMethods;

            $this->sendSuccess([
                'message' => 'Payment method saved successfully',
                'payment_method' => $paymentMethod
            ]);
        } catch (\Exception $e) {
            error_log("Error saving payment method: " . $e->getMessage());
            $this->sendError('Failed to save payment method');
        }
    }

    private function detectCardBrand(string $cardNumber): string
    {
        if (preg_match('/^4/', $cardNumber)) {
            return 'Visa';
        } elseif (preg_match('/^5[1-5]/', $cardNumber)) {
            return 'Mastercard';
        } elseif (preg_match('/^3[47]/', $cardNumber)) {
            return 'American Express';
        } else {
            return 'Card';
        }
    }

    private function sendSuccess(array $data, int $statusCode = 200): void
    {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'data' => $data
        ]);
    }

    private function sendError(string $message, int $statusCode = 500): void
    {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'error' => $message
        ]);
    }

    private function sendBadRequest(string $message): void
    {
        $this->sendError($message, 400);
    }

    private function sendUnauthorized(string $message): void
    {
        $this->sendError($message, 401);
    }

    public function deleteAddress(): void
    {
        try {
            $user = $this->authMiddleware->getCurrentUser();
            if (!$user) {
                $this->sendUnauthorized('Authentication required');
                return;
            }

            $input = json_decode(file_get_contents('php://input'), true);

            if (!isset($input['id'])) {
                $this->sendBadRequest('Address ID is required');
                return;
            }

            $sessionKey = 'user_addresses_' . $user['user_id'];
            $addresses = $_SESSION[$sessionKey] ?? [];

            // Remove address by ID
            $addresses = array_filter($addresses, function ($address) use ($input) {
                return $address['id'] !== $input['id'];
            });

            // Reindex array
            $addresses = array_values($addresses);

            // Save to session
            $_SESSION[$sessionKey] = $addresses;

            $this->sendSuccess([
                'message' => 'Address deleted successfully'
            ]);
        } catch (\Exception $e) {
            error_log("Error deleting address: " . $e->getMessage());
            $this->sendError('Failed to delete address');
        }
    }

    public function deletePaymentMethod(): void
    {
        try {
            $user = $this->authMiddleware->getCurrentUser();
            if (!$user) {
                $this->sendUnauthorized('Authentication required');
                return;
            }

            $input = json_decode(file_get_contents('php://input'), true);

            if (!isset($input['id'])) {
                $this->sendBadRequest('Payment method ID is required');
                return;
            }

            $sessionKey = 'user_payment_methods_' . $user['user_id'];
            $paymentMethods = $_SESSION[$sessionKey] ?? [];

            // Remove payment method by ID
            $paymentMethods = array_filter($paymentMethods, function ($method) use ($input) {
                return $method['id'] !== $input['id'];
            });

            // Reindex array
            $paymentMethods = array_values($paymentMethods);

            // Save to session
            $_SESSION[$sessionKey] = $paymentMethods;

            $this->sendSuccess([
                'message' => 'Payment method deleted successfully'
            ]);
        } catch (\Exception $e) {
            error_log("Error deleting payment method: " . $e->getMessage());
            $this->sendError('Failed to delete payment method');
        }
    }
}
