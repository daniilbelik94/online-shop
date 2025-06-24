<?php

namespace App\Domain\Repository;

use App\Domain\Entity\User;

interface UserRepositoryInterface
{
    public function findById(string $id): ?User;

    public function findByEmail(string $email): ?User;

    public function findByUsername(string $username): ?User;

    public function save(User $user): void;

    public function delete(string $id): bool;

    public function findAll(int $limit = 50, int $offset = 0): array;

    public function findByRole(string $role, int $limit = 50, int $offset = 0): array;

    public function searchUsers(string $search, int $limit = 50, int $offset = 0): array;

    public function countAll(): int;

    public function emailExists(string $email): bool;

    public function usernameExists(string $username): bool;
}
