<?php

namespace App\Application\Service;

use App\Domain\Entity\Wishlist;
use App\Domain\Repository\WishlistRepositoryInterface;
use App\Domain\Repository\ProductRepositoryInterface;

class WishlistService
{
    private WishlistRepositoryInterface $wishlistRepository;
    private ProductRepositoryInterface $productRepository;

    public function __construct(
        WishlistRepositoryInterface $wishlistRepository,
        ProductRepositoryInterface $productRepository
    ) {
        $this->wishlistRepository = $wishlistRepository;
        $this->productRepository = $productRepository;
    }

    /**
     * Get user's wishlist with product details
     */
    public function getUserWishlist(string $userId): array
    {
        return $this->wishlistRepository->getByUserId($userId);
    }

    /**
     * Add product to user's wishlist
     */
    public function addToWishlist(string $userId, string $productId): Wishlist
    {
        // Check if product exists and is active
        $product = $this->productRepository->findById($productId);
        if (!$product || !$product->isActive()) {
            throw new \InvalidArgumentException('Product not found or inactive');
        }

        // Check if already in wishlist
        if ($this->wishlistRepository->exists($userId, $productId)) {
            throw new \InvalidArgumentException('Product is already in wishlist');
        }

        return $this->wishlistRepository->add($userId, $productId);
    }

    /**
     * Remove product from user's wishlist
     */
    public function removeFromWishlist(string $userId, string $productId): bool
    {
        return $this->wishlistRepository->remove($userId, $productId);
    }

    /**
     * Check if product is in user's wishlist
     */
    public function isInWishlist(string $userId, string $productId): bool
    {
        return $this->wishlistRepository->exists($userId, $productId);
    }

    /**
     * Clear user's entire wishlist
     */
    public function clearWishlist(string $userId): bool
    {
        return $this->wishlistRepository->clearByUserId($userId);
    }

    /**
     * Get wishlist count for user
     */
    public function getWishlistCount(string $userId): int
    {
        $wishlist = $this->wishlistRepository->getByUserId($userId);
        return count($wishlist);
    }
}
