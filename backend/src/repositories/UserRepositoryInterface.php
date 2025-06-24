<?php

namespace App\Repositories;

interface UserRepositoryInterface
{
    /**
     * Find user by ID
     */
    public function findById(int $id): ?array;

    /**
     * Find user by email
     */
    public function findByEmail(string $email): ?array;

    /**
     * Create new user
     */
    public function create(array $userData): ?int;

    /**
     * Update user
     */
    public function update(int $id, array $data): bool;

    /**
     * Delete user
     */
    public function delete(int $id): bool;

    /**
     * Get all users
     */
    public function findAll(): array;
}
