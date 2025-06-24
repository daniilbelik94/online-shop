<?php

namespace App\Controllers;

use App\Services\UserService;
use App\Utils\JsonResponse;
use App\Utils\Validator;

class UserController
{
    private UserService $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Get current user profile
     */
    public function getProfile(): void
    {
        try {
            $userId = $_SESSION['user_id'] ?? null;

            if (!$userId) {
                JsonResponse::unauthorized('User not authenticated');
                return;
            }

            $user = $this->userService->getUserById($userId);

            if (!$user) {
                JsonResponse::notFound('User not found');
                return;
            }

            // Remove password from response
            unset($user['password']);

            JsonResponse::success($user);
        } catch (\Exception $e) {
            error_log("Error getting user profile: " . $e->getMessage());
            JsonResponse::error('Failed to get user profile');
        }
    }

    /**
     * Update user profile
     */
    public function updateProfile(): void
    {
        try {
            $userId = $_SESSION['user_id'] ?? null;

            if (!$userId) {
                JsonResponse::unauthorized('User not authenticated');
                return;
            }

            $input = json_decode(file_get_contents('php://input'), true);

            if (!$input) {
                JsonResponse::badRequest('Invalid JSON data');
                return;
            }

            // Validate input
            $validator = new Validator();
            $validator->required('first_name', $input['first_name'] ?? '');
            $validator->required('last_name', $input['last_name'] ?? '');
            $validator->email('email', $input['email'] ?? '');

            if (!$validator->isValid()) {
                JsonResponse::badRequest('Validation failed', $validator->getErrors());
                return;
            }

            // Check if email is already taken by another user
            if (isset($input['email'])) {
                $existingUser = $this->userService->getUserByEmail($input['email']);
                if ($existingUser && $existingUser['id'] != $userId) {
                    JsonResponse::badRequest('Email is already taken');
                    return;
                }
            }

            $updateData = [
                'first_name' => $input['first_name'],
                'last_name' => $input['last_name'],
                'email' => $input['email'],
                'phone' => $input['phone'] ?? null,
            ];

            $updated = $this->userService->updateUser($userId, $updateData);

            if ($updated) {
                $user = $this->userService->getUserById($userId);
                unset($user['password']);
                JsonResponse::success($user, 'Profile updated successfully');
            } else {
                JsonResponse::error('Failed to update profile');
            }
        } catch (\Exception $e) {
            error_log("Error updating user profile: " . $e->getMessage());
            JsonResponse::error('Failed to update profile');
        }
    }

    /**
     * Change user password
     */
    public function changePassword(): void
    {
        try {
            $userId = $_SESSION['user_id'] ?? null;

            if (!$userId) {
                JsonResponse::unauthorized('User not authenticated');
                return;
            }

            $input = json_decode(file_get_contents('php://input'), true);

            if (!$input) {
                JsonResponse::badRequest('Invalid JSON data');
                return;
            }

            // Validate input
            $validator = new Validator();
            $validator->required('current_password', $input['current_password'] ?? '');
            $validator->required('new_password', $input['new_password'] ?? '');
            $validator->minLength('new_password', $input['new_password'] ?? '', 6);

            if (!$validator->isValid()) {
                JsonResponse::badRequest('Validation failed', $validator->getErrors());
                return;
            }

            // Verify current password
            $user = $this->userService->getUserById($userId);
            if (!$user || !password_verify($input['current_password'], $user['password'])) {
                JsonResponse::badRequest('Current password is incorrect');
                return;
            }

            // Update password
            $updated = $this->userService->updatePassword($userId, $input['new_password']);

            if ($updated) {
                JsonResponse::success(null, 'Password changed successfully');
            } else {
                JsonResponse::error('Failed to change password');
            }
        } catch (\Exception $e) {
            error_log("Error changing password: " . $e->getMessage());
            JsonResponse::error('Failed to change password');
        }
    }

    /**
     * Get user orders
     */
    public function getOrders(): void
    {
        try {
            $userId = $_SESSION['user_id'] ?? null;

            if (!$userId) {
                JsonResponse::unauthorized('User not authenticated');
                return;
            }

            // TODO: Implement order service and get user orders
            // For now, return mock data
            $orders = [
                [
                    'id' => 1,
                    'order_number' => 'ORD-2024-001',
                    'date' => '2024-06-20',
                    'status' => 'delivered',
                    'total' => 299.99,
                    'items_count' => 2,
                    'items' => [
                        [
                            'product_name' => 'iPhone 15 Pro',
                            'quantity' => 1,
                            'price' => 199.99
                        ],
                        [
                            'product_name' => 'AirPods Pro',
                            'quantity' => 1,
                            'price' => 100.00
                        ]
                    ]
                ],
                [
                    'id' => 2,
                    'order_number' => 'ORD-2024-002',
                    'date' => '2024-06-18',
                    'status' => 'shipped',
                    'total' => 149.99,
                    'items_count' => 1,
                    'items' => [
                        [
                            'product_name' => 'Dell XPS 13 Plus',
                            'quantity' => 1,
                            'price' => 149.99
                        ]
                    ]
                ]
            ];

            JsonResponse::success($orders);
        } catch (\Exception $e) {
            error_log("Error getting user orders: " . $e->getMessage());
            JsonResponse::error('Failed to get orders');
        }
    }
}
