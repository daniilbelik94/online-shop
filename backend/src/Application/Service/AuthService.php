<?php

namespace App\Application\Service;

use App\Domain\Entity\User;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthService
{
    private string $jwtSecret;
    private int $jwtExpiration;
    private UserService $userService;

    public function __construct(UserService $userService, string $jwtSecret, int $jwtExpiration)
    {
        $this->userService = $userService;
        $this->jwtSecret = $jwtSecret;
        $this->jwtExpiration = $jwtExpiration;
    }

    public function login(string $email, string $password): array
    {
        $user = $this->userService->authenticateUser($email, $password);

        if (!$user) {
            throw new \InvalidArgumentException('Invalid credentials');
        }

        $token = $this->generateToken($user);

        return [
            'token' => $token,
            'user' => $this->serializeUser($user)
        ];
    }

    public function generateToken(User $user): string
    {
        $payload = [
            'iss' => 'amazon-clone-api',
            'aud' => 'amazon-clone-frontend',
            'iat' => time(),
            'exp' => time() + $this->jwtExpiration,
            'user_id' => $user->getId(),
            'email' => $user->getEmail(),
            'role' => $user->getRole(),
            'is_staff' => $user->isStaff(),
            'is_superuser' => $user->isSuperuser()
        ];

        return JWT::encode($payload, $this->jwtSecret, 'HS256');
    }

    public function validateToken(string $token): ?array
    {
        try {
            $decoded = JWT::decode($token, new Key($this->jwtSecret, 'HS256'));
            return (array) $decoded;
        } catch (\Exception $e) {
            return null;
        }
    }

    public function getUserFromToken(string $token): ?User
    {
        $payload = $this->validateToken($token);

        if (!$payload || !isset($payload['user_id'])) {
            return null;
        }

        return $this->userService->getUserById($payload['user_id']);
    }

    public function refreshToken(string $token): ?string
    {
        $user = $this->getUserFromToken($token);

        if (!$user) {
            return null;
        }

        return $this->generateToken($user);
    }

    private function serializeUser(User $user): array
    {
        return [
            'id' => $user->getId(),
            'username' => $user->getUsername(),
            'email' => $user->getEmail(),
            'first_name' => $user->getFirstName(),
            'last_name' => $user->getLastName(),
            'phone' => $user->getPhone(),
            'role' => $user->getRole(),
            'email_verified' => $user->isEmailVerified(),
            'is_active' => $user->isActive(),
            'is_staff' => $user->isStaff(),
            'is_superuser' => $user->isSuperuser(),
            'created_at' => $user->getCreatedAt()->format('Y-m-d\TH:i:s\Z'),
            'updated_at' => $user->getUpdatedAt()->format('Y-m-d\TH:i:s\Z'),
            'last_login' => $user->getLastLogin()?->format('Y-m-d\TH:i:s\Z')
        ];
    }
}