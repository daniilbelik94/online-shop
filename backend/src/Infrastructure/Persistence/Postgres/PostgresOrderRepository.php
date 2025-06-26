<?php

namespace App\Infrastructure\Persistence\Postgres;

use App\Domain\Entity\Order;
use App\Domain\Entity\OrderItem;
use App\Domain\Repository\OrderRepositoryInterface;
use PDO;

class PostgresOrderRepository implements OrderRepositoryInterface
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function save(Order $order): Order
    {
        try {
            $this->pdo->beginTransaction();

            // Insert order
            $stmt = $this->pdo->prepare('
                INSERT INTO orders (
                    id, order_number, user_id, status, total_amount, 
                    shipping_address, billing_address, customer_notes,
                    payment_method, payment_status, shipping_method, 
                    shipping_cost, tax_amount, discount_amount,
                    created_at, updated_at, shipped_at, delivered_at
                ) VALUES (
                    gen_random_uuid(), :order_number, :user_id, :status, :total_amount,
                    :shipping_address, :billing_address, :customer_notes,
                    :payment_method, :payment_status, :shipping_method,
                    :shipping_cost, :tax_amount, :discount_amount,
                    :created_at, :updated_at, :shipped_at, :delivered_at
                ) RETURNING id
            ');

            $stmt->execute([
                'order_number' => $order->getOrderNumber(),
                'user_id' => $order->getUserId(),
                'status' => $order->getStatus(),
                'total_amount' => $order->getTotalAmount(),
                'shipping_address' => $order->getShippingAddress(),
                'billing_address' => $order->getBillingAddress(),
                'customer_notes' => $order->getCustomerNotes(),
                'payment_method' => $order->getPaymentMethod(),
                'payment_status' => $order->getPaymentStatus(),
                'shipping_method' => $order->getShippingMethod(),
                'shipping_cost' => $order->getShippingCost(),
                'tax_amount' => $order->getTaxAmount(),
                'discount_amount' => $order->getDiscountAmount(),
                'created_at' => $order->getCreatedAt()->format('Y-m-d H:i:s'),
                'updated_at' => $order->getUpdatedAt()->format('Y-m-d H:i:s'),
                'shipped_at' => $order->getShippedAt()?->format('Y-m-d H:i:s'),
                'delivered_at' => $order->getDeliveredAt()?->format('Y-m-d H:i:s'),
            ]);

            $result = $stmt->fetch();
            $orderId = $result['id'];
            $order->setId($orderId);

            // Insert order items
            foreach ($order->getItems() as $item) {
                $this->insertOrderItem($orderId, $item);
            }

            $this->pdo->commit();
            return $order;
        } catch (\Exception $e) {
            $this->pdo->rollBack();
            throw new \RuntimeException('Failed to save order: ' . $e->getMessage());
        }
    }

    public function findById(string $id): ?Order
    {
        $stmt = $this->pdo->prepare('
            SELECT * FROM orders WHERE id = :id
        ');
        $stmt->execute(['id' => $id]);
        $orderData = $stmt->fetch();

        if (!$orderData) {
            return null;
        }

        $order = $this->mapToOrder($orderData);

        // Load order items
        $items = $this->getOrderItems($id);
        $order->setItems($items);

        return $order;
    }

    public function findByOrderNumber(string $orderNumber): ?Order
    {
        $stmt = $this->pdo->prepare('
            SELECT * FROM orders WHERE order_number = :order_number
        ');
        $stmt->execute(['order_number' => $orderNumber]);
        $orderData = $stmt->fetch();

        if (!$orderData) {
            return null;
        }

        $order = $this->mapToOrder($orderData);

        // Load order items
        $items = $this->getOrderItems($orderData['id']);
        $order->setItems($items);

        return $order;
    }

    public function findByUserId(string $userId, array $filters = [], int $limit = 20, int $offset = 0): array
    {
        $whereClause = 'WHERE user_id = :user_id';
        $params = ['user_id' => $userId];

        if (!empty($filters['status'])) {
            $whereClause .= ' AND status = :status';
            $params['status'] = $filters['status'];
        }

        if (!empty($filters['payment_status'])) {
            $whereClause .= ' AND payment_status = :payment_status';
            $params['payment_status'] = $filters['payment_status'];
        }

        if (!empty($filters['from_date'])) {
            $whereClause .= ' AND created_at >= :from_date';
            $params['from_date'] = $filters['from_date'];
        }

        if (!empty($filters['to_date'])) {
            $whereClause .= ' AND created_at <= :to_date';
            $params['to_date'] = $filters['to_date'];
        }

        $stmt = $this->pdo->prepare("
            SELECT * FROM orders 
            {$whereClause}
            ORDER BY created_at DESC 
            LIMIT :limit OFFSET :offset
        ");

        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        $stmt->bindValue('limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue('offset', $offset, PDO::PARAM_INT);

        $stmt->execute();

        $orders = [];
        while ($orderData = $stmt->fetch()) {
            $order = $this->mapToOrder($orderData);
            $items = $this->getOrderItems($orderData['id']);
            $order->setItems($items);
            $orders[] = $order;
        }

        return $orders;
    }

    public function findAll(array $filters = [], string $sortBy = 'created_at', string $sortOrder = 'DESC', int $limit = 50, int $offset = 0): array
    {
        $whereConditions = [];
        $params = [];

        if (!empty($filters['status'])) {
            $whereConditions[] = 'status = :status';
            $params['status'] = $filters['status'];
        }

        if (!empty($filters['payment_status'])) {
            $whereConditions[] = 'payment_status = :payment_status';
            $params['payment_status'] = $filters['payment_status'];
        }

        if (!empty($filters['user_id'])) {
            $whereConditions[] = 'user_id = :user_id';
            $params['user_id'] = $filters['user_id'];
        }

        if (!empty($filters['search'])) {
            $whereConditions[] = '(order_number ILIKE :search OR shipping_address ILIKE :search_addr)';
            $params['search'] = '%' . $filters['search'] . '%';
            $params['search_addr'] = '%' . $filters['search'] . '%';
        }

        $whereClause = !empty($whereConditions) ? 'WHERE ' . implode(' AND ', $whereConditions) : '';

        // Validate sort parameters
        $allowedSortFields = ['created_at', 'updated_at', 'total_amount', 'status', 'order_number'];
        $sortBy = in_array($sortBy, $allowedSortFields) ? $sortBy : 'created_at';
        $sortOrder = strtoupper($sortOrder) === 'ASC' ? 'ASC' : 'DESC';

        $stmt = $this->pdo->prepare("
            SELECT * FROM orders 
            {$whereClause}
            ORDER BY {$sortBy} {$sortOrder}
            LIMIT :limit OFFSET :offset
        ");

        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        $stmt->bindValue('limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue('offset', $offset, PDO::PARAM_INT);

        $stmt->execute();

        $orders = [];
        while ($orderData = $stmt->fetch()) {
            $order = $this->mapToOrder($orderData);
            $items = $this->getOrderItems($orderData['id']);
            $order->setItems($items);
            $orders[] = $order;
        }

        return $orders;
    }

    public function update(Order $order): Order
    {
        try {
            $this->pdo->beginTransaction();

            $stmt = $this->pdo->prepare('
                UPDATE orders SET
                    status = :status,
                    total_amount = :total_amount,
                    shipping_address = :shipping_address,
                    billing_address = :billing_address,
                    customer_notes = :customer_notes,
                    payment_method = :payment_method,
                    payment_status = :payment_status,
                    shipping_method = :shipping_method,
                    shipping_cost = :shipping_cost,
                    tax_amount = :tax_amount,
                    discount_amount = :discount_amount,
                    updated_at = :updated_at,
                    shipped_at = :shipped_at,
                    delivered_at = :delivered_at
                WHERE id = :id
            ');

            $stmt->execute([
                'id' => $order->getId(),
                'status' => $order->getStatus(),
                'total_amount' => $order->getTotalAmount(),
                'shipping_address' => $order->getShippingAddress(),
                'billing_address' => $order->getBillingAddress(),
                'customer_notes' => $order->getCustomerNotes(),
                'payment_method' => $order->getPaymentMethod(),
                'payment_status' => $order->getPaymentStatus(),
                'shipping_method' => $order->getShippingMethod(),
                'shipping_cost' => $order->getShippingCost(),
                'tax_amount' => $order->getTaxAmount(),
                'discount_amount' => $order->getDiscountAmount(),
                'updated_at' => $order->getUpdatedAt()->format('Y-m-d H:i:s'),
                'shipped_at' => $order->getShippedAt()?->format('Y-m-d H:i:s'),
                'delivered_at' => $order->getDeliveredAt()?->format('Y-m-d H:i:s'),
            ]);

            // Update order items if needed
            if (!empty($order->getItems())) {
                // Delete existing items
                $deleteStmt = $this->pdo->prepare('DELETE FROM order_items WHERE order_id = :order_id');
                $deleteStmt->execute(['order_id' => $order->getId()]);

                // Insert new items
                foreach ($order->getItems() as $item) {
                    $this->insertOrderItem($order->getId(), $item);
                }
            }

            $this->pdo->commit();
            return $order;
        } catch (\Exception $e) {
            $this->pdo->rollBack();
            throw new \RuntimeException('Failed to update order: ' . $e->getMessage());
        }
    }

    public function delete(string $id): bool
    {
        try {
            $this->pdo->beginTransaction();

            // Delete order items first (due to foreign key constraint)
            $stmt = $this->pdo->prepare('DELETE FROM order_items WHERE order_id = :order_id');
            $stmt->execute(['order_id' => $id]);

            // Delete order
            $stmt = $this->pdo->prepare('DELETE FROM orders WHERE id = :id');
            $stmt->execute(['id' => $id]);

            $this->pdo->commit();
            return $stmt->rowCount() > 0;
        } catch (\Exception $e) {
            $this->pdo->rollBack();
            throw new \RuntimeException('Failed to delete order: ' . $e->getMessage());
        }
    }

    public function countByUserId(string $userId, array $filters = []): int
    {
        $whereClause = 'WHERE user_id = :user_id';
        $params = ['user_id' => $userId];

        if (!empty($filters['status'])) {
            $whereClause .= ' AND status = :status';
            $params['status'] = $filters['status'];
        }

        $stmt = $this->pdo->prepare("SELECT COUNT(*) as count FROM orders {$whereClause}");
        $stmt->execute($params);

        return (int) $stmt->fetch()['count'];
    }

    public function countAll(array $filters = []): int
    {
        $whereConditions = [];
        $params = [];

        if (!empty($filters['status'])) {
            $whereConditions[] = 'status = :status';
            $params['status'] = $filters['status'];
        }

        if (!empty($filters['user_id'])) {
            $whereConditions[] = 'user_id = :user_id';
            $params['user_id'] = $filters['user_id'];
        }

        $whereClause = !empty($whereConditions) ? 'WHERE ' . implode(' AND ', $whereConditions) : '';

        $stmt = $this->pdo->prepare("SELECT COUNT(*) as count FROM orders {$whereClause}");
        $stmt->execute($params);

        return (int) $stmt->fetch()['count'];
    }

    public function findRecentOrders(int $limit = 10): array
    {
        $stmt = $this->pdo->prepare('
            SELECT * FROM orders 
            ORDER BY created_at DESC 
            LIMIT :limit
        ');
        $stmt->bindValue('limit', $limit, PDO::PARAM_INT);
        $stmt->execute();

        $orders = [];
        while ($orderData = $stmt->fetch()) {
            $order = $this->mapToOrder($orderData);
            $items = $this->getOrderItems($orderData['id']);
            $order->setItems($items);
            $orders[] = $order;
        }

        return $orders;
    }

    public function findOrdersByStatus(string $status, int $limit = 50, int $offset = 0): array
    {
        $stmt = $this->pdo->prepare('
            SELECT * FROM orders 
            WHERE status = :status
            ORDER BY created_at DESC 
            LIMIT :limit OFFSET :offset
        ');
        $stmt->bindValue('status', $status);
        $stmt->bindValue('limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue('offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        $orders = [];
        while ($orderData = $stmt->fetch()) {
            $order = $this->mapToOrder($orderData);
            $items = $this->getOrderItems($orderData['id']);
            $order->setItems($items);
            $orders[] = $order;
        }

        return $orders;
    }

    public function findOrdersByDateRange(\DateTimeImmutable $startDate, \DateTimeImmutable $endDate): array
    {
        $stmt = $this->pdo->prepare('
            SELECT * FROM orders 
            WHERE created_at BETWEEN :start_date AND :end_date
            ORDER BY created_at DESC
        ');
        $stmt->execute([
            'start_date' => $startDate->format('Y-m-d H:i:s'),
            'end_date' => $endDate->format('Y-m-d H:i:s')
        ]);

        $orders = [];
        while ($orderData = $stmt->fetch()) {
            $order = $this->mapToOrder($orderData);
            $items = $this->getOrderItems($orderData['id']);
            $order->setItems($items);
            $orders[] = $order;
        }

        return $orders;
    }

    private function mapToOrder(array $data): Order
    {
        $order = new Order(
            $data['order_number'],
            $data['user_id'],
            (float) $data['total_amount'],
            $data['shipping_address'] ?? '',
            $data['billing_address'] ?? ''
        );

        $order->setId($data['id']);
        $order->updateStatus($data['status']);
        $order->updatePaymentStatus($data['payment_status']);
        $order->setPaymentMethod($data['payment_method']);
        $order->setShippingDetails($data['shipping_method'], $data['shipping_cost'] ? (float) $data['shipping_cost'] : null);
        $order->setTaxAmount($data['tax_amount'] ? (float) $data['tax_amount'] : null);
        $order->setDiscountAmount($data['discount_amount'] ? (float) $data['discount_amount'] : null);
        $order->setCustomerNotes($data['customer_notes']);

        return $order;
    }

    private function getOrderItems(string $orderId): array
    {
        $stmt = $this->pdo->prepare('
            SELECT oi.*, p.name as product_name, p.sku as product_sku, p.images[1] as product_image
            FROM order_items oi
            LEFT JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = :order_id
            ORDER BY oi.created_at ASC
        ');
        $stmt->execute(['order_id' => $orderId]);

        $items = [];
        while ($itemData = $stmt->fetch()) {
            $items[] = [
                'id' => $itemData['id'],
                'product_id' => $itemData['product_id'],
                'product_name' => $itemData['product_name'] ?? 'Unknown Product',
                'product_sku' => $itemData['product_sku'],
                'product_image' => $itemData['product_image'],
                'quantity' => (int) $itemData['quantity'],
                'price' => (float) $itemData['price'],
                'total' => (float) $itemData['price'] * (int) $itemData['quantity']
            ];
        }

        return $items;
    }

    private function insertOrderItem(string $orderId, array $item): void
    {
        $stmt = $this->pdo->prepare('
            INSERT INTO order_items (order_id, product_id, quantity, price, created_at)
            VALUES (:order_id, :product_id, :quantity, :price, CURRENT_TIMESTAMP)
        ');

        $stmt->execute([
            'order_id' => $orderId,
            'product_id' => $item['product_id'],
            'quantity' => $item['quantity'],
            'price' => $item['price']
        ]);
    }
}
