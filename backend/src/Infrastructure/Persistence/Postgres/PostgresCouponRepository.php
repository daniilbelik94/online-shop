<?php

namespace App\Infrastructure\Persistence\Postgres;

use App\Domain\Entity\Coupon;
use App\Domain\Repository\CouponRepositoryInterface;
use PDO;

class PostgresCouponRepository implements CouponRepositoryInterface
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function save(Coupon $coupon): Coupon
    {
        $data = $coupon->toArray();

        if ($coupon->getId()) {
            // Update existing coupon
            $sql = "UPDATE coupons SET 
                name = :name,
                description = :description,
                type = :type,
                value = :value,
                min_order_amount = :min_order_amount,
                max_discount_amount = :max_discount_amount,
                is_active = :is_active,
                is_single_use = :is_single_use,
                max_uses = :max_uses,
                used_count = :used_count,
                start_date = :start_date,
                end_date = :end_date,
                applicable_categories = :applicable_categories,
                excluded_categories = :excluded_categories,
                applicable_products = :applicable_products,
                excluded_products = :excluded_products,
                first_time_only = :first_time_only,
                updated_at = :updated_at
                WHERE id = :id";

            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($data);
        } else {
            // Insert new coupon
            $sql = "INSERT INTO coupons (
                code, name, description, type, value, min_order_amount,
                max_discount_amount, is_active, is_single_use, max_uses,
                used_count, start_date, end_date, applicable_categories,
                excluded_categories, applicable_products, excluded_products,
                first_time_only, created_at, updated_at
            ) VALUES (
                :code, :name, :description, :type, :value, :min_order_amount,
                :max_discount_amount, :is_active, :is_single_use, :max_uses,
                :used_count, :start_date, :end_date, :applicable_categories,
                :excluded_categories, :applicable_products, :excluded_products,
                :first_time_only, :created_at, :updated_at
            ) RETURNING id";

            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($data);

            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            $coupon->setId($result['id']);

            return $coupon;
        }

        return $coupon;
    }

    public function update(Coupon $coupon): Coupon
    {
        if (!$coupon->getId()) {
            throw new \InvalidArgumentException('Cannot update coupon without ID');
        }

        $data = $coupon->toArray();

        $sql = "UPDATE coupons SET 
            name = :name,
            description = :description,
            type = :type,
            value = :value,
            min_order_amount = :min_order_amount,
            max_discount_amount = :max_discount_amount,
            is_active = :is_active,
            is_single_use = :is_single_use,
            max_uses = :max_uses,
            used_count = :used_count,
            start_date = :start_date,
            end_date = :end_date,
            applicable_categories = :applicable_categories,
            excluded_categories = :excluded_categories,
            applicable_products = :applicable_products,
            excluded_products = :excluded_products,
            first_time_only = :first_time_only,
            updated_at = :updated_at
            WHERE id = :id";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($data);

        return $coupon;
    }

    public function findById(string $id): ?Coupon
    {
        $sql = "SELECT * FROM coupons WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(['id' => $id]);

        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$data) {
            return null;
        }

        return $this->createCouponFromData($data);
    }

    public function findByCode(string $code): ?Coupon
    {
        $sql = "SELECT * FROM coupons WHERE code = :code";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(['code' => strtoupper($code)]);

        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$data) {
            return null;
        }

        return $this->createCouponFromData($data);
    }

    public function findActive(): array
    {
        $sql = "SELECT * FROM coupons WHERE is_active = true AND 
                (start_date IS NULL OR start_date <= NOW()) AND
                (end_date IS NULL OR end_date >= NOW()) AND
                (max_uses IS NULL OR used_count < max_uses)
                ORDER BY created_at DESC";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();

        $coupons = [];
        while ($data = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $coupons[] = $this->createCouponFromData($data);
        }

        return $coupons;
    }

    public function findExpired(): array
    {
        $sql = "SELECT * FROM coupons WHERE 
                (end_date IS NOT NULL AND end_date < NOW()) OR
                (max_uses IS NOT NULL AND used_count >= max_uses)
                ORDER BY end_date DESC";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();

        $coupons = [];
        while ($data = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $coupons[] = $this->createCouponFromData($data);
        }

        return $coupons;
    }

    public function findUpcoming(): array
    {
        $sql = "SELECT * FROM coupons WHERE 
                start_date IS NOT NULL AND start_date > NOW()
                ORDER BY start_date ASC";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();

        $coupons = [];
        while ($data = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $coupons[] = $this->createCouponFromData($data);
        }

        return $coupons;
    }

    public function delete(string $id): bool
    {
        $sql = "DELETE FROM coupons WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute(['id' => $id]);
    }

    public function countActive(): int
    {
        $sql = "SELECT COUNT(*) FROM coupons WHERE is_active = true";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        return (int) $stmt->fetchColumn();
    }

    public function getUsageStatistics(): array
    {
        $sql = "SELECT 
                type,
                COUNT(*) as total_coupons,
                SUM(used_count) as total_uses,
                AVG(value) as avg_value
                FROM coupons 
                GROUP BY type";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function validateCode(string $code, float $orderAmount, array $productIds = [], array $categoryIds = []): ?Coupon
    {
        $coupon = $this->findByCode($code);
        if (!$coupon) {
            return null;
        }

        if (!$coupon->canBeUsed()) {
            return null;
        }

        if (!$coupon->isApplicableToOrder($orderAmount, $productIds, $categoryIds)) {
            return null;
        }

        return $coupon;
    }

    public function recordUsage(string $couponId, string $userId, string $orderId, float $discountAmount): void
    {
        // Check if usage already exists
        $sql = "SELECT id FROM coupon_usage WHERE coupon_id = :coupon_id AND user_id = :user_id AND order_id = :order_id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            'coupon_id' => $couponId,
            'user_id' => $userId,
            'order_id' => $orderId
        ]);

        if ($stmt->fetch()) {
            return; // Usage already recorded
        }

        // Record usage
        $sql = "INSERT INTO coupon_usage (coupon_id, user_id, order_id, discount_amount) 
                VALUES (:coupon_id, :user_id, :order_id, :discount_amount)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            'coupon_id' => $couponId,
            'user_id' => $userId,
            'order_id' => $orderId,
            'discount_amount' => $discountAmount
        ]);

        // Increment usage count
        $sql = "UPDATE coupons SET used_count = used_count + 1 WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(['id' => $couponId]);
    }

    private function createCouponFromData(array $data): Coupon
    {
        $coupon = new Coupon(
            $data['code'],
            $data['name'],
            $data['description'],
            $data['type'],
            (float) $data['value']
        );

        $coupon->setId($data['id']);

        if ($data['min_order_amount']) {
            $coupon->setPricing(
                (float) $data['min_order_amount'],
                $data['max_discount_amount'] ? (float) $data['max_discount_amount'] : null
            );
        }

        if ($data['start_date'] || $data['end_date']) {
            $startDate = $data['start_date'] ? new \DateTimeImmutable($data['start_date']) : null;
            $endDate = $data['end_date'] ? new \DateTimeImmutable($data['end_date']) : null;
            $coupon->setLimitations(
                (bool) $data['is_single_use'],
                $data['max_uses'] ? (int) $data['max_uses'] : null,
                $startDate,
                $endDate,
                (bool) $data['first_time_only']
            );
        }

        if (
            $data['applicable_categories'] || $data['excluded_categories'] ||
            $data['applicable_products'] || $data['excluded_products']
        ) {

            $applicableCategories = $data['applicable_categories'] ? json_decode($data['applicable_categories'], true) : [];
            $excludedCategories = $data['excluded_categories'] ? json_decode($data['excluded_categories'], true) : [];
            $applicableProducts = $data['applicable_products'] ? json_decode($data['applicable_products'], true) : [];
            $excludedProducts = $data['excluded_products'] ? json_decode($data['excluded_products'], true) : [];

            $coupon->setScope(
                $applicableCategories,
                $excludedCategories,
                $applicableProducts,
                $excludedProducts
            );
        }

        // Set usage count
        if ($data['used_count'] > 0) {
            for ($i = 0; $i < (int) $data['used_count']; $i++) {
                $coupon->incrementUsage();
            }
        }

        // Set active status
        if (!$data['is_active']) {
            $coupon->deactivate();
        }

        return $coupon;
    }
}
