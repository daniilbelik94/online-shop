<?php

namespace App\Infrastructure\Persistence\Postgres;

use App\Domain\Entity\Product;
use App\Domain\Repository\ProductRepositoryInterface;
use PDO;

class PostgresProductRepository implements ProductRepositoryInterface
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function findById(string $id): ?Product
    {
        $stmt = $this->pdo->prepare('
            SELECT p.*, c.name as category_name 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.id = :id
        ');
        $stmt->execute(['id' => $id]);

        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        return $data ? $this->hydrate($data) : null;
    }

    public function findBySlug(string $slug): ?Product
    {
        $stmt = $this->pdo->prepare('
            SELECT p.*, c.name as category_name 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.slug = :slug AND p.is_active = true
        ');
        $stmt->execute(['slug' => $slug]);

        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        return $data ? $this->hydrate($data) : null;
    }

    public function findBySku(string $sku): ?Product
    {
        $stmt = $this->pdo->prepare('
            SELECT p.*, c.name as category_name 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.sku = :sku
        ');
        $stmt->execute(['sku' => $sku]);

        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        return $data ? $this->hydrate($data) : null;
    }

    public function save(Product $product): void
    {
        if ($product->getId() === null) {
            $this->insert($product);
        } else {
            $this->update($product);
        }
    }

    public function delete(string $id): bool
    {
        $stmt = $this->pdo->prepare('UPDATE products SET is_active = false WHERE id = :id');
        $stmt->execute(['id' => $id]);

        return $stmt->rowCount() > 0;
    }

    public function findAll(int $limit = 50, int $offset = 0): array
    {
        $stmt = $this->pdo->prepare('
            SELECT p.*, c.name as category_name 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            ORDER BY p.created_at DESC
            LIMIT :limit OFFSET :offset
        ');
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map([$this, 'hydrate'], $data);
    }

    public function findActive(int $limit = 50, int $offset = 0): array
    {
        $stmt = $this->pdo->prepare('
            SELECT p.*, c.name as category_name 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.is_active = true
            ORDER BY p.created_at DESC
            LIMIT :limit OFFSET :offset
        ');
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map([$this, 'hydrate'], $data);
    }

    public function findFeatured(int $limit = 50, int $offset = 0): array
    {
        $stmt = $this->pdo->prepare('
            SELECT p.*, c.name as category_name 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.is_active = true AND p.is_featured = true
            ORDER BY p.created_at DESC
            LIMIT :limit OFFSET :offset
        ');
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map([$this, 'hydrate'], $data);
    }

    public function findByCategory(string $categoryId, int $limit = 50, int $offset = 0): array
    {
        $stmt = $this->pdo->prepare('
            SELECT p.*, c.name as category_name 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.category_id = :category_id AND p.is_active = true
            ORDER BY p.created_at DESC
            LIMIT :limit OFFSET :offset
        ');
        $stmt->bindValue(':category_id', $categoryId);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map([$this, 'hydrate'], $data);
    }

    public function findByBrand(string $brand, int $limit = 50, int $offset = 0): array
    {
        $stmt = $this->pdo->prepare('
            SELECT p.*, c.name as category_name 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.brand = :brand AND p.is_active = true
            ORDER BY p.created_at DESC
            LIMIT :limit OFFSET :offset
        ');
        $stmt->bindValue(':brand', $brand);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map([$this, 'hydrate'], $data);
    }

    public function search(string $query, int $limit = 50, int $offset = 0): array
    {
        $searchTerm = '%' . $query . '%';

        $stmt = $this->pdo->prepare('
            SELECT p.*, c.name as category_name 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.is_active = true 
            AND (
                p.name ILIKE :search 
                OR p.description ILIKE :search 
                OR p.short_description ILIKE :search
                OR p.brand ILIKE :search
                OR p.sku ILIKE :search
            )
            ORDER BY 
                CASE 
                    WHEN p.name ILIKE :search THEN 1
                    WHEN p.short_description ILIKE :search THEN 2
                    WHEN p.brand ILIKE :search THEN 3
                    WHEN p.sku ILIKE :search THEN 4
                    ELSE 5
                END,
                p.created_at DESC
            LIMIT :limit OFFSET :offset
        ');

        $stmt->bindValue(':search', $searchTerm);
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map([$this, 'hydrate'], $data);
    }

    public function findAdvanced(array $filters = [], string $sort = 'created_at_desc', int $limit = 50, int $offset = 0): array
    {
        $conditions = ['p.is_active = true'];
        $params = [];

        // Category filter
        if (!empty($filters['category_id'])) {
            $conditions[] = 'p.category_id = :category_id';
            $params['category_id'] = $filters['category_id'];
        }

        // Search filter
        if (!empty($filters['search'])) {
            $searchTerm = '%' . $filters['search'] . '%';
            $conditions[] = '(p.name ILIKE :search OR p.description ILIKE :search OR p.brand ILIKE :search)';
            $params['search'] = $searchTerm;
        }

        // Brand filter
        if (!empty($filters['brand'])) {
            $conditions[] = 'p.brand = :brand';
            $params['brand'] = $filters['brand'];
        }

        // Price range filter
        if (!empty($filters['min_price'])) {
            $conditions[] = 'p.price >= :min_price';
            $params['min_price'] = $filters['min_price'];
        }

        if (!empty($filters['max_price'])) {
            $conditions[] = 'p.price <= :max_price';
            $params['max_price'] = $filters['max_price'];
        }

        // Stock filter
        if (!empty($filters['in_stock'])) {
            $conditions[] = 'p.stock_quantity > 0';
        }

        // Featured filter
        if (!empty($filters['featured'])) {
            $conditions[] = 'p.is_featured = true';
        }

        // Build ORDER BY clause
        $orderBy = match ($sort) {
            'price_asc' => 'p.price ASC',
            'price_desc' => 'p.price DESC',
            'name_asc' => 'p.name ASC',
            'name_desc' => 'p.name DESC',
            'created_at_asc' => 'p.created_at ASC',
            default => 'p.created_at DESC'
        };

        $whereClause = implode(' AND ', $conditions);

        $sql = "
            SELECT p.*, c.name as category_name 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE {$whereClause}
            ORDER BY {$orderBy}
            LIMIT :limit OFFSET :offset
        ";

        $stmt = $this->pdo->prepare($sql);

        foreach ($params as $key => $value) {
            $stmt->bindValue(":{$key}", $value);
        }

        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map([$this, 'hydrate'], $data);
    }

    public function findLowStock(): array
    {
        $stmt = $this->pdo->prepare('
            SELECT p.*, c.name as category_name 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.is_active = true 
            AND p.manage_stock = true 
            AND p.stock_quantity <= p.low_stock_threshold
            ORDER BY p.stock_quantity ASC
        ');
        $stmt->execute();

        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map([$this, 'hydrate'], $data);
    }

    public function countAll(): int
    {
        $stmt = $this->pdo->prepare('SELECT COUNT(*) FROM products');
        $stmt->execute();

        return (int) $stmt->fetchColumn();
    }

    public function countActive(): int
    {
        $stmt = $this->pdo->prepare('SELECT COUNT(*) FROM products WHERE is_active = true');
        $stmt->execute();

        return (int) $stmt->fetchColumn();
    }

    public function countAdvanced(array $filters = []): int
    {
        $conditions = ['p.is_active = true'];
        $params = [];

        // Apply same filters as findAdvanced
        if (!empty($filters['category_id'])) {
            $conditions[] = 'p.category_id = :category_id';
            $params['category_id'] = $filters['category_id'];
        }

        if (!empty($filters['search'])) {
            $searchTerm = '%' . $filters['search'] . '%';
            $conditions[] = '(p.name ILIKE :search OR p.description ILIKE :search OR p.brand ILIKE :search)';
            $params['search'] = $searchTerm;
        }

        if (!empty($filters['brand'])) {
            $conditions[] = 'p.brand = :brand';
            $params['brand'] = $filters['brand'];
        }

        if (!empty($filters['min_price'])) {
            $conditions[] = 'p.price >= :min_price';
            $params['min_price'] = $filters['min_price'];
        }

        if (!empty($filters['max_price'])) {
            $conditions[] = 'p.price <= :max_price';
            $params['max_price'] = $filters['max_price'];
        }

        if (!empty($filters['in_stock'])) {
            $conditions[] = 'p.stock_quantity > 0';
        }

        if (!empty($filters['featured'])) {
            $conditions[] = 'p.is_featured = true';
        }

        $whereClause = implode(' AND ', $conditions);

        $sql = "SELECT COUNT(*) FROM products p WHERE {$whereClause}";

        $stmt = $this->pdo->prepare($sql);

        foreach ($params as $key => $value) {
            $stmt->bindValue(":{$key}", $value);
        }

        $stmt->execute();

        return (int) $stmt->fetchColumn();
    }

    public function skuExists(string $sku): bool
    {
        $stmt = $this->pdo->prepare('SELECT COUNT(*) FROM products WHERE sku = :sku');
        $stmt->execute(['sku' => $sku]);

        return (int) $stmt->fetchColumn() > 0;
    }

    public function slugExists(string $slug): bool
    {
        $stmt = $this->pdo->prepare('SELECT COUNT(*) FROM products WHERE slug = :slug');
        $stmt->execute(['slug' => $slug]);

        return (int) $stmt->fetchColumn() > 0;
    }

    private function insert(Product $product): void
    {
        $id = $this->generateUuid();

        $stmt = $this->pdo->prepare('
            INSERT INTO products (
                id, name, slug, description, short_description, sku, price, 
                compare_price, cost_price, weight, dimensions, stock_quantity, 
                low_stock_threshold, manage_stock, stock_status, is_active, 
                is_featured, category_id, brand, created_at, updated_at
            ) VALUES (
                :id, :name, :slug, :description, :short_description, :sku, :price,
                :compare_price, :cost_price, :weight, :dimensions, :stock_quantity,
                :low_stock_threshold, :manage_stock, :stock_status, :is_active,
                :is_featured, :category_id, :brand, :created_at, :updated_at
            )
        ');

        $stmt->execute([
            'id' => $id,
            'name' => $product->getName(),
            'slug' => $product->getSlug(),
            'description' => $product->getDescription(),
            'short_description' => $product->getShortDescription(),
            'sku' => $product->getSku(),
            'price' => $product->getPrice(),
            'compare_price' => $product->getComparePrice(),
            'cost_price' => $product->getCostPrice(),
            'weight' => $product->getWeight(),
            'dimensions' => $product->getDimensions(),
            'stock_quantity' => $product->getStockQuantity(),
            'low_stock_threshold' => $product->getLowStockThreshold(),
            'manage_stock' => $product->isManageStock() ? 'true' : 'false',
            'stock_status' => $product->getStockStatus(),
            'is_active' => $product->isActive() ? 'true' : 'false',
            'is_featured' => $product->isFeatured() ? 'true' : 'false',
            'category_id' => $product->getCategoryId(),
            'brand' => $product->getBrand(),
            'created_at' => $product->getCreatedAt()->format('Y-m-d H:i:s'),
            'updated_at' => $product->getUpdatedAt()->format('Y-m-d H:i:s')
        ]);

        $product->setId($id);
    }

    private function update(Product $product): void
    {
        $stmt = $this->pdo->prepare('
            UPDATE products SET
                name = :name,
                slug = :slug,
                description = :description,
                short_description = :short_description,
                sku = :sku,
                price = :price,
                compare_price = :compare_price,
                cost_price = :cost_price,
                weight = :weight,
                dimensions = :dimensions,
                stock_quantity = :stock_quantity,
                low_stock_threshold = :low_stock_threshold,
                manage_stock = :manage_stock,
                stock_status = :stock_status,
                is_active = :is_active,
                is_featured = :is_featured,
                category_id = :category_id,
                brand = :brand,
                updated_at = :updated_at
            WHERE id = :id
        ');

        $stmt->execute([
            'id' => $product->getId(),
            'name' => $product->getName(),
            'slug' => $product->getSlug(),
            'description' => $product->getDescription(),
            'short_description' => $product->getShortDescription(),
            'sku' => $product->getSku(),
            'price' => $product->getPrice(),
            'compare_price' => $product->getComparePrice(),
            'cost_price' => $product->getCostPrice(),
            'weight' => $product->getWeight(),
            'dimensions' => $product->getDimensions(),
            'stock_quantity' => $product->getStockQuantity(),
            'low_stock_threshold' => $product->getLowStockThreshold(),
            'manage_stock' => $product->isManageStock() ? 'true' : 'false',
            'stock_status' => $product->getStockStatus(),
            'is_active' => $product->isActive() ? 'true' : 'false',
            'is_featured' => $product->isFeatured() ? 'true' : 'false',
            'category_id' => $product->getCategoryId(),
            'brand' => $product->getBrand(),
            'updated_at' => $product->getUpdatedAt()->format('Y-m-d H:i:s')
        ]);
    }

    private function hydrate(array $data): Product
    {
        $product = new Product(
            $data['name'],
            $data['slug'],
            $data['sku'],
            (float) $data['price']
        );

        $product->setId($data['id']);

        $product->updateDetails(
            $data['name'],
            $data['description'],
            $data['short_description'],
            $data['brand']
        );

        if ($data['compare_price'] || $data['cost_price']) {
            $product->updatePricing(
                (float) $data['price'],
                $data['compare_price'] ? (float) $data['compare_price'] : null,
                $data['cost_price'] ? (float) $data['cost_price'] : null
            );
        }

        $product->updateInventory(
            (int) $data['stock_quantity'],
            (int) $data['low_stock_threshold']
        );

        if ($data['category_id']) {
            $product->setCategory($data['category_id']);
        }

        if ($data['is_featured']) {
            $product->setFeatured(true);
        }

        if (!$data['is_active']) {
            $product->deactivate();
        }

        return $product;
    }

    private function generateUuid(): string
    {
        $stmt = $this->pdo->query('SELECT uuid_generate_v4()');
        return $stmt->fetchColumn();
    }
}
