<?php

namespace App\Domain\Entity;

class OrderItem
{
    private ?string $id = null;
    private string $orderId;
    private string $productId;
    private string $productName;
    private ?string $productSku = null;
    private int $quantity;
    private float $price;
    private ?string $productImage = null;
    private \DateTimeImmutable $createdAt;

    public function __construct(
        string $orderId,
        string $productId,
        string $productName,
        int $quantity,
        float $price,
        ?string $productSku = null,
        ?string $productImage = null
    ) {
        $this->orderId = $orderId;
        $this->productId = $productId;
        $this->productName = $productName;
        $this->quantity = $quantity;
        $this->price = $price;
        $this->productSku = $productSku;
        $this->productImage = $productImage;
        $this->createdAt = new \DateTimeImmutable();
    }

    // Getters
    public function getId(): ?string
    {
        return $this->id;
    }

    public function getOrderId(): string
    {
        return $this->orderId;
    }

    public function getProductId(): string
    {
        return $this->productId;
    }

    public function getProductName(): string
    {
        return $this->productName;
    }

    public function getProductSku(): ?string
    {
        return $this->productSku;
    }

    public function getQuantity(): int
    {
        return $this->quantity;
    }

    public function getPrice(): float
    {
        return $this->price;
    }

    public function getProductImage(): ?string
    {
        return $this->productImage;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    // Setters
    public function setId(string $id): void
    {
        $this->id = $id;
    }

    // Business logic
    public function getTotal(): float
    {
        return $this->price * $this->quantity;
    }

    public function updateQuantity(int $quantity): void
    {
        if ($quantity <= 0) {
            throw new \InvalidArgumentException('Quantity must be greater than 0');
        }
        $this->quantity = $quantity;
    }

    public function updatePrice(float $price): void
    {
        if ($price < 0) {
            throw new \InvalidArgumentException('Price cannot be negative');
        }
        $this->price = $price;
    }
}
