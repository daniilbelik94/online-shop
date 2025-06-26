<?php

namespace App\Domain\Repository;

use App\Domain\Entity\Order;

interface OrderRepositoryInterface
{
    public function save(Order $order): Order;

    public function findById(string $id): ?Order;

    public function findByOrderNumber(string $orderNumber): ?Order;

    public function findByUserId(string $userId, array $filters = [], int $limit = 20, int $offset = 0): array;

    public function findAll(array $filters = [], string $sortBy = 'created_at', string $sortOrder = 'DESC', int $limit = 50, int $offset = 0): array;

    public function update(Order $order): Order;

    public function delete(string $id): bool;

    public function countByUserId(string $userId, array $filters = []): int;

    public function countAll(array $filters = []): int;

    public function findRecentOrders(int $limit = 10): array;

    public function findOrdersByStatus(string $status, int $limit = 50, int $offset = 0): array;

    public function findOrdersByDateRange(\DateTimeImmutable $startDate, \DateTimeImmutable $endDate): array;
}
