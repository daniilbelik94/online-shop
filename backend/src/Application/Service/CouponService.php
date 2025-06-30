<?php

namespace App\Application\Service;

use App\Domain\Entity\Coupon;
use App\Domain\Repository\CouponRepositoryInterface;
use App\Domain\Repository\ProductRepositoryInterface;
use App\Domain\Repository\CategoryRepositoryInterface;

class CouponService
{
    private CouponRepositoryInterface $couponRepository;
    private ProductRepositoryInterface $productRepository;
    private CategoryRepositoryInterface $categoryRepository;

    public function __construct(
        CouponRepositoryInterface $couponRepository,
        ProductRepositoryInterface $productRepository,
        CategoryRepositoryInterface $categoryRepository
    ) {
        $this->couponRepository = $couponRepository;
        $this->productRepository = $productRepository;
        $this->categoryRepository = $categoryRepository;
    }

    public function getCoupons(array $filters = [], int $page = 1, int $limit = 20): array
    {
        $offset = ($page - 1) * $limit;

        // Get coupons based on filters
        if (!empty($filters['type'])) {
            $coupons = $this->couponRepository->findActive();
            $coupons = array_filter($coupons, function ($coupon) use ($filters) {
                return $coupon->getType() === $filters['type'];
            });
        } elseif (isset($filters['active'])) {
            if ($filters['active']) {
                $coupons = $this->couponRepository->findActive();
            } else {
                $coupons = $this->couponRepository->findExpired();
            }
        } else {
            $coupons = $this->couponRepository->findActive();
        }

        // Apply pagination
        $total = count($coupons);
        $coupons = array_slice($coupons, $offset, $limit);

        // Format coupons for response
        $formattedCoupons = [];
        foreach ($coupons as $coupon) {
            $formattedCoupons[] = $this->formatCoupon($coupon);
        }

        return [
            'data' => $formattedCoupons,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'pages' => ceil($total / $limit)
            ]
        ];
    }

    public function getCoupon(string $id): ?Coupon
    {
        return $this->couponRepository->findById($id);
    }

    public function createCoupon(array $data): Coupon
    {
        $this->validateCouponData($data);

        $coupon = new Coupon(
            $data['code'],
            $data['name'],
            $data['description'],
            $data['type'],
            (float) $data['value']
        );

        // Set pricing
        if (isset($data['min_order_amount']) || isset($data['max_discount_amount'])) {
            $coupon->setPricing(
                isset($data['min_order_amount']) ? (float) $data['min_order_amount'] : null,
                isset($data['max_discount_amount']) ? (float) $data['max_discount_amount'] : null
            );
        }

        // Set limitations
        if (
            isset($data['is_single_use']) || isset($data['max_uses']) ||
            isset($data['start_date']) || isset($data['end_date']) ||
            isset($data['first_time_only'])
        ) {

            $startDate = isset($data['start_date']) ? new \DateTimeImmutable($data['start_date']) : null;
            $endDate = isset($data['end_date']) ? new \DateTimeImmutable($data['end_date']) : null;

            $coupon->setLimitations(
                $data['is_single_use'] ?? false,
                isset($data['max_uses']) ? (int) $data['max_uses'] : null,
                $startDate,
                $endDate,
                $data['first_time_only'] ?? false
            );
        }

        // Set scope
        if (
            isset($data['applicable_categories']) || isset($data['excluded_categories']) ||
            isset($data['applicable_products']) || isset($data['excluded_products'])
        ) {

            $coupon->setScope(
                $data['applicable_categories'] ?? [],
                $data['excluded_categories'] ?? [],
                $data['applicable_products'] ?? [],
                $data['excluded_products'] ?? []
            );
        }

        // Set active status
        if (isset($data['is_active']) && !$data['is_active']) {
            $coupon->deactivate();
        }

        return $this->couponRepository->save($coupon);
    }

    public function updateCoupon(string $id, array $data): Coupon
    {
        $coupon = $this->couponRepository->findById($id);
        if (!$coupon) {
            throw new \InvalidArgumentException('Coupon not found');
        }

        // Update basic details
        if (
            isset($data['name']) || isset($data['description']) ||
            isset($data['type']) || isset($data['value'])
        ) {

            $coupon->updateDetails(
                $data['name'] ?? $coupon->getName(),
                $data['description'] ?? $coupon->getDescription(),
                $data['type'] ?? $coupon->getType(),
                isset($data['value']) ? (float) $data['value'] : $coupon->getValue()
            );
        }

        // Update pricing
        if (isset($data['min_order_amount']) || isset($data['max_discount_amount'])) {
            $coupon->setPricing(
                isset($data['min_order_amount']) ? (float) $data['min_order_amount'] : null,
                isset($data['max_discount_amount']) ? (float) $data['max_discount_amount'] : null
            );
        }

        // Update limitations
        if (
            isset($data['is_single_use']) || isset($data['max_uses']) ||
            isset($data['start_date']) || isset($data['end_date']) ||
            isset($data['first_time_only'])
        ) {

            $startDate = isset($data['start_date']) ? new \DateTimeImmutable($data['start_date']) : $coupon->getStartDate();
            $endDate = isset($data['end_date']) ? new \DateTimeImmutable($data['end_date']) : $coupon->getEndDate();

            $coupon->setLimitations(
                $data['is_single_use'] ?? $coupon->isSingleUse(),
                isset($data['max_uses']) ? (int) $data['max_uses'] : $coupon->getMaxUses(),
                $startDate,
                $endDate,
                $data['first_time_only'] ?? $coupon->isFirstTimeOnly()
            );
        }

        // Update scope
        if (
            isset($data['applicable_categories']) || isset($data['excluded_categories']) ||
            isset($data['applicable_products']) || isset($data['excluded_products'])
        ) {

            $coupon->setScope(
                $data['applicable_categories'] ?? $coupon->getApplicableCategories(),
                $data['excluded_categories'] ?? $coupon->getExcludedCategories(),
                $data['applicable_products'] ?? $coupon->getApplicableProducts(),
                $data['excluded_products'] ?? $coupon->getExcludedProducts()
            );
        }

        // Update active status
        if (isset($data['is_active'])) {
            if ($data['is_active']) {
                $coupon->activate();
            } else {
                $coupon->deactivate();
            }
        }

        return $this->couponRepository->update($coupon);
    }

    public function deleteCoupon(string $id): void
    {
        $coupon = $this->couponRepository->findById($id);
        if (!$coupon) {
            throw new \InvalidArgumentException('Coupon not found');
        }

        $this->couponRepository->delete($id);
    }

    public function activateCoupon(string $id): Coupon
    {
        $coupon = $this->couponRepository->findById($id);
        if (!$coupon) {
            throw new \InvalidArgumentException('Coupon not found');
        }

        $coupon->activate();
        return $this->couponRepository->update($coupon);
    }

    public function deactivateCoupon(string $id): Coupon
    {
        $coupon = $this->couponRepository->findById($id);
        if (!$coupon) {
            throw new \InvalidArgumentException('Coupon not found');
        }

        $coupon->deactivate();
        return $this->couponRepository->update($coupon);
    }

    public function validateCoupon(string $code, float $orderAmount, array $productIds = [], array $categoryIds = []): ?Coupon
    {
        return $this->couponRepository->validateCode($code, $orderAmount, $productIds, $categoryIds);
    }

    public function recordCouponUsage(string $couponId, string $userId, string $orderId, float $discountAmount): void
    {
        $this->couponRepository->recordUsage($couponId, $userId, $orderId, $discountAmount);
    }

    public function getStatistics(): array
    {
        $activeCoupons = $this->couponRepository->findActive();
        $expiredCoupons = $this->couponRepository->findExpired();
        $upcomingCoupons = $this->couponRepository->findUpcoming();
        $usageStats = $this->couponRepository->getUsageStatistics();

        return [
            'total_active' => count($activeCoupons),
            'total_expired' => count($expiredCoupons),
            'total_upcoming' => count($upcomingCoupons),
            'usage_statistics' => $usageStats,
            'recent_coupons' => array_slice($activeCoupons, 0, 5)
        ];
    }

    private function validateCouponData(array $data): void
    {
        if (empty($data['code'])) {
            throw new \InvalidArgumentException('Code is required');
        }

        if (empty($data['name'])) {
            throw new \InvalidArgumentException('Name is required');
        }

        if (empty($data['description'])) {
            throw new \InvalidArgumentException('Description is required');
        }

        if (empty($data['type'])) {
            throw new \InvalidArgumentException('Type is required');
        }

        if (!in_array($data['type'], ['percentage', 'fixed', 'free_shipping'])) {
            throw new \InvalidArgumentException('Invalid coupon type');
        }

        if (!isset($data['value']) || $data['value'] <= 0) {
            throw new \InvalidArgumentException('Value must be greater than 0');
        }

        if ($data['type'] === 'percentage' && $data['value'] > 100) {
            throw new \InvalidArgumentException('Percentage value cannot exceed 100');
        }

        // Check if code already exists
        $existingCoupon = $this->couponRepository->findByCode($data['code']);
        if ($existingCoupon) {
            throw new \InvalidArgumentException('Coupon code already exists');
        }
    }

    private function formatCoupon(Coupon $coupon): array
    {
        return [
            'id' => $coupon->getId(),
            'code' => $coupon->getCode(),
            'name' => $coupon->getName(),
            'description' => $coupon->getDescription(),
            'type' => $coupon->getType(),
            'value' => $coupon->getValue(),
            'min_order_amount' => $coupon->getMinOrderAmount(),
            'max_discount_amount' => $coupon->getMaxDiscountAmount(),
            'is_active' => $coupon->isActive(),
            'is_single_use' => $coupon->isSingleUse(),
            'max_uses' => $coupon->getMaxUses(),
            'used_count' => $coupon->getUsedCount(),
            'start_date' => $coupon->getStartDate()?->format('Y-m-d H:i:s'),
            'end_date' => $coupon->getEndDate()?->format('Y-m-d H:i:s'),
            'applicable_categories' => $coupon->getApplicableCategories(),
            'excluded_categories' => $coupon->getExcludedCategories(),
            'applicable_products' => $coupon->getApplicableProducts(),
            'excluded_products' => $coupon->getExcludedProducts(),
            'first_time_only' => $coupon->isFirstTimeOnly(),
            'can_be_used' => $coupon->canBeUsed(),
            'created_at' => $coupon->getCreatedAt()->format('Y-m-d H:i:s'),
            'updated_at' => $coupon->getUpdatedAt()->format('Y-m-d H:i:s'),
        ];
    }
}
