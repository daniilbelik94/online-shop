<?php

namespace App\Presentation\Controller;

use App\Application\Service\ProductService;
use App\Presentation\Middleware\AuthMiddleware;

class AdminProductController
{
    private ProductService $productService;
    private AuthMiddleware $authMiddleware;

    public function __construct(ProductService $productService, AuthMiddleware $authMiddleware)
    {
        $this->productService = $productService;
        $this->authMiddleware = $authMiddleware;
    }

    public function index(): void
    {
        // Check admin authentication
        $userPayload = $this->authMiddleware->handle('is_staff');

        if (!$userPayload) {
            return; // Error already sent by middleware
        }

        try {
            // Get query parameters
            $page = (int) ($_GET['page'] ?? 1);
            $limit = min((int) ($_GET['limit'] ?? 50), 100); // Max 100 items per page
            $search = $_GET['search'] ?? '';
            $category = $_GET['category'] ?? '';
            $sort = $_GET['sort'] ?? 'created_at_desc';

            // Build filters
            $filters = [];
            if (!empty($search)) {
                $filters['search'] = $search;
            }
            if (!empty($category)) {
                $filters['category_id'] = $category;
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

    public function show(string $id): void
    {
        // Check admin authentication
        $userPayload = $this->authMiddleware->handle('is_staff');

        if (!$userPayload) {
            return; // Error already sent by middleware
        }

        try {
            $product = $this->productService->getProduct($id);

            if (!$product) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'error' => 'Product not found'
                ]);
                return;
            }

            $productData = [
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

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $productData
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Failed to retrieve product: ' . $e->getMessage()
            ]);
        }
    }

    public function store(): void
    {
        // Check admin authentication
        $userPayload = $this->authMiddleware->handle('is_staff');

        if (!$userPayload) {
            return; // Error already sent by middleware
        }

        try {
            $input = json_decode(file_get_contents('php://input'), true);

            if (!$input) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Invalid JSON input'
                ]);
                return;
            }

            $product = $this->productService->createProduct($input);

            $productData = [
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

            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Product created successfully',
                'data' => $productData
            ]);
        } catch (\InvalidArgumentException $e) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Validation error: ' . $e->getMessage()
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Failed to create product: ' . $e->getMessage()
            ]);
        }
    }

    public function update(string $id): void
    {
        // Check admin authentication
        $userPayload = $this->authMiddleware->handle('is_staff');

        if (!$userPayload) {
            return; // Error already sent by middleware
        }

        try {
            $input = json_decode(file_get_contents('php://input'), true);

            if (!$input) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Invalid JSON input'
                ]);
                return;
            }

            $product = $this->productService->updateProduct($id, $input);

            if (!$product) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'error' => 'Product not found'
                ]);
                return;
            }

            $productData = [
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

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Product updated successfully',
                'data' => $productData
            ]);
        } catch (\InvalidArgumentException $e) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Validation error: ' . $e->getMessage()
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Failed to update product: ' . $e->getMessage()
            ]);
        }
    }

    public function destroy(string $id): void
    {
        // Check admin authentication - only superuser can delete products
        $userPayload = $this->authMiddleware->handle('is_superuser');

        if (!$userPayload) {
            return; // Error already sent by middleware
        }

        try {
            $success = $this->productService->deleteProduct($id);

            if (!$success) {
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
                'message' => 'Product deactivated successfully'
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Failed to delete product: ' . $e->getMessage()
            ]);
        }
    }

    public function stats(): void
    {
        // Check admin authentication
        $userPayload = $this->authMiddleware->handle('is_staff');

        if (!$userPayload) {
            return; // Error already sent by middleware
        }

        try {
            $stats = $this->productService->getProductStats();

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Failed to retrieve stats: ' . $e->getMessage()
            ]);
        }
    }

    public function lowStock(): void
    {
        // Check admin authentication
        $userPayload = $this->authMiddleware->handle('is_staff');

        if (!$userPayload) {
            return; // Error already sent by middleware
        }

        try {
            $products = $this->productService->getLowStockProducts();

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $products
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Failed to retrieve low stock products: ' . $e->getMessage()
            ]);
        }
    }
}
