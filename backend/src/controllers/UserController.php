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

            // Use the OrderService to get real user orders
            $orderService = new \App\Application\Service\OrderService(
                new \App\Infrastructure\Persistence\Postgres\PostgresOrderRepository($GLOBALS['pdo']),
                new \App\Infrastructure\Persistence\Postgres\PostgresUserRepository($GLOBALS['pdo']),
                new \App\Infrastructure\Persistence\Postgres\PostgresProductRepository($GLOBALS['pdo']),
                new \App\Application\Service\CartService(
                    new \App\Infrastructure\Persistence\Postgres\PostgresUserRepository($GLOBALS['pdo'])
                ),
                new \App\Infrastructure\Service\EmailService()
            );

            $page = (int) ($_GET['page'] ?? 1);
            $limit = (int) ($_GET['limit'] ?? 20);

            $result = $orderService->getUserOrders($userId, [], $page, $limit);

            JsonResponse::success($result);
        } catch (\Exception $e) {
            error_log("Error getting user orders: " . $e->getMessage());
            JsonResponse::error('Failed to get orders');
        }
    }

    /**
     * Get single order details
     */
    public function getOrderDetails(): void
    {
        try {
            $userId = $_SESSION['user_id'] ?? null;

            if (!$userId) {
                JsonResponse::unauthorized('User not authenticated');
                return;
            }

            $orderId = $_GET['order_id'] ?? null;
            if (!$orderId) {
                JsonResponse::badRequest('Order ID is required');
                return;
            }

            $orderService = new \App\Application\Service\OrderService(
                new \App\Infrastructure\Persistence\Postgres\PostgresOrderRepository($GLOBALS['pdo']),
                new \App\Infrastructure\Persistence\Postgres\PostgresUserRepository($GLOBALS['pdo']),
                new \App\Infrastructure\Persistence\Postgres\PostgresProductRepository($GLOBALS['pdo']),
                new \App\Application\Service\CartService(
                    new \App\Infrastructure\Persistence\Postgres\PostgresUserRepository($GLOBALS['pdo'])
                ),
                new \App\Infrastructure\Service\EmailService()
            );

            $order = $orderService->getOrderById($orderId);

            if (!$order) {
                JsonResponse::notFound('Order not found');
                return;
            }

            // Verify order belongs to user
            if ($order['user_id'] !== $userId) {
                JsonResponse::unauthorized('Access denied');
                return;
            }

            JsonResponse::success($order);
        } catch (\Exception $e) {
            error_log("Error getting order details: " . $e->getMessage());
            JsonResponse::error('Failed to get order details');
        }
    }
}