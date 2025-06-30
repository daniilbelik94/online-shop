<?php

namespace App\Application\Service;

use App\Domain\Entity\Offer;
use App\Domain\Repository\OfferRepositoryInterface;
use App\Domain\Repository\ProductRepositoryInterface;
use App\Domain\Repository\CategoryRepositoryInterface;

class OfferService
{
    private OfferRepositoryInterface $offerRepository;
    private ProductRepositoryInterface $productRepository;
    private CategoryRepositoryInterface $categoryRepository;

    public function __construct(
        OfferRepositoryInterface $offerRepository,
        ProductRepositoryInterface $productRepository,
        CategoryRepositoryInterface $categoryRepository
    ) {
        $this->offerRepository = $offerRepository;
        $this->productRepository = $productRepository;
        $this->categoryRepository = $categoryRepository;
    }

    public function getOffers(array $filters = [], int $page = 1, int $limit = 20): array
    {
        $offset = ($page - 1) * $limit;

        // Get offers based on filters
        if (!empty($filters['type'])) {
            $offers = $this->offerRepository->findByType($filters['type']);
        } elseif (!empty($filters['category_id'])) {
            $offers = $this->offerRepository->findActiveByCategory($filters['category_id']);
        } elseif (isset($filters['active'])) {
            if ($filters['active']) {
                $offers = $this->offerRepository->findActive();
            } else {
                $offers = $this->offerRepository->findExpired();
            }
        } else {
            $offers = $this->offerRepository->findActive();
        }

        // Apply pagination
        $total = count($offers);
        $offers = array_slice($offers, $offset, $limit);

        // Format offers for response
        $formattedOffers = [];
        foreach ($offers as $offer) {
            $formattedOffers[] = $this->formatOffer($offer);
        }

        return [
            'data' => $formattedOffers,
            'pagination' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'pages' => ceil($total / $limit)
            ]
        ];
    }

    public function getOffer(string $id): ?Offer
    {
        return $this->offerRepository->findById($id);
    }

    public function createOffer(array $data): Offer
    {
        $this->validateOfferData($data);

        $offer = new Offer(
            $data['title'],
            $data['description'],
            $data['type'],
            (float) $data['discount_percent']
        );

        // Set pricing
        if (isset($data['min_order_amount']) || isset($data['max_discount_amount'])) {
            $offer->setPricing(
                (float) $data['discount_percent'],
                isset($data['min_order_amount']) ? (float) $data['min_order_amount'] : null,
                isset($data['max_discount_amount']) ? (float) $data['max_discount_amount'] : null
            );
        }

        // Set scope
        if (isset($data['product_id']) || isset($data['category_id'])) {
            $offer->setScope(
                $data['product_id'] ?? null,
                $data['category_id'] ?? null
            );
        }

        // Set limitations
        if (
            isset($data['is_limited']) || isset($data['max_uses']) ||
            isset($data['start_date']) || isset($data['end_date'])
        ) {

            $startDate = isset($data['start_date']) ? new \DateTimeImmutable($data['start_date']) : null;
            $endDate = isset($data['end_date']) ? new \DateTimeImmutable($data['end_date']) : null;

            $offer->setLimitations(
                $data['is_limited'] ?? false,
                isset($data['max_uses']) ? (int) $data['max_uses'] : null,
                $startDate,
                $endDate
            );
        }

        // Set image URL
        if (isset($data['image_url'])) {
            $offer->setImageUrl($data['image_url']);
        }

        // Set conditions
        if (isset($data['conditions'])) {
            $offer->setConditions($data['conditions']);
        }

        // Set active status
        if (isset($data['is_active']) && !$data['is_active']) {
            $offer->deactivate();
        }

        return $this->offerRepository->save($offer);
    }

    public function updateOffer(string $id, array $data): Offer
    {
        $offer = $this->offerRepository->findById($id);
        if (!$offer) {
            throw new \InvalidArgumentException('Offer not found');
        }

        // Update basic details
        if (
            isset($data['title']) || isset($data['description']) ||
            isset($data['type']) || isset($data['discount_percent'])
        ) {

            $offer->updateDetails(
                $data['title'] ?? $offer->getTitle(),
                $data['description'] ?? $offer->getDescription(),
                $data['type'] ?? $offer->getType(),
                isset($data['discount_percent']) ? (float) $data['discount_percent'] : $offer->getDiscountPercent()
            );
        }

        // Update pricing
        if (isset($data['min_order_amount']) || isset($data['max_discount_amount'])) {
            $offer->setPricing(
                $offer->getDiscountPercent(),
                isset($data['min_order_amount']) ? (float) $data['min_order_amount'] : $offer->getMinOrderAmount(),
                isset($data['max_discount_amount']) ? (float) $data['max_discount_amount'] : $offer->getMaxDiscountAmount()
            );
        }

        // Update scope
        if (isset($data['product_id']) || isset($data['category_id'])) {
            $offer->setScope(
                $data['product_id'] ?? $offer->getProductId(),
                $data['category_id'] ?? $offer->getCategoryId()
            );
        }

        // Update limitations
        if (
            isset($data['is_limited']) || isset($data['max_uses']) ||
            isset($data['start_date']) || isset($data['end_date'])
        ) {

            $startDate = isset($data['start_date']) ? new \DateTimeImmutable($data['start_date']) : $offer->getStartDate();
            $endDate = isset($data['end_date']) ? new \DateTimeImmutable($data['end_date']) : $offer->getEndDate();

            $offer->setLimitations(
                $data['is_limited'] ?? $offer->isLimited(),
                isset($data['max_uses']) ? (int) $data['max_uses'] : $offer->getMaxUses(),
                $startDate,
                $endDate
            );
        }

        // Update image URL
        if (isset($data['image_url'])) {
            $offer->setImageUrl($data['image_url']);
        }

        // Update conditions
        if (isset($data['conditions'])) {
            $offer->setConditions($data['conditions']);
        }

        // Update active status
        if (isset($data['is_active'])) {
            if ($data['is_active']) {
                $offer->activate();
            } else {
                $offer->deactivate();
            }
        }

        return $this->offerRepository->save($offer);
    }

    public function deleteOffer(string $id): void
    {
        $offer = $this->offerRepository->findById($id);
        if (!$offer) {
            throw new \InvalidArgumentException('Offer not found');
        }

        $this->offerRepository->delete($id);
    }

    public function activateOffer(string $id): Offer
    {
        $offer = $this->offerRepository->findById($id);
        if (!$offer) {
            throw new \InvalidArgumentException('Offer not found');
        }

        $offer->activate();
        return $this->offerRepository->save($offer);
    }

    public function deactivateOffer(string $id): Offer
    {
        $offer = $this->offerRepository->findById($id);
        if (!$offer) {
            throw new \InvalidArgumentException('Offer not found');
        }

        $offer->deactivate();
        return $this->offerRepository->save($offer);
    }

    public function getStatistics(): array
    {
        $activeOffers = $this->offerRepository->findActive();
        $expiredOffers = $this->offerRepository->findExpired();
        $upcomingOffers = $this->offerRepository->findUpcoming();
        $usageStats = $this->offerRepository->getUsageStatistics();

        return [
            'total_active' => count($activeOffers),
            'total_expired' => count($expiredOffers),
            'total_upcoming' => count($upcomingOffers),
            'usage_statistics' => $usageStats,
            'recent_offers' => array_slice($activeOffers, 0, 5)
        ];
    }

    public function getApplicableOffers(string $productId, ?string $categoryId = null): array
    {
        $offers = $this->offerRepository->findActive();
        $applicableOffers = [];

        foreach ($offers as $offer) {
            if ($offer->isApplicableToProduct($productId, $categoryId)) {
                $applicableOffers[] = $this->formatOffer($offer);
            }
        }

        return $applicableOffers;
    }

    private function validateOfferData(array $data): void
    {
        if (empty($data['title'])) {
            throw new \InvalidArgumentException('Title is required');
        }

        if (empty($data['description'])) {
            throw new \InvalidArgumentException('Description is required');
        }

        if (empty($data['type'])) {
            throw new \InvalidArgumentException('Type is required');
        }

        if (!in_array($data['type'], ['flash', 'weekend', 'clearance', 'student', 'new'])) {
            throw new \InvalidArgumentException('Invalid offer type');
        }

        if (!isset($data['discount_percent']) || $data['discount_percent'] <= 0 || $data['discount_percent'] > 100) {
            throw new \InvalidArgumentException('Discount percent must be between 0 and 100');
        }

        // Validate product_id if provided
        if (isset($data['product_id']) && !empty($data['product_id'])) {
            $product = $this->productRepository->findById($data['product_id']);
            if (!$product) {
                throw new \InvalidArgumentException('Product not found');
            }
        }

        // Validate category_id if provided
        if (isset($data['category_id']) && !empty($data['category_id'])) {
            $category = $this->categoryRepository->findById($data['category_id']);
            if (!$category) {
                throw new \InvalidArgumentException('Category not found');
            }
        }
    }

    private function formatOffer(Offer $offer): array
    {
        return [
            'id' => $offer->getId(),
            'title' => $offer->getTitle(),
            'description' => $offer->getDescription(),
            'type' => $offer->getType(),
            'discount_percent' => $offer->getDiscountPercent(),
            'min_order_amount' => $offer->getMinOrderAmount(),
            'max_discount_amount' => $offer->getMaxDiscountAmount(),
            'product_id' => $offer->getProductId(),
            'category_id' => $offer->getCategoryId(),
            'is_active' => $offer->isActive(),
            'is_limited' => $offer->isLimited(),
            'max_uses' => $offer->getMaxUses(),
            'used_count' => $offer->getUsedCount(),
            'start_date' => $offer->getStartDate()?->format('Y-m-d H:i:s'),
            'end_date' => $offer->getEndDate()?->format('Y-m-d H:i:s'),
            'image_url' => $offer->getImageUrl(),
            'conditions' => $offer->getConditions(),
            'can_be_used' => $offer->canBeUsed(),
            'created_at' => $offer->getCreatedAt()->format('Y-m-d H:i:s'),
            'updated_at' => $offer->getUpdatedAt()->format('Y-m-d H:i:s'),
        ];
    }
}
