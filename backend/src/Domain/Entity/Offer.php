<?php

namespace App\Domain\Entity;

class Offer
{
    private ?string $id = null;
    private string $title;
    private string $description;
    private string $type; // 'flash', 'weekend', 'clearance', 'student', 'new'
    private float $discountPercent;
    private ?float $minOrderAmount = null;
    private ?float $maxDiscountAmount = null;
    private ?string $productId = null;
    private ?string $categoryId = null;
    private bool $isActive = true;
    private bool $isLimited = false;
    private ?int $maxUses = null;
    private int $usedCount = 0;
    private ?\DateTimeImmutable $startDate = null;
    private ?\DateTimeImmutable $endDate = null;
    private ?string $imageUrl = null;
    private array $conditions = [];
    private \DateTimeImmutable $createdAt;
    private \DateTimeImmutable $updatedAt;

    public function __construct(
        string $title,
        string $description,
        string $type,
        float $discountPercent
    ) {
        $this->title = $title;
        $this->description = $description;
        $this->type = $type;
        $this->discountPercent = $discountPercent;
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
    }

    // Getters
    public function getId(): ?string
    {
        return $this->id;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function getType(): string
    {
        return $this->type;
    }

    public function getDiscountPercent(): float
    {
        return $this->discountPercent;
    }

    public function getMinOrderAmount(): ?float
    {
        return $this->minOrderAmount;
    }

    public function getMaxDiscountAmount(): ?float
    {
        return $this->maxDiscountAmount;
    }

    public function getProductId(): ?string
    {
        return $this->productId;
    }

    public function getCategoryId(): ?string
    {
        return $this->categoryId;
    }

    public function isActive(): bool
    {
        return $this->isActive;
    }

    public function isLimited(): bool
    {
        return $this->isLimited;
    }

    public function getMaxUses(): ?int
    {
        return $this->maxUses;
    }

    public function getUsedCount(): int
    {
        return $this->usedCount;
    }

    public function getStartDate(): ?\DateTimeImmutable
    {
        return $this->startDate;
    }

    public function getEndDate(): ?\DateTimeImmutable
    {
        return $this->endDate;
    }

    public function getImageUrl(): ?string
    {
        return $this->imageUrl;
    }

    public function getConditions(): array
    {
        return $this->conditions;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): \DateTimeImmutable
    {
        return $this->updatedAt;
    }

    // Setters
    public function setId(string $id): void
    {
        $this->id = $id;
    }

    public function updateDetails(
        string $title,
        string $description,
        string $type,
        float $discountPercent
    ): void {
        $this->title = $title;
        $this->description = $description;
        $this->type = $type;
        $this->discountPercent = $discountPercent;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function setPricing(
        float $discountPercent,
        ?float $minOrderAmount = null,
        ?float $maxDiscountAmount = null
    ): void {
        $this->discountPercent = $discountPercent;
        $this->minOrderAmount = $minOrderAmount;
        $this->maxDiscountAmount = $maxDiscountAmount;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function setScope(?string $productId = null, ?string $categoryId = null): void
    {
        $this->productId = $productId;
        $this->categoryId = $categoryId;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function setLimitations(
        bool $isLimited = false,
        ?int $maxUses = null,
        ?\DateTimeImmutable $startDate = null,
        ?\DateTimeImmutable $endDate = null
    ): void {
        $this->isLimited = $isLimited;
        $this->maxUses = $maxUses;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function setImageUrl(?string $imageUrl): void
    {
        $this->imageUrl = $imageUrl;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function setConditions(array $conditions): void
    {
        $this->conditions = $conditions;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function activate(): void
    {
        $this->isActive = true;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function deactivate(): void
    {
        $this->isActive = false;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function incrementUsage(): void
    {
        $this->usedCount++;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function canBeUsed(): bool
    {
        if (!$this->isActive) {
            return false;
        }

        $now = new \DateTimeImmutable();

        if ($this->startDate && $now < $this->startDate) {
            return false;
        }

        if ($this->endDate && $now > $this->endDate) {
            return false;
        }

        if ($this->isLimited && $this->maxUses && $this->usedCount >= $this->maxUses) {
            return false;
        }

        return true;
    }

    public function calculateDiscount(float $orderAmount): float
    {
        $discount = ($orderAmount * $this->discountPercent) / 100;

        if ($this->maxDiscountAmount && $discount > $this->maxDiscountAmount) {
            $discount = $this->maxDiscountAmount;
        }

        return $discount;
    }

    public function isApplicableToProduct(string $productId, ?string $categoryId = null): bool
    {
        if ($this->productId && $this->productId !== $productId) {
            return false;
        }

        if ($this->categoryId && $this->categoryId !== $categoryId) {
            return false;
        }

        return true;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'type' => $this->type,
            'discount_percent' => $this->discountPercent,
            'min_order_amount' => $this->minOrderAmount,
            'max_discount_amount' => $this->maxDiscountAmount,
            'product_id' => $this->productId,
            'category_id' => $this->categoryId,
            'is_active' => $this->isActive,
            'is_limited' => $this->isLimited,
            'max_uses' => $this->maxUses,
            'used_count' => $this->usedCount,
            'start_date' => $this->startDate?->format('Y-m-d H:i:s'),
            'end_date' => $this->endDate?->format('Y-m-d H:i:s'),
            'image_url' => $this->imageUrl,
            'conditions' => json_encode($this->conditions),
            'created_at' => $this->createdAt->format('Y-m-d H:i:s'),
            'updated_at' => $this->updatedAt->format('Y-m-d H:i:s'),
        ];
    }
}
