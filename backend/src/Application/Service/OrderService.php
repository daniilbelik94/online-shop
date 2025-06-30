<?php

namespace App\Application\Service;

use App\Domain\Entity\Order;
use App\Domain\Repository\OrderRepositoryInterface;
use App\Domain\Repository\ProductRepositoryInterface;
use App\Domain\Repository\UserRepositoryInterface;
use App\Domain\Service\EmailServiceInterface;

class OrderService
{
    private OrderRepositoryInterface $orderRepository;
    private ProductRepositoryInterface $productRepository;
    private UserRepositoryInterface $userRepository;
    private CartService $cartService;
    private EmailServiceInterface $emailService;

    public function __construct(
        OrderRepositoryInterface $orderRepository,
        ProductRepositoryInterface $productRepository,
        UserRepositoryInterface $userRepository,
        CartService $cartService,
        EmailServiceInterface $emailService
    ) {
        $this->orderRepository = $orderRepository;
        $this->productRepository = $productRepository;
        $this->userRepository = $userRepository;
        $this->cartService = $cartService;
        $this->emailService = $emailService;
    }

    public function createOrderFromCart(
        string $userId,
        array $shippingAddress,
        array $billingAddress,
        string $paymentMethod = 'pending',
        ?string $customerNotes = null,
        ?string $shippingMethod = null,
        ?float $shippingCost = null
    ): Order {
        // Get user's cart
        $cart = $this->cartService->getCart($userId);

        if (empty($cart['items'])) {
            throw new \InvalidArgumentException('Cart is empty');
        }

        // Validate stock availability
        foreach ($cart['items'] as $cartItem) {
            $product = $this->productRepository->findById($cartItem['product_id']);
            if (!$product || !$product->isActive()) {
                throw new \InvalidArgumentException("Product {$cartItem['name']} is no longer available");
            }

            if ($product->getStockQuantity() < $cartItem['quantity']) {
                throw new \InvalidArgumentException("Insufficient stock for {$cartItem['name']}");
            }
        }

        // Generate order number
        $orderNumber = $this->generateOrderNumber();

        // Calculate totals
        $subtotal = (float) $cart['total'];
        $taxAmount = $this->calculateTax($subtotal);
        $totalAmount = $subtotal + $taxAmount + ($shippingCost ?? 0.0);

        // Create order
        $order = new Order(
            $orderNumber,
            $userId,
            $totalAmount,
            $this->formatAddress($shippingAddress),
            $this->formatAddress($billingAddress)
        );

        // Set additional details
        $order->setPaymentMethod($paymentMethod);
        $order->setShippingDetails($shippingMethod, $shippingCost);
        $order->setTaxAmount($taxAmount);
        $order->setCustomerNotes($customerNotes);

        // Convert cart items to order items
        $orderItems = [];
        foreach ($cart['items'] as $cartItem) {
            $orderItems[] = [
                'product_id' => $cartItem['product_id'],
                'product_name' => $cartItem['name'],
                'product_sku' => $cartItem['sku'] ?? null,
                'quantity' => $cartItem['quantity'],
                'price' => $cartItem['cart_price']
            ];
        }
        $order->setItems($orderItems);

        // Save order
        $savedOrder = $this->orderRepository->save($order);

        // Update product stock
        foreach ($cart['items'] as $cartItem) {
            $product = $this->productRepository->findById($cartItem['product_id']);
            $product->adjustStock(-$cartItem['quantity']);
            $this->productRepository->update($product);
        }

        // Send order confirmation email
        $this->sendOrderConfirmationEmail($savedOrder);

        return $savedOrder;
    }

    public function createOrder(
        string $userId,
        array $items,
        array $shippingAddress,
        array $billingAddress,
        string $paymentMethod = 'pending',
        ?string $customerNotes = null,
        ?string $shippingMethod = null,
        ?float $shippingCost = null
    ): Order {
        if (empty($items)) {
            throw new \InvalidArgumentException('Order must contain at least one item');
        }

        // Validate user exists
        $user = $this->userRepository->findById($userId);
        if (!$user) {
            throw new \InvalidArgumentException('User not found');
        }

        // Validate and process items
        $orderItems = [];
        $subtotal = 0.0;

        foreach ($items as $item) {
            if (!isset($item['product_id'], $item['quantity'], $item['price'])) {
                throw new \InvalidArgumentException('Invalid item data');
            }

            $product = $this->productRepository->findById($item['product_id']);
            if (!$product || !$product->isActive()) {
                throw new \InvalidArgumentException("Product with ID {$item['product_id']} not found or inactive");
            }

            if ($product->getStockQuantity() < $item['quantity']) {
                throw new \InvalidArgumentException("Insufficient stock for {$product->getName()}");
            }

            $orderItems[] = [
                'product_id' => $item['product_id'],
                'product_name' => $product->getName(),
                'product_sku' => $product->getSku(),
                'quantity' => (int) $item['quantity'],
                'price' => (float) $item['price']
            ];

            $subtotal += $item['price'] * $item['quantity'];
        }

        // Generate order number
        $orderNumber = $this->generateOrderNumber();

        // Calculate totals
        $taxAmount = $this->calculateTax($subtotal);
        $totalAmount = $subtotal + $taxAmount + ($shippingCost ?? 0.0);

        // Create order
        $order = new Order(
            $orderNumber,
            $userId,
            $totalAmount,
            $this->formatAddress($shippingAddress),
            $this->formatAddress($billingAddress)
        );

        // Set additional details
        $order->setPaymentMethod($paymentMethod);
        $order->setShippingDetails($shippingMethod, $shippingCost);
        $order->setTaxAmount($taxAmount);
        $order->setCustomerNotes($customerNotes);
        $order->setItems($orderItems);

        // Save order
        $savedOrder = $this->orderRepository->save($order);

        // Update product stock
        foreach ($orderItems as $orderItem) {
            $product = $this->productRepository->findById($orderItem['product_id']);
            $product->adjustStock(-$orderItem['quantity']);
            $this->productRepository->update($product);
        }

        return $savedOrder;
    }

    public function getOrderById(string $orderId): ?Order
    {
        return $this->orderRepository->findById($orderId);
    }

    public function getOrderByNumber(string $orderNumber): ?Order
    {
        return $this->orderRepository->findByOrderNumber($orderNumber);
    }

    public function getUserOrders(string $userId, array $filters = [], int $page = 1, int $limit = 20): array
    {
        $offset = ($page - 1) * $limit;
        $orders = $this->orderRepository->findByUserId($userId, $filters, $limit, $offset);
        $totalCount = $this->orderRepository->countByUserId($userId, $filters);

        return [
            'data' => array_map([$this, 'formatOrderForResponse'], $orders),
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $totalCount,
                'pages' => ceil($totalCount / $limit)
            ]
        ];
    }

    public function getAllOrders(array $filters = [], string $sortBy = 'created_at', string $sortOrder = 'DESC', int $page = 1, int $limit = 50): array
    {
        $offset = ($page - 1) * $limit;
        $orders = $this->orderRepository->findAll($filters, $sortBy, $sortOrder, $limit, $offset);
        $totalCount = $this->orderRepository->countAll($filters);

        return [
            'data' => array_map([$this, 'formatOrderForResponse'], $orders),
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $totalCount,
                'pages' => ceil($totalCount / $limit)
            ]
        ];
    }

    public function updateOrderStatus(string $orderId, string $status): Order
    {
        $order = $this->orderRepository->findById($orderId);
        if (!$order) {
            throw new \InvalidArgumentException('Order not found');
        }

        $oldStatus = $order->getStatus();
        $order->updateStatus($status);
        $updatedOrder = $this->orderRepository->update($order);

        // Send status update email if status changed
        if ($oldStatus !== $status) {
            $this->sendOrderStatusUpdateEmail($updatedOrder);
        }

        return $updatedOrder;
    }

    public function updatePaymentStatus(string $orderId, string $paymentStatus): Order
    {
        $order = $this->orderRepository->findById($orderId);
        if (!$order) {
            throw new \InvalidArgumentException('Order not found');
        }

        $order->updatePaymentStatus($paymentStatus);
        $updatedOrder = $this->orderRepository->update($order);

        // Send email notification for payment confirmation
        if ($paymentStatus === 'paid') {
            $this->sendPaymentConfirmationEmail($updatedOrder);
        }

        return $updatedOrder;
    }

    public function cancelOrder(string $orderId, string $reason = ''): Order
    {
        $order = $this->orderRepository->findById($orderId);
        if (!$order) {
            throw new \InvalidArgumentException('Order not found');
        }

        if (!$order->canBeCancelled()) {
            throw new \InvalidArgumentException('Order cannot be cancelled in its current state');
        }

        // Update status to cancelled
        $order->updateStatus('cancelled');

        // Add cancellation reason to customer notes if provided
        if ($reason) {
            $currentNotes = $order->getCustomerNotes();
            $newNotes = $currentNotes ? $currentNotes . "\n\nCancellation reason: " . $reason : "Cancellation reason: " . $reason;
            $order->setCustomerNotes($newNotes);
        }

        // Persist changes using repository update instead of save (avoids duplicate insert)
        if (method_exists($this->orderRepository, 'update')) {
            $cancelledOrder = $this->orderRepository->update($order);
        } else {
            // Fallback for repositories without update method
            $cancelledOrder = $this->orderRepository->save($order);
        }

        // Restore product stock
        foreach ($order->getItems() as $item) {
            $product = $this->productRepository->findById($item['product_id']);
            if ($product) {
                $product->adjustStock($item['quantity']);
                $this->productRepository->update($product);
            }
        }

        // Send cancellation email
        $this->sendOrderCancellationEmail($cancelledOrder);

        return $cancelledOrder;
    }

    public function getRecentOrders(int $limit = 10): array
    {
        $orders = $this->orderRepository->findRecentOrders($limit);
        return array_map([$this, 'formatOrderForResponse'], $orders);
    }

    public function getOrdersByStatus(string $status, int $page = 1, int $limit = 50): array
    {
        $offset = ($page - 1) * $limit;
        $orders = $this->orderRepository->findOrdersByStatus($status, $limit, $offset);

        return array_map([$this, 'formatOrderForResponse'], $orders);
    }

    public function getOrderStatistics(): array
    {
        return [
            'total_orders' => $this->orderRepository->countAll(),
            'pending_orders' => $this->orderRepository->countAll(['status' => Order::STATUS_PENDING]),
            'processing_orders' => $this->orderRepository->countAll(['status' => Order::STATUS_PROCESSING]),
            'shipped_orders' => $this->orderRepository->countAll(['status' => Order::STATUS_SHIPPED]),
            'delivered_orders' => $this->orderRepository->countAll(['status' => Order::STATUS_DELIVERED]),
            'cancelled_orders' => $this->orderRepository->countAll(['status' => Order::STATUS_CANCELLED]),
        ];
    }

    private function generateOrderNumber(): string
    {
        return 'ORD-' . date('Y') . '-' . str_pad(mt_rand(1, 999999), 6, '0', STR_PAD_LEFT);
    }

    private function calculateTax(float $amount): float
    {
        // Simple tax calculation - 8.5% tax rate
        // In a real application, this would be more complex based on location
        return round($amount * 0.085, 2);
    }

    private function formatAddress(array $address): string
    {
        if (is_string($address)) {
            return $address;
        }

        $parts = [];
        if (!empty($address['name'])) $parts[] = $address['name'];
        if (!empty($address['street'])) $parts[] = $address['street'];
        if (!empty($address['city'])) $parts[] = $address['city'];
        if (!empty($address['state'])) $parts[] = $address['state'];
        if (!empty($address['postal_code'])) $parts[] = $address['postal_code'];
        if (!empty($address['country'])) $parts[] = $address['country'];

        return implode(', ', $parts);
    }

    private function formatOrderForResponse(Order $order): array
    {
        // Get user information
        $user = $this->userRepository->findById($order->getUserId());
        $userName = $user ? $user->getFirstName() . ' ' . $user->getLastName() : 'Unknown User';
        $userEmail = $user ? $user->getEmail() : 'No email';

        return [
            'id' => $order->getId(),
            'order_number' => $order->getOrderNumber(),
            'user_id' => $order->getUserId(),
            'user_name' => $userName,
            'user_email' => $userEmail,
            'status' => $order->getStatus(),
            'payment_status' => $order->getPaymentStatus(),
            'payment_method' => $order->getPaymentMethod(),
            'total_amount' => $order->getTotalAmount(),
            'shipping_address' => $order->getShippingAddress(),
            'billing_address' => $order->getBillingAddress(),
            'customer_notes' => $order->getCustomerNotes(),
            'shipping_method' => $order->getShippingMethod(),
            'shipping_cost' => $order->getShippingCost(),
            'tax_amount' => $order->getTaxAmount(),
            'discount_amount' => $order->getDiscountAmount(),
            'items' => $order->getItems(),
            'items_count' => $order->getItemsCount(),
            'subtotal' => $order->calculateSubtotal(),
            'created_at' => $order->getCreatedAt()->format('Y-m-d H:i:s'),
            'updated_at' => $order->getUpdatedAt()->format('Y-m-d H:i:s'),
            'shipped_at' => $order->getShippedAt()?->format('Y-m-d H:i:s'),
            'delivered_at' => $order->getDeliveredAt()?->format('Y-m-d H:i:s'),
            'can_be_cancelled' => $order->canBeCancelled(),
        ];
    }

    private function sendOrderConfirmationEmail(Order $order): void
    {
        try {
            $user = $this->userRepository->findById($order->getUserId());
            if ($user && $user->getEmail()) {
                $orderData = $this->formatOrderForResponse($order);
                $this->emailService->sendOrderConfirmation($user->getEmail(), $orderData);
            }
        } catch (\Exception $e) {
            error_log("Failed to send order confirmation email: " . $e->getMessage());
        }
    }

    private function sendOrderStatusUpdateEmail(Order $order): void
    {
        try {
            $user = $this->userRepository->findById($order->getUserId());
            if ($user && $user->getEmail()) {
                $orderData = $this->formatOrderForResponse($order);
                $this->emailService->sendOrderStatusUpdate($user->getEmail(), $orderData);
            }
        } catch (\Exception $e) {
            error_log("Failed to send order status update email: " . $e->getMessage());
        }
    }

    private function sendPaymentConfirmationEmail(Order $order): void
    {
        try {
            $user = $this->userRepository->findById($order->getUserId());
            if ($user && $user->getEmail()) {
                $orderData = $this->formatOrderForResponse($order);
                $orderData['payment_confirmed'] = true;
                $this->emailService->sendOrderStatusUpdate($user->getEmail(), $orderData);
            }
        } catch (\Exception $e) {
            error_log("Failed to send payment confirmation email: " . $e->getMessage());
        }
    }

    private function sendOrderCancellationEmail(Order $order): void
    {
        try {
            $user = $this->userRepository->findById($order->getUserId());
            if ($user && $user->getEmail()) {
                $orderData = $this->formatOrderForResponse($order);
                $this->emailService->sendOrderStatusUpdate($user->getEmail(), $orderData);
            }
        } catch (\Exception $e) {
            error_log("Failed to send order cancellation email: " . $e->getMessage());
        }
    }
}
