<?php

namespace App\Application\Service;

use App\Domain\Entity\Product;
use App\Domain\Repository\ProductRepositoryInterface;

class ProductService
{
    private ProductRepositoryInterface $productRepository;

    public function __construct(ProductRepositoryInterface $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    public function createProduct(array $data): Product
    {
        // Validate required fields
        $this->validateProductData($data);

        // Generate slug from name if not provided
        $slug = $data['slug'] ?? $this->generateSlug($data['name']);

        // Ensure slug is unique
        $slug = $this->ensureUniqueSlug($slug);

        // Generate SKU if not provided
        $sku = $data['sku'] ?? $this->generateSku($data['name']);

        // Ensure SKU is unique
        $sku = $this->ensureUniqueSku($sku);

        $product = new Product(
            $data['name'],
            $slug,
            $sku,
            (float) $data['price']
        );

        // Set optional fields
        if (!empty($data['description'])) {
            $product->updateDetails(
                $data['name'],
                $data['description'],
                $data['short_description'] ?? null,
                $data['brand'] ?? null
            );
        }

        if (!empty($data['compare_price']) || !empty($data['cost_price'])) {
            $product->updatePricing(
                (float) $data['price'],
                !empty($data['compare_price']) ? (float) $data['compare_price'] : null,
                !empty($data['cost_price']) ? (float) $data['cost_price'] : null
            );
        }

        if (isset($data['stock_quantity'])) {
            $product->updateInventory(
                (int) $data['stock_quantity'],
                (int) ($data['low_stock_threshold'] ?? 10)
            );
        }

        if (!empty($data['category_id'])) {
            $product->setCategory($data['category_id']);
        }

        if (!empty($data['is_featured'])) {
            $product->setFeatured(true);
        }

        if (isset($data['is_active']) && !$data['is_active']) {
            $product->deactivate();
        }

        $this->productRepository->save($product);

        return $product;
    }

    public function updateProduct(string $id, array $data): ?Product
    {
        $product = $this->productRepository->findById($id);

        if (!$product) {
            return null;
        }

        // Update basic details
        if (isset($data['name']) || isset($data['description']) || isset($data['short_description']) || isset($data['brand'])) {
            $product->updateDetails(
                $data['name'] ?? $product->getName(),
                $data['description'] ?? $product->getDescription(),
                $data['short_description'] ?? $product->getShortDescription(),
                $data['brand'] ?? $product->getBrand()
            );
        }

        // Update pricing
        if (isset($data['price']) || isset($data['compare_price']) || isset($data['cost_price'])) {
            $product->updatePricing(
                isset($data['price']) ? (float) $data['price'] : $product->getPrice(),
                isset($data['compare_price']) ? (float) $data['compare_price'] : $product->getComparePrice(),
                isset($data['cost_price']) ? (float) $data['cost_price'] : $product->getCostPrice()
            );
        }

        // Update inventory
        if (isset($data['stock_quantity']) || isset($data['low_stock_threshold'])) {
            $product->updateInventory(
                isset($data['stock_quantity']) ? (int) $data['stock_quantity'] : $product->getStockQuantity(),
                isset($data['low_stock_threshold']) ? (int) $data['low_stock_threshold'] : $product->getLowStockThreshold()
            );
        }

        // Update category
        if (isset($data['category_id'])) {
            $product->setCategory($data['category_id']);
        }

        // Update featured status
        if (isset($data['is_featured'])) {
            $product->setFeatured((bool) $data['is_featured']);
        }

        // Update active status
        if (isset($data['is_active'])) {
            if ($data['is_active']) {
                $product->activate();
            } else {
                $product->deactivate();
            }
        }

        $this->productRepository->save($product);

        return $product;
    }

    public function getProduct(string $id): ?Product
    {
        return $this->productRepository->findById($id);
    }

    public function getProductBySlug(string $slug): ?Product
    {
        return $this->productRepository->findBySlug($slug);
    }

    public function deleteProduct(string $id): bool
    {
        return $this->productRepository->delete($id);
    }

    public function getProducts(array $filters = [], string $sort = 'created_at_desc', int $page = 1, int $limit = 50): array
    {
        $offset = ($page - 1) * $limit;

        $products = $this->productRepository->findAdvanced($filters, $sort, $limit, $offset);
        $total = $this->productRepository->countAdvanced($filters);

        return [
            'data' => array_map([$this, 'formatProduct'], $products),
            'pagination' => [
                'current_page' => $page,
                'per_page' => $limit,
                'total' => $total,
                'total_pages' => ceil($total / $limit)
            ]
        ];
    }

    public function getFeaturedProducts(int $limit = 10): array
    {
        $products = $this->productRepository->findFeatured($limit);
        return array_map([$this, 'formatProduct'], $products);
    }

    public function getRecommendedProducts(int $limit = 10): array
    {
        // For MVP, return most recent products
        $products = $this->productRepository->findActive($limit);
        return array_map([$this, 'formatProduct'], $products);
    }

    public function searchProducts(string $query, int $page = 1, int $limit = 50): array
    {
        $offset = ($page - 1) * $limit;

        $products = $this->productRepository->search($query, $limit, $offset);

        // For search, we'll estimate total based on result count
        $total = count($products) === $limit ? $limit * 2 : count($products);

        return [
            'data' => array_map([$this, 'formatProduct'], $products),
            'pagination' => [
                'current_page' => $page,
                'per_page' => $limit,
                'total' => $total,
                'total_pages' => ceil($total / $limit)
            ]
        ];
    }

    public function getLowStockProducts(): array
    {
        $products = $this->productRepository->findLowStock();
        return array_map([$this, 'formatProduct'], $products);
    }

    public function getProductStats(): array
    {
        return [
            'total_products' => $this->productRepository->countAll(),
            'active_products' => $this->productRepository->countActive(),
            'low_stock_count' => count($this->productRepository->findLowStock())
        ];
    }

    private function validateProductData(array $data): void
    {
        $required = ['name', 'price'];

        foreach ($required as $field) {
            if (empty($data[$field])) {
                throw new \InvalidArgumentException("Field '{$field}' is required");
            }
        }

        if (!is_numeric($data['price']) || $data['price'] < 0) {
            throw new \InvalidArgumentException('Price must be a positive number');
        }
    }

    private function generateSlug(string $name): string
    {
        $slug = strtolower($name);
        $slug = preg_replace('/[^a-z0-9\s-]/', '', $slug);
        $slug = preg_replace('/[\s-]+/', '-', $slug);
        $slug = trim($slug, '-');

        return $slug;
    }

    private function ensureUniqueSlug(string $slug): string
    {
        $originalSlug = $slug;
        $counter = 1;

        while ($this->productRepository->slugExists($slug)) {
            $slug = $originalSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    private function generateSku(string $name): string
    {
        $words = explode(' ', strtoupper($name));
        $sku = '';

        foreach ($words as $word) {
            if (strlen($word) > 0) {
                $sku .= substr($word, 0, 3);
            }
        }

        $sku = substr($sku, 0, 8);
        $sku .= '-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);

        return $sku;
    }

    private function ensureUniqueSku(string $sku): string
    {
        while ($this->productRepository->skuExists($sku)) {
            $sku = substr($sku, 0, -4) . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);
        }

        return $sku;
    }

    private function formatProduct(Product $product): array
    {
        return [
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
            'manage_stock' => $product->isManageStock(),
            'stock_status' => $product->getStockStatus(),
            'is_active' => $product->isActive(),
            'is_featured' => $product->isFeatured(),
            'category_id' => $product->getCategoryId(),
            'brand' => $product->getBrand(),
            'created_at' => $product->getCreatedAt()->format('Y-m-d H:i:s'),
            'updated_at' => $product->getUpdatedAt()->format('Y-m-d H:i:s'),
            'is_in_stock' => $product->isInStock(),
            'is_low_stock' => $product->isLowStock()
        ];
    }
}
