<?php

namespace App\Domain\Repository;

use App\Domain\Entity\Offer;

interface OfferRepositoryInterface
{
    public function save(Offer $offer): Offer;
    public function findById(string $id): ?Offer;
    public function findByType(string $type): array;
    public function findActive(): array;
    public function findActiveByCategory(string $categoryId): array;
    public function findActiveByProduct(string $productId): array;
    public function findExpired(): array;
    public function findUpcoming(): array;
    public function delete(string $id): bool;
    public function countActive(): int;
    public function getUsageStatistics(): array;
}
