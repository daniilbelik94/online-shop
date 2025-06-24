<?php

namespace App\Repositories;

use PDO;
use PDOException;

class PostgresUserRepository implements UserRepositoryInterface
{
    private PDO $connection;

    public function __construct(PDO $connection)
    {
        $this->connection = $connection;
    }

    /**
     * Find user by ID
     */
    public function findById(int $id): ?array
    {
        try {
            $stmt = $this->connection->prepare("
                SELECT id, first_name, last_name, email, phone, password, 
                       is_staff, is_superuser, created_at, updated_at 
                FROM users 
                WHERE id = :id
            ");
            $stmt->execute(['id' => $id]);

            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            return $user ?: null;
        } catch (PDOException $e) {
            error_log("Database error in findById: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Find user by email
     */
    public function findByEmail(string $email): ?array
    {
        try {
            $stmt = $this->connection->prepare("
                SELECT id, first_name, last_name, email, phone, password, 
                       is_staff, is_superuser, created_at, updated_at 
                FROM users 
                WHERE email = :email
            ");
            $stmt->execute(['email' => $email]);

            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            return $user ?: null;
        } catch (PDOException $e) {
            error_log("Database error in findByEmail: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Create new user
     */
    public function create(array $userData): ?int
    {
        try {
            $sql = "
                INSERT INTO users (first_name, last_name, email, phone, password, is_staff, is_superuser) 
                VALUES (:first_name, :last_name, :email, :phone, :password, :is_staff, :is_superuser)
                RETURNING id
            ";

            $stmt = $this->connection->prepare($sql);
            $stmt->execute([
                'first_name' => $userData['first_name'] ?? '',
                'last_name' => $userData['last_name'] ?? '',
                'email' => $userData['email'],
                'phone' => $userData['phone'] ?? null,
                'password' => $userData['password'],
                'is_staff' => $userData['is_staff'] ?? false,
                'is_superuser' => $userData['is_superuser'] ?? false,
            ]);

            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result ? (int)$result['id'] : null;
        } catch (PDOException $e) {
            error_log("Database error in create: " . $e->getMessage());
            return null;
        }
    }

    /**
     * Update user
     */
    public function update(int $id, array $data): bool
    {
        try {
            if (empty($data)) {
                return false;
            }

            // Build dynamic update query
            $setParts = [];
            $params = ['id' => $id];

            foreach ($data as $field => $value) {
                $setParts[] = "$field = :$field";
                $params[$field] = $value;
            }

            $sql = "UPDATE users SET " . implode(', ', $setParts) . ", updated_at = NOW() WHERE id = :id";

            $stmt = $this->connection->prepare($sql);
            return $stmt->execute($params);
        } catch (PDOException $e) {
            error_log("Database error in update: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Delete user
     */
    public function delete(int $id): bool
    {
        try {
            $stmt = $this->connection->prepare("DELETE FROM users WHERE id = :id");
            return $stmt->execute(['id' => $id]);
        } catch (PDOException $e) {
            error_log("Database error in delete: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Get all users
     */
    public function findAll(): array
    {
        try {
            $stmt = $this->connection->prepare("
                SELECT id, first_name, last_name, email, phone, 
                       is_staff, is_superuser, created_at, updated_at 
                FROM users 
                ORDER BY created_at DESC
            ");
            $stmt->execute();

            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            error_log("Database error in findAll: " . $e->getMessage());
            return [];
        }
    }
}
