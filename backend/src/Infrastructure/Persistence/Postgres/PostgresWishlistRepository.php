<?php

namespace App\Infrastructure\Persistence\Postgres;

use App\Domain\Entity\Wishlist;
use App\Domain\Repository\WishlistRepositoryInterface;
use DateTime;
use PDO;
use PDOException;

class PostgresWishlistRepository implements WishlistRepositoryInterface
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function getByUserId(string $userId): array
    {
        $stmt = $this->pdo->prepare('
            SELECT w.*, p.name, p.slug, p.price, p.images, p.short_description, p.stock_quantity, p.is_active
            FROM wishlist w
            JOIN products p ON w.product_id = p.id
            WHERE w.user_id = :user_id
            ORDER BY w.created_at DESC
        ');
        $stmt->execute(['user_id' => $userId]);

        $wishlistItems = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $wishlistItems[] = [
                'id' => $row['id'],
                'user_id' => $row['user_id'],
                'product_id' => $row['product_id'],
                'created_at' => $row['created_at'],
                'product' => [
                    'id' => $row['product_id'],
                    'name' => $row['name'],
                    'slug' => $row['slug'],
                    'price' => (float) $row['price'],
                    'images' => $row['images'] ? json_decode($row['images'], true) : [],
                    'short_description' => $row['short_description'],
                    'stock_quantity' => (int) $row['stock_quantity'],
                    'is_active' => (bool) $row['is_active']
                ]
            ];
        }

        return $wishlistItems;
    }

    public function add(string $userId, string $productId): Wishlist
    {
        try {
            $stmt = $this->pdo->prepare('
                INSERT INTO wishlist (user_id, product_id, created_at)
                VALUES (:user_id, :product_id, NOW())
                RETURNING id, user_id, product_id, created_at
            ');
            $stmt->execute([
                'user_id' => $userId,
                'product_id' => $productId
            ]);

            $row = $stmt->fetch(PDO::FETCH_ASSOC);

            return new Wishlist(
                $row['id'],
                $row['user_id'],
                $row['product_id'],
                new DateTime($row['created_at'])
            );
        } catch (PDOException $e) {
            if (strpos($e->getMessage(), 'duplicate key') !== false) {
                throw new \InvalidArgumentException('Product is already in wishlist');
            }
            throw $e;
        }
    }

    public function remove(string $userId, string $productId): bool
    {
        $stmt = $this->pdo->prepare('
            DELETE FROM wishlist 
            WHERE user_id = :user_id AND product_id = :product_id
        ');
        $stmt->execute([
            'user_id' => $userId,
            'product_id' => $productId
        ]);

        return $stmt->rowCount() > 0;
    }

    public function exists(string $userId, string $productId): bool
    {
        $stmt = $this->pdo->prepare('
            SELECT COUNT(*) FROM wishlist 
            WHERE user_id = :user_id AND product_id = :product_id
        ');
        $stmt->execute([
            'user_id' => $userId,
            'product_id' => $productId
        ]);

        return $stmt->fetchColumn() > 0;
    }

    public function getById(string $id): ?Wishlist
    {
        $stmt = $this->pdo->prepare('
            SELECT * FROM wishlist WHERE id = :id
        ');
        $stmt->execute(['id' => $id]);

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row) {
            return null;
        }

        return new Wishlist(
            $row['id'],
            $row['user_id'],
            $row['product_id'],
            new DateTime($row['created_at'])
        );
    }

    public function clearByUserId(string $userId): bool
    {
        $stmt = $this->pdo->prepare('DELETE FROM wishlist WHERE user_id = :user_id');
        $stmt->execute(['user_id' => $userId]);

        return $stmt->rowCount() > 0;
    }
}
