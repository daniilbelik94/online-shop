<?php

namespace App\Presentation\Middleware;

use App\Application\Service\AuthService;

class AuthMiddleware
{
    private AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function handle(?string $requiredRole = null): ?array
    {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';

        if (!preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            $this->unauthorized('Authorization header required');
            return null;
        }

        $token = $matches[1];
        $payload = $this->authService->validateToken($token);

        if (!$payload) {
            $this->unauthorized('Invalid or expired token');
            return null;
        }

        // Check role requirements
        if ($requiredRole === 'is_staff' && !($payload['is_staff'] ?? false)) {
            $this->forbidden('Staff access required');
            return null;
        }

        if ($requiredRole === 'is_superuser' && !($payload['is_superuser'] ?? false)) {
            $this->forbidden('Superuser access required');
            return null;
        }

        return $payload;
    }

    public function getCurrentUser(): ?array
    {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';

        if (!preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            return null;
        }

        $token = $matches[1];
        $payload = $this->authService->validateToken($token);

        return $payload ?: null;
    }

    private function unauthorized(string $message): void
    {
        http_response_code(401);
        header('Content-Type: application/json');
        echo json_encode(['error' => $message]);
        exit;
    }

    private function forbidden(string $message): void
    {
        http_response_code(403);
        header('Content-Type: application/json');
        echo json_encode(['error' => $message]);
        exit;
    }
}
