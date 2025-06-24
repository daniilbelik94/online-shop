<?php

namespace App\Presentation\Controller;

use App\Application\Service\AuthService;

class AuthController
{
    private AuthService $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    public function login(): void
    {
        header('Content-Type: application/json');

        try {
            $input = json_decode(file_get_contents('php://input'), true);

            if (!$input || !isset($input['email']) || !isset($input['password'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Email and password are required']);
                return;
            }

            $result = $this->authService->login($input['email'], $input['password']);

            http_response_code(200);
            echo json_encode($result);
        } catch (\InvalidArgumentException $e) {
            http_response_code(401);
            echo json_encode(['error' => $e->getMessage()]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Internal server error']);
        }
    }

    public function refreshToken(): void
    {
        header('Content-Type: application/json');

        try {
            $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';

            if (!preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
                http_response_code(401);
                echo json_encode(['error' => 'Authorization header required']);
                return;
            }

            $token = $matches[1];
            $newToken = $this->authService->refreshToken($token);

            if (!$newToken) {
                http_response_code(401);
                echo json_encode(['error' => 'Invalid token']);
                return;
            }

            http_response_code(200);
            echo json_encode(['token' => $newToken]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Internal server error']);
        }
    }
}
