<?php

namespace App\Domain\Entity;

class ProductReview
{
    public function __construct(
        public readonly string $id,
        public readonly string $userId,
        public readonly string $productId,
        public readonly int $rating,
        public readonly ?string $title,
        public readonly ?string $comment,
        public readonly bool $verifiedPurchase,
        public readonly int $helpfulCount,
        public readonly \DateTime $createdAt,
        public readonly \DateTime $updatedAt,
        public readonly ?array $user = null
    ) {}

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->userId,
            'product_id' => $this->productId,
            'rating' => $this->rating,
            'title' => $this->title,
            'comment' => $this->comment,
            'verified_purchase' => $this->verifiedPurchase,
            'helpful_count' => $this->helpfulCount,
            'created_at' => $this->createdAt->format('Y-m-d H:i:s'),
            'updated_at' => $this->updatedAt->format('Y-m-d H:i:s'),
            'user' => $this->user
        ];
    }
}
