<?php

namespace App\Domain\Entity;

class Product
{
    private ?string $id = null;
    private string $name;
    private string $slug;
    private ?string $description = null;
    private ?string $shortDescription = null;
    private string $sku;
    private float $price;
    private ?float $comparePrice = null;
    private ?float $costPrice = null;
    private ?float $weight = null;
    private ?string $dimensions = null;
    private int $stockQuantity = 0;
    private int $lowStockThreshold = 10;
    private bool $manageStock = true;
    private string $stockStatus = 'in_stock';
    private bool $isActive = true;
    private bool $isFeatured = false;
    private ?string $categoryId = null;
    private ?string $brand = null;
    private \DateTimeImmutable $createdAt;
    private \DateTimeImmutable $updatedAt;

    public function __construct(
        string $name,
        string $slug,
        string $sku,
        float $price
    ) {
        $this->name = $name;
        $this->slug = $slug;
        $this->sku = $sku;
        $this->price = $price;
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
    }

    // Getters
    public function getId(): ?string
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getSlug(): string
    {
        return $this->slug;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function getShortDescription(): ?string
    {
        return $this->shortDescription;
    }

    public function getSku(): string
    {
        return $this->sku;
    }

    public function getPrice(): float
    {
        return $this->price;
    }

    public function getComparePrice(): ?float
    {
        return $this->comparePrice;
    }

    public function getCostPrice(): ?float
    {
        return $this->costPrice;
    }

    public function getWeight(): ?float
    {
        return $this->weight;
    }

    public function getDimensions(): ?string
    {
        return $this->dimensions;
    }

    public function getStockQuantity(): int
    {
        return $this->stockQuantity;
    }

    public function getLowStockThreshold(): int
    {
        return $this->lowStockThreshold;
    }

    public function isManageStock(): bool
    {
        return $this->manageStock;
    }

    public function getStockStatus(): string
    {
        return $this->stockStatus;
    }

    public function isActive(): bool
    {
        return $this->isActive;
    }

    public function isFeatured(): bool
    {
        return $this->isFeatured;
    }

    public function getCategoryId(): ?string
    {
        return $this->categoryId;
    }

    public function getBrand(): ?string
    {
        return $this->brand;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): \DateTimeImmutable
    {
        return $this->updatedAt;
    }

    // Setters for mutable properties
    public function setId(string $id): void
    {
        $this->id = $id;
    }

    public function updateDetails(
        string $name,
        ?string $description = null,
        ?string $shortDescription = null,
        ?string $brand = null
    ): void {
        $this->name = $name;
        $this->description = $description;
        $this->shortDescription = $shortDescription;
        $this->brand = $brand;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function updatePricing(float $price, ?float $comparePrice = null, ?float $costPrice = null): void
    {
        $this->price = $price;
        $this->comparePrice = $comparePrice;
        $this->costPrice = $costPrice;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function updateInventory(int $stockQuantity, int $lowStockThreshold = 10): void
    {
        $this->stockQuantity = $stockQuantity;
        $this->lowStockThreshold = $lowStockThreshold;
        $this->updateStockStatus();
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function setCategory(string $categoryId): void
    {
        $this->categoryId = $categoryId;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function setFeatured(bool $featured): void
    {
        $this->isFeatured = $featured;
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

    public function adjustStock(int $adjustment): void
    {
        $this->stockQuantity += $adjustment;
        if ($this->stockQuantity < 0) {
            $this->stockQuantity = 0;
        }
        $this->updateStockStatus();
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function isInStock(): bool
    {
        return $this->stockStatus === 'in_stock' && $this->stockQuantity > 0;
    }

    public function isLowStock(): bool
    {
        return $this->stockQuantity <= $this->lowStockThreshold && $this->stockQuantity > 0;
    }

    private function updateStockStatus(): void
    {
        if ($this->stockQuantity <= 0) {
            $this->stockStatus = 'out_of_stock';
        } else {
            $this->stockStatus = 'in_stock';
        }
    }
}
