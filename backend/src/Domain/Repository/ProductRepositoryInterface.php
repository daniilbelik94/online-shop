<?php

namespace App\Domain\Repository;

use App\Domain\Entity\Product;

interface ProductRepositoryInterface
{
    public function findById(string $id): ?Product;

    public function findBySlug(string $slug): ?Product;

    public function findBySku(string $sku): ?Product;

    public function save(Product $product): void;

    public function delete(string $id): bool;

    public function findAll(int $limit = 50, int $offset = 0): array;

    public function findActive(int $limit = 50, int $offset = 0): array;

    public function findFeatured(int $limit = 50, int $offset = 0): array;

    public function findByCategory(string $categoryId, int $limit = 50, int $offset = 0): array;

    public function findByBrand(string $brand, int $limit = 50, int $offset = 0): array;

    public function search(string $query, int $limit = 50, int $offset = 0): array;

    public function findLowStock(): array;

    public function countAll(): int;

    public function countActive(): int;

    public function skuExists(string $sku): bool;

    public function slugExists(string $slug): bool;

    public function findAdvanced(array $filters = [], string $sort = 'created_at_desc', int $limit = 50, int $offset = 0): array;

    public function countAdvanced(array $filters = []): int;

    public function update(Product $product): Product;
}
