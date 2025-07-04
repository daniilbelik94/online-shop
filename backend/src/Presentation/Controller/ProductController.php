<?php

namespace App\Presentation\Controller;

use App\Application\Service\ProductService;
use App\Application\Service\CategoryService;

class ProductController
{
    private ProductService $productService;
    private CategoryService $categoryService;

    public function __construct(ProductService $productService, CategoryService $categoryService)
    {
        $this->productService = $productService;
        $this->categoryService = $categoryService;
    }

    public function index(): void
    {
        try {
            // Get query parameters
            $page = (int) ($_GET['page'] ?? 1);
            $limit = min((int) ($_GET['limit'] ?? 20), 50); // Max 50 items per page for public
            $search = $_GET['search'] ?? '';
            $category = $_GET['category'] ?? '';
            $sort = $_GET['sort'] ?? 'created_at_desc';
            $minPrice = $_GET['min_price'] ?? '';
            $maxPrice = $_GET['max_price'] ?? '';
            $brand = $_GET['brand'] ?? '';
            $inStock = isset($_GET['in_stock']) ? (bool) $_GET['in_stock'] : false;

            // Build filters
            $filters = [];
            if (!empty($search)) {
                $filters['search'] = $search;
            }
            if (!empty($category)) {
                // Check if category is a slug or ID
                if (is_numeric($category)) {
                    $filters['category_id'] = $category;
                } else {
                    // Find category by slug
                    $categoryObj = $this->categoryService->getCategoryBySlug($category);
                    if ($categoryObj) {
                        $filters['category_id'] = $categoryObj['id'];
                    }
                }
            }
            if (!empty($brand)) {
                $filters['brand'] = $brand;
            }
            if (!empty($minPrice)) {
                $filters['min_price'] = (float) $minPrice;
            }
            if (!empty($maxPrice)) {
                $filters['max_price'] = (float) $maxPrice;
            }
            if ($inStock) {
                $filters['in_stock'] = true;
            }

            $result = $this->productService->getProducts($filters, $sort, $page, $limit);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $result['data'],
                'pagination' => $result['pagination']
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Failed to retrieve products: ' . $e->getMessage()
            ]);
        }
    }

    public function show(string $slug): void
    {
        try {
            $product = $this->productService->getProductBySlug($slug);

            if (!$product) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'error' => 'Product not found'
                ]);
                return;
            }

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => [
                    'id' => $product->getId(),
                    'name' => $product->getName(),
                    'slug' => $product->getSlug(),
                    'description' => $product->getDescription(),
                    'short_description' => $product->getShortDescription(),
                    'sku' => $product->getSku(),
                    'price' => $product->getPrice(),
                    'compare_price' => $product->getComparePrice(),
                    'weight' => $product->getWeight(),
                    'dimensions' => $product->getDimensions(),
                    'stock_quantity' => $product->getStockQuantity(),
                    'stock_status' => $product->getStockStatus(),
                    'is_active' => $product->isActive(),
                    'is_featured' => $product->isFeatured(),
                    'category_id' => $product->getCategoryId(),
                    'brand' => $product->getBrand(),
                    'images' => $product->getImages(),
                    'created_at' => $product->getCreatedAt()->format('Y-m-d H:i:s'),
                    'updated_at' => $product->getUpdatedAt()->format('Y-m-d H:i:s'),
                    'is_in_stock' => $product->isInStock(),
                    'is_low_stock' => $product->isLowStock()
                ]
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Failed to retrieve product: ' . $e->getMessage()
            ]);
        }
    }

    public function search(): void
    {
        try {
            $query = $_GET['q'] ?? '';
            $category = $_GET['category'] ?? '';
            $minPrice = $_GET['min_price'] ?? null;
            $maxPrice = $_GET['max_price'] ?? null;
            $sort = $_GET['sort'] ?? 'relevance';
            $page = max(1, intval($_GET['page'] ?? 1));
            $limit = min(50, max(1, intval($_GET['limit'] ?? 20)));
            $offset = ($page - 1) * $limit;

            if (empty($query) && empty($category) && $minPrice === null && $maxPrice === null) {
                // If no search criteria, return featured products
                $products = $this->productService->getFeaturedProducts($limit, $offset);
                $total = $this->productService->getFeaturedProductsCount();
            } else {
                // Full-text search with filters
                $products = $this->productService->searchProductsAdvanced(
                    $query,
                    $category,
                    $minPrice,
                    $maxPrice,
                    $sort,
                    $limit,
                    $offset
                );
                $total = $this->productService->getSearchResultsCount(
                    $query,
                    $category,
                    $minPrice,
                    $maxPrice
                );
            }

            $totalPages = ceil($total / $limit);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => array_map(function ($product) {
                    return $product->toArray();
                }, $products),
                'pagination' => [
                    'current_page' => $page,
                    'total_pages' => $totalPages,
                    'total_items' => $total,
                    'items_per_page' => $limit,
                    'has_next' => $page < $totalPages,
                    'has_prev' => $page > 1
                ],
                'filters' => [
                    'query' => $query,
                    'category' => $category,
                    'min_price' => $minPrice,
                    'max_price' => $maxPrice,
                    'sort' => $sort
                ]
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to search products: ' . $e->getMessage()
            ]);
        }
    }

    public function recommended(): void
    {
        try {
            $limit = min((int) ($_GET['limit'] ?? 10), 12);
            $products = $this->productService->getRecommendedProducts($limit);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $products
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Failed to get recommendations: ' . $e->getMessage()
            ]);
        }
    }

    public function featured(): void
    {
        try {
            $limit = min((int) ($_GET['limit'] ?? 10), 20);
            $products = $this->productService->getFeaturedProducts($limit);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $products
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Failed to get featured products: ' . $e->getMessage()
            ]);
        }
    }

    public function categories(): void
    {
        try {
            $hierarchical = isset($_GET['hierarchical']) ? (bool) $_GET['hierarchical'] : false;

            if ($hierarchical) {
                $categories = $this->categoryService->getHierarchicalCategories();
            } else {
                $categories = $this->categoryService->getActiveCategories();
            }

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $categories
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Failed to get categories: ' . $e->getMessage()
            ]);
        }
    }

    public function related(string $productId): void
    {
        try {
            $limit = min((int) ($_GET['limit'] ?? 4), 8);

            // For now, just return featured products as related
            // In a real implementation, you would find products by category or other criteria
            $result = $this->productService->getFeaturedProducts($limit);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $result
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Failed to get related products: ' . $e->getMessage()
            ]);
        }
    }
}
