<?php

namespace App\Infrastructure\Persistence\Postgres;

use App\Domain\Entity\Category;
use App\Domain\Repository\CategoryRepositoryInterface;
use PDO;

class PostgresCategoryRepository implements CategoryRepositoryInterface
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function findById(string $id): ?Category
    {
        $stmt = $this->pdo->prepare('
            SELECT * FROM categories WHERE id = :id
        ');
        $stmt->execute(['id' => $id]);

        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        return $data ? $this->hydrate($data) : null;
    }

    public function findBySlug(string $slug): ?Category
    {
        $stmt = $this->pdo->prepare('
            SELECT * FROM categories WHERE slug = :slug
        ');
        $stmt->execute(['slug' => $slug]);

        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        return $data ? $this->hydrate($data) : null;
    }

    public function save(Category $category): void
    {
        if ($category->getId() === null) {
            $this->insert($category);
        } else {
            $this->update($category);
        }
    }

    public function delete(string $id): bool
    {
        $stmt = $this->pdo->prepare('DELETE FROM categories WHERE id = :id');
        $stmt->execute(['id' => $id]);

        return $stmt->rowCount() > 0;
    }

    public function findAll(): array
    {
        $stmt = $this->pdo->prepare('
            SELECT * FROM categories 
            ORDER BY name ASC
        ');
        $stmt->execute();

        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map([$this, 'hydrate'], $data);
    }

    public function findActive(): array
    {
        $stmt = $this->pdo->prepare('
            SELECT * FROM categories 
            ORDER BY name ASC
        ');
        $stmt->execute();

        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map([$this, 'hydrate'], $data);
    }

    public function findByParent(?string $parentId): array
    {
        if ($parentId === null) {
            $stmt = $this->pdo->prepare('
                SELECT * FROM categories 
                WHERE parent_id IS NULL
                ORDER BY name ASC
            ');
            $stmt->execute();
        } else {
            $stmt = $this->pdo->prepare('
                SELECT * FROM categories 
                WHERE parent_id = :parent_id
                ORDER BY name ASC
            ');
            $stmt->execute(['parent_id' => $parentId]);
        }

        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map([$this, 'hydrate'], $data);
    }

    public function findHierarchical(): array
    {
        $stmt = $this->pdo->prepare('
            WITH RECURSIVE category_tree AS (
                -- Base case: root categories
                SELECT id, name, slug, description, parent_id, 
                       created_at, updated_at, 0 as level
                FROM categories 
                WHERE parent_id IS NULL
                
                UNION ALL
                
                -- Recursive case: child categories
                SELECT c.id, c.name, c.slug, c.description, c.parent_id,
                       c.created_at, c.updated_at, ct.level + 1
                FROM categories c
                INNER JOIN category_tree ct ON c.parent_id = ct.id
            )
            SELECT * FROM category_tree 
            ORDER BY level, name ASC
        ');
        $stmt->execute();

        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map([$this, 'hydrate'], $data);
    }

    public function findRootCategories(): array
    {
        return $this->findByParent(null);
    }

    public function slugExists(string $slug): bool
    {
        $stmt = $this->pdo->prepare('SELECT COUNT(*) FROM categories WHERE slug = :slug');
        $stmt->execute(['slug' => $slug]);

        return (int) $stmt->fetchColumn() > 0;
    }

    private function insert(Category $category): void
    {
        $id = $this->generateUuid();

        $stmt = $this->pdo->prepare('
            INSERT INTO categories (
                id, name, slug, description, parent_id, created_at, updated_at
            ) VALUES (
                :id, :name, :slug, :description, :parent_id, :created_at, :updated_at
            )
        ');

        $stmt->execute([
            'id' => $id,
            'name' => $category->getName(),
            'slug' => $category->getSlug(),
            'description' => $category->getDescription(),
            'parent_id' => $category->getParentId(),
            'created_at' => $category->getCreatedAt()->format('Y-m-d H:i:s'),
            'updated_at' => $category->getUpdatedAt()->format('Y-m-d H:i:s')
        ]);

        $category->setId($id);
    }

    private function update(Category $category): void
    {
        $stmt = $this->pdo->prepare('
            UPDATE categories SET
                name = :name,
                slug = :slug,
                description = :description,
                parent_id = :parent_id,
                updated_at = :updated_at
            WHERE id = :id
        ');

        $stmt->execute([
            'id' => $category->getId(),
            'name' => $category->getName(),
            'slug' => $category->getSlug(),
            'description' => $category->getDescription(),
            'parent_id' => $category->getParentId(),
            'updated_at' => $category->getUpdatedAt()->format('Y-m-d H:i:s')
        ]);
    }

    private function hydrate(array $data): Category
    {
        $category = new Category($data['name'], $data['slug']);
        $category->setId($data['id']);

        if (!empty($data['description'])) {
            $category->updateDetails($data['name'], $data['description'], null);
        }

        if (!empty($data['parent_id'])) {
            $category->setParent($data['parent_id']);
        }

        return $category;
    }

    private function generateUuid(): string
    {
        $stmt = $this->pdo->query('SELECT gen_random_uuid()');
        return $stmt->fetchColumn();
    }
}
