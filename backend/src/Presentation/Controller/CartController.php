<?php

namespace App\Presentation\Controller;

use App\Application\Service\CartService;
use App\Presentation\Middleware\AuthMiddleware;

class CartController
{
    private CartService $cartService;
    private AuthMiddleware $authMiddleware;

    public function __construct(CartService $cartService, AuthMiddleware $authMiddleware)
    {
        $this->cartService = $cartService;
        $this->authMiddleware = $authMiddleware;
    }

    public function getCart(): void
    {
        try {
            $user = $this->authMiddleware->getCurrentUser();
            $sessionId = $this->getSessionId();

            $cart = $this->cartService->getCart(
                $user ? $user['user_id'] : null,
                $sessionId
            );

            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode([
                'success' => true,
                'data' => $cart
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }

    public function addToCart(): void
    {
        try {
            $input = json_decode(file_get_contents('php://input'), true);

            if (!isset($input['product_id'])) {
                throw new \InvalidArgumentException('Product ID is required');
            }

            $productId = $input['product_id'];
            $quantity = $input['quantity'] ?? 1;

            if ($quantity <= 0) {
                throw new \InvalidArgumentException('Quantity must be greater than 0');
            }

            $user = $this->authMiddleware->getCurrentUser();
            $sessionId = $this->getSessionId();

            $cart = $this->cartService->addToCart(
                $productId,
                $quantity,
                $user ? $user['user_id'] : null,
                $sessionId
            );

            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode([
                'success' => true,
                'data' => $cart,
                'message' => 'Product added to cart'
            ]);
        } catch (\InvalidArgumentException $e) {
            http_response_code(400);
            header('Content-Type: application/json');
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }

    public function updateCartItem(): void
    {
        try {
            $input = json_decode(file_get_contents('php://input'), true);

            if (!isset($input['item_id']) || !isset($input['quantity'])) {
                throw new \InvalidArgumentException('Item ID and quantity are required');
            }

            $itemId = $input['item_id'];
            $quantity = (int) $input['quantity'];

            $user = $this->authMiddleware->getCurrentUser();
            $sessionId = $this->getSessionId();

            $cart = $this->cartService->updateCartItem(
                $itemId,
                $quantity,
                $user ? $user['user_id'] : null,
                $sessionId
            );

            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode([
                'success' => true,
                'data' => $cart,
                'message' => 'Cart item updated'
            ]);
        } catch (\InvalidArgumentException $e) {
            http_response_code(400);
            header('Content-Type: application/json');
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }

    public function removeFromCart(): void
    {
        try {
            $input = json_decode(file_get_contents('php://input'), true);

            if (!isset($input['item_id'])) {
                throw new \InvalidArgumentException('Item ID is required');
            }

            $itemId = $input['item_id'];

            $user = $this->authMiddleware->getCurrentUser();
            $sessionId = $this->getSessionId();

            $cart = $this->cartService->removeFromCart(
                $itemId,
                $user ? $user['user_id'] : null,
                $sessionId
            );

            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode([
                'success' => true,
                'data' => $cart,
                'message' => 'Item removed from cart'
            ]);
        } catch (\InvalidArgumentException $e) {
            http_response_code(400);
            header('Content-Type: application/json');
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }

    public function clearCart(): void
    {
        try {
            $user = $this->authMiddleware->getCurrentUser();
            $sessionId = $this->getSessionId();

            $cart = $this->cartService->clearCart(
                $user ? $user['user_id'] : null,
                $sessionId
            );

            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode([
                'success' => true,
                'data' => $cart,
                'message' => 'Cart cleared'
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }

    public function mergeGuestCart(): void
    {
        try {
            $user = $this->authMiddleware->getCurrentUser();
            if (!$user) {
                throw new \InvalidArgumentException('User must be authenticated');
            }

            $sessionId = $this->getSessionId();
            if (!$sessionId) {
                throw new \InvalidArgumentException('Session ID is required');
            }

            $cart = $this->cartService->mergeGuestCartToUser($sessionId, $user['user_id']);

            http_response_code(200);
            header('Content-Type: application/json');
            echo json_encode([
                'success' => true,
                'data' => $cart,
                'message' => 'Guest cart merged successfully'
            ]);
        } catch (\InvalidArgumentException $e) {
            http_response_code(400);
            header('Content-Type: application/json');
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            header('Content-Type: application/json');
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }

    private function getSessionId(): ?string
    {
        // Try to get session ID from header first
        $sessionId = $_SERVER['HTTP_X_SESSION_ID'] ?? null;

        // If not in header, try to get from cookie
        if (!$sessionId) {
            $sessionId = $_COOKIE['cart_session'] ?? null;
        }

        // If still no session ID, generate one
        if (!$sessionId) {
            $sessionId = bin2hex(random_bytes(16));
            setcookie('cart_session', $sessionId, time() + (86400 * 30), '/'); // 30 days
        }

        return $sessionId;
    }
}
