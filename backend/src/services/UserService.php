<?php

namespace App\Services;

use App\Repositories\UserRepositoryInterface;

class UserService
{
    private UserRepositoryInterface $userRepository;

    public function __construct(UserRepositoryInterface $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    /**
     * Get user by ID
     */
    public function getUserById(int $id): ?array
    {
        return $this->userRepository->findById($id);
    }

    /**
     * Get user by email
     */
    public function getUserByEmail(string $email): ?array
    {
        return $this->userRepository->findByEmail($email);
    }

    /**
     * Update user data
     */
    public function updateUser(int $id, array $data): bool
    {
        // Filter out empty values
        $updateData = array_filter($data, function ($value) {
            return $value !== null && $value !== '';
        });

        if (empty($updateData)) {
            return false;
        }

        return $this->userRepository->update($id, $updateData);
    }

    /**
     * Update user password
     */
    public function updatePassword(int $id, string $newPassword): bool
    {
        $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
        return $this->userRepository->update($id, ['password' => $hashedPassword]);
    }

    /**
     * Create new user
     */
    public function createUser(array $userData): ?array
    {
        // Hash password if provided
        if (isset($userData['password'])) {
            $userData['password'] = password_hash($userData['password'], PASSWORD_DEFAULT);
        }

        $userId = $this->userRepository->create($userData);

        if ($userId) {
            return $this->getUserById($userId);
        }

        return null;
    }

    /**
     * Verify user credentials
     */
    public function verifyCredentials(string $email, string $password): ?array
    {
        $user = $this->getUserByEmail($email);

        if ($user && password_verify($password, $user['password'])) {
            return $user;
        }

        return null;
    }

    /**
     * Check if user exists
     */
    public function userExists(string $email): bool
    {
        return $this->getUserByEmail($email) !== null;
    }
}
