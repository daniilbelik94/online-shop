<?php

namespace App\Application\Service;

use App\Domain\Entity\Category;
use App\Domain\Repository\CategoryRepositoryInterface;

class CategoryService
{
    private CategoryRepositoryInterface $categoryRepository;

    public function __construct(CategoryRepositoryInterface $categoryRepository)
    {
        $this->categoryRepository = $categoryRepository;
    }

    public function getActiveCategories(): array
    {
        $categories = $this->categoryRepository->findActive();
        return array_map([$this, 'formatCategory'], $categories);
    }

    public function getHierarchicalCategories(): array
    {
        $categories = $this->categoryRepository->findHierarchical();
        return $this->buildHierarchy(array_map([$this, 'formatCategory'], $categories));
    }

    public function getRootCategories(): array
    {
        $categories = $this->categoryRepository->findRootCategories();
        return array_map([$this, 'formatCategory'], $categories);
    }

    public function getCategoryById(string $id): ?array
    {
        $category = $this->categoryRepository->findById($id);
        return $category ? $this->formatCategory($category) : null;
    }

    public function getCategoryBySlug(string $slug): ?array
    {
        $category = $this->categoryRepository->findBySlug($slug);
        return $category ? $this->formatCategory($category) : null;
    }

    public function getChildCategories(string $parentId): array
    {
        $categories = $this->categoryRepository->findByParent($parentId);
        return array_map([$this, 'formatCategory'], $categories);
    }

    private function formatCategory(Category $category): array
    {
        return [
            'id' => $category->getId(),
            'name' => $category->getName(),
            'slug' => $category->getSlug(),
            'description' => $category->getDescription(),
            'parent_id' => $category->getParentId(),
            'image_url' => $category->getImageUrl(),
            'is_active' => $category->isActive(),
            'sort_order' => $category->getSortOrder(),
            'created_at' => $category->getCreatedAt()->format('Y-m-d H:i:s'),
            'updated_at' => $category->getUpdatedAt()->format('Y-m-d H:i:s')
        ];
    }

    private function buildHierarchy(array $categories): array
    {
        $hierarchy = [];
        $lookup = [];

        // Create lookup array and initialize children
        foreach ($categories as $category) {
            $category['children'] = [];
            $lookup[$category['id']] = $category;
        }

        // Build hierarchy
        foreach ($lookup as $id => $category) {
            if ($category['parent_id'] === null) {
                $hierarchy[] = &$lookup[$id];
            } else {
                if (isset($lookup[$category['parent_id']])) {
                    $lookup[$category['parent_id']]['children'][] = &$lookup[$id];
                }
            }
        }

        return $hierarchy;
    }
}
