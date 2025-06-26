<?php

namespace App\Domain\Entity;

use DateTime;

class Wishlist
{
    private string $id;
    private string $userId;
    private string $productId;
    private DateTime $createdAt;

    public function __construct(
        string $id,
        string $userId,
        string $productId,
        DateTime $createdAt
    ) {
        $this->id = $id;
        $this->userId = $userId;
        $this->productId = $productId;
        $this->createdAt = $createdAt;
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function getUserId(): string
    {
        return $this->userId;
    }

    public function getProductId(): string
    {
        return $this->productId;
    }

    public function getCreatedAt(): DateTime
    {
        return $this->createdAt;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->userId,
            'product_id' => $this->productId,
            'created_at' => $this->createdAt->format('Y-m-d\TH:i:s\Z')
        ];
    }
}
