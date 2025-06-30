<?php

namespace App\Domain\Repository;

use App\Domain\Entity\Coupon;

interface CouponRepositoryInterface
{
    public function save(Coupon $coupon): Coupon;
    public function update(Coupon $coupon): Coupon;
    public function findById(string $id): ?Coupon;
    public function findByCode(string $code): ?Coupon;
    public function findActive(): array;
    public function findExpired(): array;
    public function findUpcoming(): array;
    public function delete(string $id): bool;
    public function countActive(): int;
    public function getUsageStatistics(): array;
    public function validateCode(string $code, float $orderAmount, array $productIds = [], array $categoryIds = []): ?Coupon;
    public function recordUsage(string $couponId, string $userId, string $orderId, float $discountAmount): void;
}
