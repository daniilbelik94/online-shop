<?php

namespace App\Presentation\Controller;

use App\Application\Service\UserService;

class UserController
{
    private UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function register(): void
    {
        header('Content-Type: application/json');

        try {
            $input = json_decode(file_get_contents('php://input'), true);

            if (!$this->validateRegistrationInput($input)) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid input data']);
                return;
            }

            $user = $this->userService->registerUser(
                $input['username'],
                $input['email'],
                $input['password'],
                $input['first_name'],
                $input['last_name'],
                $input['phone'] ?? null
            );

            http_response_code(201);
            echo json_encode($this->serializeUser($user));
        } catch (\InvalidArgumentException $e) {
            if (str_contains($e->getMessage(), 'already exists')) {
                http_response_code(409);
            } else {
                http_response_code(400);
            }
            echo json_encode(['error' => $e->getMessage()]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Internal server error']);
        }
    }

    public function getCurrentUser(array $currentUser): void
    {
        header('Content-Type: application/json');

        try {
            $user = $this->userService->getUserById($currentUser['user_id']);

            if (!$user) {
                http_response_code(404);
                echo json_encode(['error' => 'User not found']);
                return;
            }

            http_response_code(200);
            echo json_encode($this->serializeUser($user));
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Internal server error']);
        }
    }

    public function updateCurrentUser(array $currentUser): void
    {
        header('Content-Type: application/json');

        try {
            $input = json_decode(file_get_contents('php://input'), true);

            if (!$input) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid input data']);
                return;
            }

            $user = $this->userService->updateUserProfile(
                $currentUser['user_id'],
                $input['first_name'] ?? '',
                $input['last_name'] ?? '',
                $input['phone'] ?? null
            );

            http_response_code(200);
            echo json_encode($this->serializeUser($user));
        } catch (\InvalidArgumentException $e) {
            http_response_code(400);
            echo json_encode(['error' => $e->getMessage()]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Internal server error']);
        }
    }

    public function changePassword(array $currentUser): void
    {
        header('Content-Type: application/json');

        try {
            $input = json_decode(file_get_contents('php://input'), true);

            if (!$input || !isset($input['current_password']) || !isset($input['new_password'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Current password and new password are required']);
                return;
            }

            if (strlen($input['new_password']) < 6) {
                http_response_code(400);
                echo json_encode(['error' => 'New password must be at least 6 characters long']);
                return;
            }

            // Change password using UserService
            $this->userService->changeUserPassword(
                $currentUser['user_id'],
                $input['current_password'],
                $input['new_password']
            );

            http_response_code(200);
            echo json_encode(['message' => 'Password changed successfully']);
        } catch (\InvalidArgumentException $e) {
            http_response_code(400);
            echo json_encode(['error' => $e->getMessage()]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Internal server error']);
        }
    }

    private function validateRegistrationInput(?array $input): bool
    {
        return $input &&
            isset($input['username']) && !empty($input['username']) &&
            isset($input['email']) && !empty($input['email']) &&
            isset($input['password']) && !empty($input['password']) &&
            isset($input['first_name']) && !empty($input['first_name']) &&
            isset($input['last_name']) && !empty($input['last_name']);
    }

    private function serializeUser($user): array
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
            'updated_at' => $user->getUpdatedAt()->format('Y-m-d\TH:i:s\Z')
        ];
    }
}
