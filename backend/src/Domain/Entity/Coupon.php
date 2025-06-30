<?php

namespace App\Domain\Entity;

class Coupon
{
    private ?string $id = null;
    private string $code;
    private string $name;
    private string $description;
    private string $type; // 'percentage', 'fixed', 'free_shipping'
    private float $value;
    private ?float $minOrderAmount = null;
    private ?float $maxDiscountAmount = null;
    private bool $isActive = true;
    private bool $isSingleUse = false;
    private ?int $maxUses = null;
    private int $usedCount = 0;
    private ?\DateTimeImmutable $startDate = null;
    private ?\DateTimeImmutable $endDate = null;
    private array $applicableCategories = [];
    private array $excludedCategories = [];
    private array $applicableProducts = [];
    private array $excludedProducts = [];
    private bool $firstTimeOnly = false;
    private \DateTimeImmutable $createdAt;
    private \DateTimeImmutable $updatedAt;

    public function __construct(
        string $code,
        string $name,
        string $description,
        string $type,
        float $value
    ) {
        $this->code = strtoupper($code);
        $this->name = $name;
        $this->description = $description;
        $this->type = $type;
        $this->value = $value;
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
    }

    // Getters
    public function getId(): ?string
    {
        return $this->id;
    }

    public function getCode(): string
    {
        return $this->code;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function getType(): string
    {
        return $this->type;
    }

    public function getValue(): float
    {
        return $this->value;
    }

    public function getMinOrderAmount(): ?float
    {
        return $this->minOrderAmount;
    }

    public function getMaxDiscountAmount(): ?float
    {
        return $this->maxDiscountAmount;
    }

    public function isActive(): bool
    {
        return $this->isActive;
    }

    public function isSingleUse(): bool
    {
        return $this->isSingleUse;
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

    public function getApplicableCategories(): array
    {
        return $this->applicableCategories;
    }

    public function getExcludedCategories(): array
    {
        return $this->excludedCategories;
    }

    public function getApplicableProducts(): array
    {
        return $this->applicableProducts;
    }

    public function getExcludedProducts(): array
    {
        return $this->excludedProducts;
    }

    public function isFirstTimeOnly(): bool
    {
        return $this->firstTimeOnly;
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
        string $name,
        string $description,
        string $type,
        float $value
    ): void {
        $this->name = $name;
        $this->description = $description;
        $this->type = $type;
        $this->value = $value;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function setPricing(
        ?float $minOrderAmount = null,
        ?float $maxDiscountAmount = null
    ): void {
        $this->minOrderAmount = $minOrderAmount;
        $this->maxDiscountAmount = $maxDiscountAmount;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function setLimitations(
        bool $isSingleUse = false,
        ?int $maxUses = null,
        ?\DateTimeImmutable $startDate = null,
        ?\DateTimeImmutable $endDate = null,
        bool $firstTimeOnly = false
    ): void {
        $this->isSingleUse = $isSingleUse;
        $this->maxUses = $maxUses;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->firstTimeOnly = $firstTimeOnly;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function setScope(
        array $applicableCategories = [],
        array $excludedCategories = [],
        array $applicableProducts = [],
        array $excludedProducts = []
    ): void {
        $this->applicableCategories = $applicableCategories;
        $this->excludedCategories = $excludedCategories;
        $this->applicableProducts = $applicableProducts;
        $this->excludedProducts = $excludedProducts;
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

        if ($this->maxUses && $this->usedCount >= $this->maxUses) {
            return false;
        }

        return true;
    }

    public function calculateDiscount(float $orderAmount): float
    {
        if ($this->type === 'percentage') {
            $discount = ($orderAmount * $this->value) / 100;
        } elseif ($this->type === 'fixed') {
            $discount = $this->value;
        } else {
            $discount = 0; // free_shipping handled separately
        }

        if ($this->maxDiscountAmount && $discount > $this->maxDiscountAmount) {
            $discount = $this->maxDiscountAmount;
        }

        return $discount;
    }

    public function isApplicableToOrder(float $orderAmount, array $productIds = [], array $categoryIds = []): bool
    {
        if ($this->minOrderAmount && $orderAmount < $this->minOrderAmount) {
            return false;
        }

        // Check if any products are excluded
        foreach ($productIds as $productId) {
            if (in_array($productId, $this->excludedProducts)) {
                return false;
            }
        }

        // Check if any categories are excluded
        foreach ($categoryIds as $categoryId) {
            if (in_array($categoryId, $this->excludedCategories)) {
                return false;
            }
        }

        // If specific products are required, check if order contains them
        if (!empty($this->applicableProducts)) {
            $hasApplicableProduct = false;
            foreach ($productIds as $productId) {
                if (in_array($productId, $this->applicableProducts)) {
                    $hasApplicableProduct = true;
                    break;
                }
            }
            if (!$hasApplicableProduct) {
                return false;
            }
        }

        // If specific categories are required, check if order contains them
        if (!empty($this->applicableCategories)) {
            $hasApplicableCategory = false;
            foreach ($categoryIds as $categoryId) {
                if (in_array($categoryId, $this->applicableCategories)) {
                    $hasApplicableCategory = true;
                    break;
                }
            }
            if (!$hasApplicableCategory) {
                return false;
            }
        }

        return true;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'description' => $this->description,
            'type' => $this->type,
            'value' => $this->value,
            'min_order_amount' => $this->minOrderAmount,
            'max_discount_amount' => $this->maxDiscountAmount,
            'is_active' => $this->isActive,
            'is_single_use' => $this->isSingleUse,
            'max_uses' => $this->maxUses,
            'used_count' => $this->usedCount,
            'start_date' => $this->startDate?->format('Y-m-d H:i:s'),
            'end_date' => $this->endDate?->format('Y-m-d H:i:s'),
            'applicable_categories' => $this->applicableCategories ? json_encode($this->applicableCategories) : null,
            'excluded_categories' => $this->excludedCategories ? json_encode($this->excludedCategories) : null,
            'applicable_products' => $this->applicableProducts ? json_encode($this->applicableProducts) : null,
            'excluded_products' => $this->excludedProducts ? json_encode($this->excludedProducts) : null,
            'first_time_only' => $this->firstTimeOnly,
            'created_at' => $this->createdAt->format('Y-m-d H:i:s'),
            'updated_at' => $this->updatedAt->format('Y-m-d H:i:s'),
        ];
    }
}
