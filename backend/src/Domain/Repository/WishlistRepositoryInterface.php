<?php

namespace App\Domain\Repository;

use App\Domain\Entity\Wishlist;

interface WishlistRepositoryInterface
{
    /**
     * Get all wishlist items for a user
     * @param string $userId
     * @return Wishlist[]
     */
    public function getByUserId(string $userId): array;

    /**
     * Add a product to user's wishlist
     * @param string $userId
     * @param string $productId
     * @return Wishlist
     */
    public function add(string $userId, string $productId): Wishlist;

    /**
     * Remove a product from user's wishlist
     * @param string $userId
     * @param string $productId
     * @return bool
     */
    public function remove(string $userId, string $productId): bool;

    /**
     * Check if a product is in user's wishlist
     * @param string $userId
     * @param string $productId
     * @return bool
     */
    public function exists(string $userId, string $productId): bool;

    /**
     * Get wishlist item by ID
     * @param string $id
     * @return Wishlist|null
     */
    public function getById(string $id): ?Wishlist;

    /**
     * Clear user's entire wishlist
     * @param string $userId
     * @return bool
     */
    public function clearByUserId(string $userId): bool;
}
