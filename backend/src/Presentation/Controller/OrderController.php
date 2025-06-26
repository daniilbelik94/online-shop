<?php

namespace App\Presentation\Controller;

use App\Application\Service\OrderService;
use App\Presentation\Middleware\AuthMiddleware;

class OrderController
{
    private OrderService $orderService;
    private AuthMiddleware $authMiddleware;

    public function __construct(OrderService $orderService, AuthMiddleware $authMiddleware)
    {
        $this->orderService = $orderService;
        $this->authMiddleware = $authMiddleware;
    }

    public function createOrder(): void
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
            $requiredFields = ['shipping_address', 'billing_address'];
            foreach ($requiredFields as $field) {
                if (!isset($input[$field])) {
                    $this->sendBadRequest("Missing required field: {$field}");
                    return;
                }
            }

            $shippingAddress = $input['shipping_address'];
            $billingAddress = $input['billing_address'];
            $paymentMethod = $input['payment_method'] ?? 'pending';
            $customerNotes = $input['customer_notes'] ?? null;
            $shippingMethod = $input['shipping_method'] ?? null;
            $shippingCost = isset($input['shipping_cost']) ? (float) $input['shipping_cost'] : null;

            // Create order from cart
            $order = $this->orderService->createOrderFromCart(
                $user['user_id'],
                $shippingAddress,
                $billingAddress,
                $paymentMethod,
                $customerNotes,
                $shippingMethod,
                $shippingCost
            );

            $this->sendSuccess([
                'message' => 'Order created successfully',
                'order' => $this->formatOrderResponse($order),
                'data' => [
                    'order' => $this->formatOrderResponse($order)
                ]
            ], 201);
        } catch (\InvalidArgumentException $e) {
            $this->sendBadRequest($e->getMessage());
        } catch (\Exception $e) {
            error_log("Error creating order: " . $e->getMessage());
            $this->sendError('Failed to create order');
        }
    }

    public function getMyOrders(): void
    {
        try {
            $user = $this->authMiddleware->getCurrentUser();
            if (!$user) {
                $this->sendUnauthorized('Authentication required');
                return;
            }

            $page = (int) ($_GET['page'] ?? 1);
            $limit = min((int) ($_GET['limit'] ?? 20), 50);
            $status = $_GET['status'] ?? '';

            $filters = [];
            if (!empty($status)) {
                $filters['status'] = $status;
            }

            $result = $this->orderService->getUserOrders($user['user_id'], $filters, $page, $limit);

            $this->sendSuccess($result);
        } catch (\Exception $e) {
            error_log("Error fetching user orders: " . $e->getMessage());
            $this->sendError('Failed to fetch orders');
        }
    }

    public function getOrderById(string $orderId): void
    {
        try {
            $user = $this->authMiddleware->getCurrentUser();
            if (!$user) {
                $this->sendUnauthorized('Authentication required');
                return;
            }

            $order = $this->orderService->getOrderById($orderId);

            if (!$order) {
                $this->sendNotFound('Order not found');
                return;
            }

            // Check if user owns this order or is admin
            if ($order->getUserId() !== $user['user_id'] && !$this->isAdmin($user)) {
                $this->sendForbidden('Access denied');
                return;
            }

            $this->sendSuccess([
                'order' => $this->formatOrderResponse($order)
            ]);
        } catch (\Exception $e) {
            error_log("Error fetching order: " . $e->getMessage());
            $this->sendError('Failed to fetch order');
        }
    }

    public function cancelOrder(string $orderId): void
    {
        try {
            $user = $this->authMiddleware->getCurrentUser();
            if (!$user) {
                $this->sendUnauthorized('Authentication required');
                return;
            }

            $order = $this->orderService->getOrderById($orderId);

            if (!$order) {
                $this->sendNotFound('Order not found');
                return;
            }

            // Check if user owns this order
            if ($order->getUserId() !== $user['user_id']) {
                $this->sendForbidden('Access denied');
                return;
            }

            $input = json_decode(file_get_contents('php://input'), true);
            $reason = $input['reason'] ?? '';

            $cancelledOrder = $this->orderService->cancelOrder($orderId, $reason);

            $this->sendSuccess([
                'message' => 'Order cancelled successfully',
                'order' => $this->formatOrderResponse($cancelledOrder)
            ]);
        } catch (\InvalidArgumentException $e) {
            $this->sendBadRequest($e->getMessage());
        } catch (\Exception $e) {
            error_log("Error cancelling order: " . $e->getMessage());
            $this->sendError('Failed to cancel order');
        }
    }

    // Admin methods
    public function getAllOrders(): void
    {
        try {
            $user = $this->authMiddleware->getCurrentUser();
            if (!$user || !$this->isAdmin($user)) {
                $this->sendUnauthorized('Admin access required');
                return;
            }

            $page = (int) ($_GET['page'] ?? 1);
            $limit = min((int) ($_GET['limit'] ?? 50), 100);
            $status = $_GET['status'] ?? '';
            $search = $_GET['search'] ?? '';
            $sortBy = $_GET['sort_by'] ?? 'created_at';
            $sortOrder = $_GET['sort_order'] ?? 'DESC';

            $filters = [];
            if (!empty($status)) {
                $filters['status'] = $status;
            }
            if (!empty($search)) {
                $filters['search'] = $search;
            }

            $result = $this->orderService->getAllOrders($filters, $sortBy, $sortOrder, $page, $limit);

            $this->sendSuccess($result);
        } catch (\Exception $e) {
            error_log("Error fetching all orders: " . $e->getMessage());
            $this->sendError('Failed to fetch orders');
        }
    }

    public function updateOrderStatus(string $orderId): void
    {
        try {
            $user = $this->authMiddleware->getCurrentUser();
            if (!$user || !$this->isAdmin($user)) {
                $this->sendUnauthorized('Admin access required');
                return;
            }

            $input = json_decode(file_get_contents('php://input'), true);

            if (!isset($input['status'])) {
                $this->sendBadRequest('Status is required');
                return;
            }

            $updatedOrder = $this->orderService->updateOrderStatus($orderId, $input['status']);

            $this->sendSuccess([
                'message' => 'Order status updated successfully',
                'order' => $this->formatOrderResponse($updatedOrder)
            ]);
        } catch (\InvalidArgumentException $e) {
            $this->sendBadRequest($e->getMessage());
        } catch (\Exception $e) {
            error_log("Error updating order status: " . $e->getMessage());
            $this->sendError('Failed to update order status');
        }
    }

    public function updatePaymentStatus(string $orderId): void
    {
        try {
            $user = $this->authMiddleware->getCurrentUser();
            if (!$user || !$this->isAdmin($user)) {
                $this->sendUnauthorized('Admin access required');
                return;
            }

            $input = json_decode(file_get_contents('php://input'), true);

            if (!isset($input['payment_status'])) {
                $this->sendBadRequest('Payment status is required');
                return;
            }

            $updatedOrder = $this->orderService->updatePaymentStatus($orderId, $input['payment_status']);

            $this->sendSuccess([
                'message' => 'Payment status updated successfully',
                'order' => $this->formatOrderResponse($updatedOrder)
            ]);
        } catch (\InvalidArgumentException $e) {
            $this->sendBadRequest($e->getMessage());
        } catch (\Exception $e) {
            error_log("Error updating payment status: " . $e->getMessage());
            $this->sendError('Failed to update payment status');
        }
    }

    public function getOrderStatistics(): void
    {
        try {
            $user = $this->authMiddleware->getCurrentUser();
            if (!$user || !$this->isAdmin($user)) {
                $this->sendUnauthorized('Admin access required');
                return;
            }

            $statistics = $this->orderService->getOrderStatistics();

            $this->sendSuccess([
                'statistics' => $statistics
            ]);
        } catch (\Exception $e) {
            error_log("Error fetching order statistics: " . $e->getMessage());
            $this->sendError('Failed to fetch order statistics');
        }
    }

    private function isAdmin(array $user): bool
    {
        return isset($user['role']) && in_array($user['role'], ['admin', 'staff']);
    }

    private function formatOrderResponse($order): array
    {
        if (is_array($order)) {
            return $order;
        }

        return [
            'id' => $order->getId(),
            'order_number' => $order->getOrderNumber(),
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
            'items' => $order->getItems(),
            'items_count' => $order->getItemsCount(),
            'subtotal' => $order->calculateSubtotal(),
            'created_at' => $order->getCreatedAt()->format('Y-m-d H:i:s'),
            'updated_at' => $order->getUpdatedAt()->format('Y-m-d H:i:s'),
            'can_be_cancelled' => $order->canBeCancelled(),
            'customer_email' => $_SESSION['user_email'] ?? 'your email',
        ];
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

    private function sendForbidden(string $message): void
    {
        $this->sendError($message, 403);
    }

    private function sendNotFound(string $message): void
    {
        $this->sendError($message, 404);
    }
}
