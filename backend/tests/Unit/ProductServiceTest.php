<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use App\Application\Service\ProductService;
use App\Domain\Entity\Product;
use App\Domain\Repository\ProductRepositoryInterface;
use PHPUnit\Framework\MockObject\MockObject;

class ProductServiceTest extends TestCase
{
    private ProductService $productService;
    private ProductRepositoryInterface|MockObject $mockRepository;

    protected function setUp(): void
    {
        $this->mockRepository = $this->createMock(ProductRepositoryInterface::class);
        /** @var ProductRepositoryInterface $mockRepository */
        $mockRepository = $this->mockRepository;
        $this->productService = new ProductService($mockRepository);
    }

    public function testCreateProduct()
    {
        $productData = [
            'name' => 'Test Product',
            'description' => 'Test Description',
            'price' => 99.99,
            'category_id' => 'test-category',
            'stock_quantity' => 10
        ];

        $this->mockRepository
            ->expects($this->once())
            ->method('save')
            ->willReturnCallback(function ($product) {
                return $product;
            });

        $product = $this->productService->createProduct($productData);

        $this->assertInstanceOf(Product::class, $product);
        $this->assertEquals('Test Product', $product->getName());
        $this->assertEquals(99.99, $product->getPrice());
    }

    public function testCreateProductWithInvalidData()
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Field \'name\' is required');

        $this->productService->createProduct([]);
    }

    public function testGetProduct()
    {
        $productId = 'test-id';
        $expectedProduct = new Product(
            'Test Product',
            'test-product',
            'TEST-001',
            99.99
        );

        $this->mockRepository
            ->expects($this->once())
            ->method('findById')
            ->with($productId)
            ->willReturn($expectedProduct);

        $product = $this->productService->getProduct($productId);

        $this->assertInstanceOf(Product::class, $product);
        $this->assertEquals($productId, $product->getId());
    }

    public function testGetProductNotFound()
    {
        $productId = 'non-existent-id';

        $this->mockRepository
            ->expects($this->once())
            ->method('findById')
            ->with($productId)
            ->willReturn(null);

        $product = $this->productService->getProduct($productId);

        $this->assertNull($product);
    }

    public function testGetProducts()
    {
        $expectedProducts = [
            new Product('Product 1', 'product-1', 'PROD-001', 10.99),
            new Product('Product 2', 'product-2', 'PROD-002', 20.99),
        ];

        $this->mockRepository
            ->expects($this->once())
            ->method('findAdvanced')
            ->willReturn($expectedProducts);

        $this->mockRepository
            ->expects($this->once())
            ->method('countAdvanced')
            ->willReturn(2);

        $result = $this->productService->getProducts();

        $this->assertIsArray($result);
        $this->assertArrayHasKey('data', $result);
        $this->assertArrayHasKey('pagination', $result);
        $this->assertCount(2, $result['data']);
    }

    public function testSearchProductsAdvanced()
    {
        $mockProducts = [
            new Product('Product 1', 'product-1', 'SKU-001', 100.00),
            new Product('Product 2', 'product-2', 'SKU-002', 200.00)
        ];

        $this->mockRepository
            ->expects($this->once())
            ->method('searchAdvanced')
            ->with('test', 'cat1', 50.0, 300.0, 'price_asc', 20, 0)
            ->willReturn($mockProducts);

        $result = $this->productService->searchProductsAdvanced(
            'test',
            'cat1',
            50.0,
            300.0,
            'price_asc',
            20,
            0
        );

        $this->assertEquals($mockProducts, $result);
    }

    public function testGetSearchResultsCount()
    {
        $this->mockRepository
            ->expects($this->once())
            ->method('searchAdvancedCount')
            ->with('test', 'cat1', 50.0, 300.0)
            ->willReturn(15);

        $count = $this->productService->getSearchResultsCount(
            'test',
            'cat1',
            50.0,
            300.0
        );

        $this->assertEquals(15, $count);
    }

    public function testGetFeaturedProducts()
    {
        $mockProducts = [
            new Product('Featured Product 1', 'featured-1', 'SKU-001', 100.00),
            new Product('Featured Product 2', 'featured-2', 'SKU-002', 200.00)
        ];

        $this->mockRepository
            ->expects($this->once())
            ->method('findFeatured')
            ->with(10, 0)
            ->willReturn($mockProducts);

        $result = $this->productService->getFeaturedProducts(10, 0);

        $this->assertCount(2, $result);
        $this->assertArrayHasKey('name', $result[0]);
        $this->assertEquals('Featured Product 1', $result[0]['name']);
    }

    public function testGetFeaturedProductsCount()
    {
        $this->mockRepository
            ->expects($this->once())
            ->method('countFeatured')
            ->willReturn(25);

        $count = $this->productService->getFeaturedProductsCount();

        $this->assertEquals(25, $count);
    }

    public function testUpdateProduct()
    {
        $existingProduct = new Product('Old Name', 'old-name', 'SKU-001', 50.00);

        $this->mockRepository
            ->expects($this->once())
            ->method('findById')
            ->with('1')
            ->willReturn($existingProduct);

        $this->mockRepository
            ->expects($this->once())
            ->method('save');

        $updateData = [
            'name' => 'Updated Name',
            'price' => 75.00,
            'stock_quantity' => 15
        ];

        $result = $this->productService->updateProduct('1', $updateData);

        $this->assertInstanceOf(Product::class, $result);
        $this->assertEquals('Updated Name', $result->getName());
        $this->assertEquals(75.00, $result->getPrice());
    }

    public function testUpdateProductNotFound()
    {
        $this->mockRepository
            ->expects($this->once())
            ->method('findById')
            ->with('999')
            ->willReturn(null);

        $result = $this->productService->updateProduct('999', ['name' => 'Test']);

        $this->assertNull($result);
    }

    public function testDeleteProduct()
    {
        $productId = 'test-id';

        $this->mockRepository
            ->expects($this->once())
            ->method('delete')
            ->with($productId)
            ->willReturn(true);

        $result = $this->productService->deleteProduct($productId);

        $this->assertTrue($result);
    }

    public function testGetProductStats()
    {
        $this->mockRepository
            ->expects($this->once())
            ->method('countAll')
            ->willReturn(100);

        $this->mockRepository
            ->expects($this->once())
            ->method('countActive')
            ->willReturn(80);

        $this->mockRepository
            ->expects($this->once())
            ->method('findAll')
            ->with(100, 0)
            ->willReturn([
                new Product('Product 1', 'product-1', 'SKU-001', 100.00),
                new Product('Product 2', 'product-2', 'SKU-002', 200.00)
            ]);

        $this->mockRepository
            ->expects($this->once())
            ->method('findLowStock')
            ->willReturn([]);

        $stats = $this->productService->getProductStats();

        $this->assertArrayHasKey('total_products', $stats);
        $this->assertArrayHasKey('active_products', $stats);
        $this->assertArrayHasKey('out_of_stock', $stats);
        $this->assertArrayHasKey('low_stock', $stats);
        $this->assertArrayHasKey('total_value', $stats);

        $this->assertEquals(100, $stats['total_products']);
        $this->assertEquals(80, $stats['active_products']);
    }
}
