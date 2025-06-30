<?php

namespace App\Infrastructure\Persistence\Postgres;

use App\Domain\Entity\Offer;
use App\Domain\Repository\OfferRepositoryInterface;
use PDO;

class PostgresOfferRepository implements OfferRepositoryInterface
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function save(Offer $offer): Offer
    {
        $data = $offer->toArray();
        
        if ($offer->getId()) {
            // Update existing offer
            $sql = "UPDATE offers SET 
                title = :title,
                description = :description,
                type = :type,
                discount_percent = :discount_percent,
                min_order_amount = :min_order_amount,
                max_discount_amount = :max_discount_amount,
                product_id = :product_id,
                category_id = :category_id,
                is_active = :is_active,
                is_limited = :is_limited,
                max_uses = :max_uses,
                used_count = :used_count,
                start_date = :start_date,
                end_date = :end_date,
                image_url = :image_url,
                conditions = :conditions,
                updated_at = :updated_at
                WHERE id = :id";
            
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($data);
        } else {
            // Insert new offer
            $sql = "INSERT INTO offers (
                title, description, type, discount_percent, min_order_amount,
                max_discount_amount, product_id, category_id, is_active,
                is_limited, max_uses, used_count, start_date, end_date,
                image_url, conditions, created_at, updated_at
            ) VALUES (
                :title, :description, :type, :discount_percent, :min_order_amount,
                :max_discount_amount, :product_id, :category_id, :is_active,
                :is_limited, :max_uses, :used_count, :start_date, :end_date,
                :image_url, :conditions, :created_at, :updated_at
            ) RETURNING id";
            
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($data);
            
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            $offer->setId($result['id']);
        }
        
        return $offer;
    }

    public function findById(string $id): ?Offer
    {
        $sql = "SELECT * FROM offers WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(['id' => $id]);
        
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$data) {
            return null;
        }
        
        return $this->createOfferFromData($data);
    }

    public function findByType(string $type): array
    {
        $sql = "SELECT * FROM offers WHERE type = :type ORDER BY created_at DESC";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(['type' => $type]);
        
        $offers = [];
        while ($data = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $offers[] = $this->createOfferFromData($data);
        }
        
        return $offers;
    }

    public function findActive(): array
    {
        $sql = "SELECT * FROM offers WHERE is_active = true AND 
                (start_date IS NULL OR start_date <= NOW()) AND
                (end_date IS NULL OR end_date >= NOW()) AND
                (max_uses IS NULL OR used_count < max_uses)
                ORDER BY created_at DESC";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        
        $offers = [];
        while ($data = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $offers[] = $this->createOfferFromData($data);
        }
        
        return $offers;
    }

    public function findActiveByCategory(string $categoryId): array
    {
        $sql = "SELECT * FROM offers WHERE is_active = true AND 
                (category_id = :category_id OR category_id IS NULL) AND
                (start_date IS NULL OR start_date <= NOW()) AND
                (end_date IS NULL OR end_date >= NOW()) AND
                (max_uses IS NULL OR used_count < max_uses)
                ORDER BY created_at DESC";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(['category_id' => $categoryId]);
        
        $offers = [];
        while ($data = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $offers[] = $this->createOfferFromData($data);
        }
        
        return $offers;
    }

    public function findActiveByProduct(string $productId): array
    {
        $sql = "SELECT * FROM offers WHERE is_active = true AND 
                (product_id = :product_id OR product_id IS NULL) AND
                (start_date IS NULL OR start_date <= NOW()) AND
                (end_date IS NULL OR end_date >= NOW()) AND
                (max_uses IS NULL OR used_count < max_uses)
                ORDER BY created_at DESC";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(['product_id' => $productId]);
        
        $offers = [];
        while ($data = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $offers[] = $this->createOfferFromData($data);
        }
        
        return $offers;
    }

    public function findExpired(): array
    {
        $sql = "SELECT * FROM offers WHERE 
                (end_date IS NOT NULL AND end_date < NOW()) OR
                (max_uses IS NOT NULL AND used_count >= max_uses)
                ORDER BY end_date DESC";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        
        $offers = [];
        while ($data = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $offers[] = $this->createOfferFromData($data);
        }
        
        return $offers;
    }

    public function findUpcoming(): array
    {
        $sql = "SELECT * FROM offers WHERE 
                start_date IS NOT NULL AND start_date > NOW()
                ORDER BY start_date ASC";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        
        $offers = [];
        while ($data = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $offers[] = $this->createOfferFromData($data);
        }
        
        return $offers;
    }

    public function delete(string $id): bool
    {
        $sql = "DELETE FROM offers WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute(['id' => $id]);
    }

    public function countActive(): int
    {
        $sql = "SELECT COUNT(*) FROM offers WHERE is_active = true";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        return (int) $stmt->fetchColumn();
    }

    public function getUsageStatistics(): array
    {
        $sql = "SELECT 
                type,
                COUNT(*) as total_offers,
                SUM(used_count) as total_uses,
                AVG(discount_percent) as avg_discount
                FROM offers 
                GROUP BY type";
        
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    private function createOfferFromData(array $data): Offer
    {
        $offer = new Offer(
            $data['title'],
            $data['description'],
            $data['type'],
            (float) $data['discount_percent']
        );
        
        $offer->setId($data['id']);
        
        if ($data['min_order_amount']) {
            $offer->setPricing(
                (float) $data['discount_percent'],
                (float) $data['min_order_amount'],
                $data['max_discount_amount'] ? (float) $data['max_discount_amount'] : null
            );
        }
        
        if ($data['product_id'] || $data['category_id']) {
            $offer->setScope($data['product_id'], $data['category_id']);
        }
        
        if ($data['start_date'] || $data['end_date']) {
            $startDate = $data['start_date'] ? new \DateTimeImmutable($data['start_date']) : null;
            $endDate = $data['end_date'] ? new \DateTimeImmutable($data['end_date']) : null;
            $offer->setLimitations(
                (bool) $data['is_limited'],
                $data['max_uses'] ? (int) $data['max_uses'] : null,
                $startDate,
                $endDate
            );
        }
        
        if ($data['image_url']) {
            $offer->setImageUrl($data['image_url']);
        }
        
        if ($data['conditions']) {
            $conditions = json_decode($data['conditions'], true) ?: [];
            $offer->setConditions($conditions);
        }
        
        // Set usage count
        if ($data['used_count'] > 0) {
            for ($i = 0; $i < (int) $data['used_count']; $i++) {
                $offer->incrementUsage();
            }
        }
        
        // Set active status
        if (!$data['is_active']) {
            $offer->deactivate();
        }
        
        return $offer;
    }
} 