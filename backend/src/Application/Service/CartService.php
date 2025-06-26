<?php

namespace App\Application\Service;

use App\Domain\Repository\ProductRepositoryInterface;
use App\Domain\Repository\UserRepositoryInterface;
use PDO;

class CartService
{
    private PDO $pdo;
    private ProductRepositoryInterface $productRepository;
    private UserRepositoryInterface $userRepository;

    public function __construct(
        PDO $pdo,
        ProductRepositoryInterface $productRepository,
        UserRepositoryInterface $userRepository
    ) {
        $this->pdo = $pdo;
        $this->productRepository = $productRepository;
        $this->userRepository = $userRepository;
    }

    public function getCart(?string $userId = null, ?string $sessionId = null): array
    {
        $cartId = $this->getOrCreateCartId($userId, $sessionId);

        if (!$cartId) {
            return ['items' => [], 'total' => 0, 'count' => 0];
        }

        $stmt = $this->pdo->prepare('
            SELECT DISTINCT
                ci.id,
                ci.product_id,
                ci.quantity,
                ci.price as cart_price,
                ci.created_at,
                p.name,
                p.slug,
                p.price as current_price,
                p.stock_quantity,
                p.is_active,
                (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1) as image_url
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.cart_id = :cart_id
            ORDER BY ci.created_at DESC
        ');

        $stmt->execute(['cart_id' => $cartId]);
        $items = $stmt->fetchAll();

        $total = 0;
        $count = 0;

        foreach ($items as &$item) {
            $itemTotal = $item['cart_price'] * $item['quantity'];
            $item['total'] = $itemTotal;
            $total += $itemTotal;
            $count += $item['quantity'];
        }

        return [
            'items' => $items,
            'total' => $total,
            'count' => $count,
            'cart_id' => $cartId
        ];
    }

    public function addToCart(string $productId, int $quantity = 1, ?string $userId = null, ?string $sessionId = null): array
    {
        // Validate product
        $product = $this->productRepository->findById($productId);
        if (!$product || !$product->isActive()) {
            throw new \InvalidArgumentException('Product not found or inactive');
        }

        if ($product->getStockQuantity() < $quantity) {
            throw new \InvalidArgumentException('Insufficient stock');
        }

        $cartId = $this->getOrCreateCartId($userId, $sessionId);

        // Check if item already exists in cart
        $stmt = $this->pdo->prepare('
            SELECT id, quantity FROM cart_items 
            WHERE cart_id = :cart_id AND product_id = :product_id
        ');
        $stmt->execute(['cart_id' => $cartId, 'product_id' => $productId]);
        $existingItem = $stmt->fetch();

        if ($existingItem) {
            // Update quantity
            $newQuantity = $existingItem['quantity'] + $quantity;

            if ($product->getStockQuantity() < $newQuantity) {
                throw new \InvalidArgumentException('Insufficient stock for requested quantity');
            }

            $stmt = $this->pdo->prepare('
                UPDATE cart_items 
                SET quantity = :quantity, updated_at = CURRENT_TIMESTAMP
                WHERE id = :id
            ');
            $stmt->execute([
                'quantity' => $newQuantity,
                'id' => $existingItem['id']
            ]);
        } else {
            // Add new item
            $stmt = $this->pdo->prepare('
                INSERT INTO cart_items (cart_id, product_id, quantity, price, created_at, updated_at)
                VALUES (:cart_id, :product_id, :quantity, :price, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            ');
            $stmt->execute([
                'cart_id' => $cartId,
                'product_id' => $productId,
                'quantity' => $quantity,
                'price' => $product->getPrice()
            ]);
        }

        return $this->getCart($userId, $sessionId);
    }

    public function updateCartItem(string $itemId, int $quantity, ?string $userId = null, ?string $sessionId = null): array
    {
        if ($quantity <= 0) {
            return $this->removeFromCart($itemId, $userId, $sessionId);
        }

        $cartId = $this->getOrCreateCartId($userId, $sessionId);

        // Verify item belongs to this cart
        $stmt = $this->pdo->prepare('
            SELECT ci.product_id, p.stock_quantity
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.id = :item_id AND ci.cart_id = :cart_id
        ');
        $stmt->execute(['item_id' => $itemId, 'cart_id' => $cartId]);
        $item = $stmt->fetch();

        if (!$item) {
            throw new \InvalidArgumentException('Cart item not found');
        }

        if ($item['stock_quantity'] < $quantity) {
            throw new \InvalidArgumentException('Insufficient stock');
        }

        $stmt = $this->pdo->prepare('
            UPDATE cart_items 
            SET quantity = :quantity, updated_at = CURRENT_TIMESTAMP
            WHERE id = :id
        ');
        $stmt->execute(['quantity' => $quantity, 'id' => $itemId]);

        return $this->getCart($userId, $sessionId);
    }

    public function removeFromCart(string $itemId, ?string $userId = null, ?string $sessionId = null): array
    {
        $cartId = $this->getOrCreateCartId($userId, $sessionId);

        $stmt = $this->pdo->prepare('
            DELETE FROM cart_items 
            WHERE id = :item_id AND cart_id = :cart_id
        ');
        $stmt->execute(['item_id' => $itemId, 'cart_id' => $cartId]);

        return $this->getCart($userId, $sessionId);
    }

    public function clearCart(?string $userId = null, ?string $sessionId = null): array
    {
        $cartId = $this->getOrCreateCartId($userId, $sessionId);

        if ($cartId) {
            $stmt = $this->pdo->prepare('DELETE FROM cart_items WHERE cart_id = :cart_id');
            $stmt->execute(['cart_id' => $cartId]);
        }

        return ['items' => [], 'total' => 0, 'count' => 0];
    }

    public function mergeGuestCartToUser(string $sessionId, string $userId): array
    {
        // Get guest cart
        $guestCartId = $this->getCartId(null, $sessionId);
        if (!$guestCartId) {
            return $this->getCart($userId);
        }

        // Get or create user cart
        $userCartId = $this->getOrCreateCartId($userId);

        // Move items from guest cart to user cart
        $stmt = $this->pdo->prepare('
            INSERT INTO cart_items (cart_id, product_id, quantity, price, created_at, updated_at)
            SELECT :user_cart_id, product_id, quantity, price, created_at, updated_at
            FROM cart_items 
            WHERE cart_id = :guest_cart_id
            ON CONFLICT (cart_id, product_id) 
            DO UPDATE SET 
                quantity = cart_items.quantity + EXCLUDED.quantity,
                updated_at = CURRENT_TIMESTAMP
        ');
        $stmt->execute([
            'user_cart_id' => $userCartId,
            'guest_cart_id' => $guestCartId
        ]);

        // Delete guest cart
        $this->pdo->prepare('DELETE FROM cart WHERE id = :cart_id')->execute(['cart_id' => $guestCartId]);

        return $this->getCart($userId);
    }

    private function getCartId(?string $userId = null, ?string $sessionId = null): ?string
    {
        if ($userId) {
            $stmt = $this->pdo->prepare('SELECT id FROM cart WHERE user_id = :user_id');
            $stmt->execute(['user_id' => $userId]);
        } elseif ($sessionId) {
            $stmt = $this->pdo->prepare('SELECT id FROM cart WHERE session_id = :session_id');
            $stmt->execute(['session_id' => $sessionId]);
        } else {
            return null;
        }

        $result = $stmt->fetch();
        return $result ? $result['id'] : null;
    }

    private function getOrCreateCartId(?string $userId = null, ?string $sessionId = null): string
    {
        $cartId = $this->getCartId($userId, $sessionId);

        if (!$cartId) {
            $cartId = $this->generateUuid();
            $stmt = $this->pdo->prepare('
                INSERT INTO cart (id, user_id, session_id, created_at, updated_at)
                VALUES (:id, :user_id, :session_id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
            ');
            $stmt->execute([
                'id' => $cartId,
                'user_id' => $userId,
                'session_id' => $sessionId
            ]);
        }

        return $cartId;
    }

    private function generateUuid(): string
    {
        $stmt = $this->pdo->query('SELECT gen_random_uuid()');
        return $stmt->fetchColumn();
    }
}
