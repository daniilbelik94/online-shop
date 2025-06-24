<?php

namespace App\Domain\Repository;

use App\Domain\Entity\Category;

interface CategoryRepositoryInterface
{
    public function findById(string $id): ?Category;

    public function findBySlug(string $slug): ?Category;

    public function save(Category $category): void;

    public function delete(string $id): bool;

    public function findAll(): array;

    public function findActive(): array;

    public function findByParent(?string $parentId): array;

    public function findHierarchical(): array;

    public function findRootCategories(): array;

    public function slugExists(string $slug): bool;
}
