<?php

namespace App\Presentation\Controller;

use App\Application\Service\UserSettingsService;
use App\Application\Service\AuthService;
use App\Infrastructure\Persistence\Postgres\PostgresUserSettingsRepository;

class UserSettingsController
{
    private UserSettingsService $userSettingsService;
    private AuthService $authService;

    public function __construct(UserSettingsService $userSettingsService, AuthService $authService)
    {
        $this->userSettingsService = $userSettingsService;
        $this->authService = $authService;
    }

    public function getSettings(): void
    {
        try {
            $userId = $this->getCurrentUserId();

            if (!$userId) {
                http_response_code(401);
                echo json_encode(['success' => false, 'message' => 'Unauthorized']);
                return;
            }

            $settings = $this->userSettingsService->getUserSettings($userId);

            if (!$settings) {
                // Create default settings if none exist
                $settings = $this->userSettingsService->createDefaultSettings($userId);
            }

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $settings->toArray()
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to retrieve settings: ' . $e->getMessage()
            ]);
        }
    }

    public function updateSettings(): void
    {
        try {
            $userId = $this->getCurrentUserId();

            if (!$userId) {
                http_response_code(401);
                echo json_encode(['success' => false, 'message' => 'Unauthorized']);
                return;
            }

            $input = json_decode(file_get_contents('php://input'), true);

            if (!$input) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
                return;
            }

            $settings = $this->userSettingsService->updateSettings($userId, $input);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $settings->toArray(),
                'message' => 'Settings updated successfully'
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to update settings: ' . $e->getMessage()
            ]);
        }
    }

    public function deleteSettings(): void
    {
        try {
            $userId = $this->getCurrentUserId();

            if (!$userId) {
                http_response_code(401);
                echo json_encode(['success' => false, 'message' => 'Unauthorized']);
                return;
            }

            $deleted = $this->userSettingsService->deleteSettings($userId);

            if ($deleted) {
                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'message' => 'Settings deleted successfully'
                ]);
            } else {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'message' => 'Settings not found'
                ]);
            }
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'message' => 'Failed to delete settings: ' . $e->getMessage()
            ]);
        }
    }

    private function getCurrentUserId(): ?string
    {
        // Get user ID from session or JWT token
        if (isset($_SESSION['user_id'])) {
            return $_SESSION['user_id'];
        }

        // Check for Authorization header (JWT)
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';

        if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            $token = $matches[1];
            $payload = $this->authService->validateToken($token);

            if ($payload && isset($payload['user_id'])) {
                return $payload['user_id'];
            }
        }

        return null;
    }
}
