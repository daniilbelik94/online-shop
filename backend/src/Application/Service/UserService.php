<?php

namespace App\Application\Service;

use App\Domain\Entity\User;
use App\Domain\Repository\UserRepositoryInterface;
use App\Domain\Service\EmailServiceInterface;

class UserService
{
    private UserRepositoryInterface $userRepository;
    private EmailServiceInterface $emailService;

    public function __construct(
        UserRepositoryInterface $userRepository,
        EmailServiceInterface $emailService
    ) {
        $this->userRepository = $userRepository;
        $this->emailService = $emailService;
    }

    public function registerUser(
        string $username,
        string $email,
        string $password,
        string $firstName,
        string $lastName,
        ?string $phone = null
    ): User {
        // Validate that email and username don't already exist
        if ($this->userRepository->emailExists($email)) {
            throw new \InvalidArgumentException('Email already exists');
        }

        if ($this->userRepository->usernameExists($username)) {
            throw new \InvalidArgumentException('Username already exists');
        }

        // Hash the password
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);

        // Create new user entity
        $user = new User($username, $email, $passwordHash, $firstName, $lastName, $phone);

        // Save to repository
        $this->userRepository->save($user);

        // Send welcome email
        $this->sendWelcomeEmail($user);

        return $user;
    }

    public function authenticateUser(string $email, string $password): ?User
    {
        $user = $this->userRepository->findByEmail($email);

        if (!$user || !$user->isActive()) {
            return null;
        }

        if (!password_verify($password, $user->getPasswordHash())) {
            return null;
        }

        // Update last login timestamp
        $user->updateLastLogin();
        $this->userRepository->save($user);

        return $user;
    }

    public function getUserById(string $id): ?User
    {
        return $this->userRepository->findById($id);
    }

    public function getUserByEmail(string $email): ?User
    {
        return $this->userRepository->findByEmail($email);
    }

    public function updateUserProfile(
        string $userId,
        string $firstName,
        string $lastName,
        ?string $phone = null
    ): User {
        $user = $this->userRepository->findById($userId);

        if (!$user) {
            throw new \InvalidArgumentException('User not found');
        }

        $user->updateProfile($firstName, $lastName, $phone);
        $this->userRepository->save($user);

        return $user;
    }

    public function changeUserPassword(string $userId, string $currentPassword, string $newPassword): void
    {
        $user = $this->userRepository->findById($userId);

        if (!$user) {
            throw new \InvalidArgumentException('User not found');
        }

        if (!password_verify($currentPassword, $user->getPasswordHash())) {
            throw new \InvalidArgumentException('Current password is incorrect');
        }

        $newPasswordHash = password_hash($newPassword, PASSWORD_DEFAULT);
        $user->changePassword($newPasswordHash);
        $this->userRepository->save($user);
    }

    public function verifyUserEmail(string $userId): void
    {
        $user = $this->userRepository->findById($userId);

        if (!$user) {
            throw new \InvalidArgumentException('User not found');
        }

        $user->verifyEmail();
        $this->userRepository->save($user);
    }

    public function deactivateUser(string $userId): void
    {
        $user = $this->userRepository->findById($userId);

        if (!$user) {
            throw new \InvalidArgumentException('User not found');
        }

        $user->deactivate();
        $this->userRepository->save($user);
    }

    public function activateUser(string $userId): void
    {
        $user = $this->userRepository->findById($userId);

        if (!$user) {
            throw new \InvalidArgumentException('User not found');
        }

        $user->activate();
        $this->userRepository->save($user);
    }

    public function updateUserRole(string $userId, string $role): void
    {
        $validRoles = ['customer', 'seller', 'admin'];
        if (!in_array($role, $validRoles)) {
            throw new \InvalidArgumentException('Invalid role');
        }

        $user = $this->userRepository->findById($userId);

        if (!$user) {
            throw new \InvalidArgumentException('User not found');
        }

        $user->setRole($role);
        $this->userRepository->save($user);
    }

    public function getAllUsers(int $page = 1, int $limit = 50): array
    {
        $offset = ($page - 1) * $limit;
        return $this->userRepository->findAll($limit, $offset);
    }

    public function searchUsers(string $query, int $page = 1, int $limit = 50): array
    {
        $offset = ($page - 1) * $limit;
        return $this->userRepository->searchUsers($query, $limit, $offset);
    }

    public function getUsersByRole(string $role, int $page = 1, int $limit = 50): array
    {
        $offset = ($page - 1) * $limit;
        return $this->userRepository->findByRole($role, $limit, $offset);
    }

    public function getTotalUsersCount(): int
    {
        return $this->userRepository->countAll();
    }

    private function sendWelcomeEmail(User $user): void
    {
        try {
            $userData = [
                'first_name' => $user->getFirstName(),
                'last_name' => $user->getLastName(),
                'username' => $user->getUsername(),
                'email' => $user->getEmail(),
            ];

            $this->emailService->sendWelcomeEmail($user->getEmail(), $userData);
        } catch (\Exception $e) {
            error_log("Failed to send welcome email to {$user->getEmail()}: " . $e->getMessage());
        }
    }
}
