<?php

namespace App\Presentation\Controller;

use App\Application\Service\CouponService;
use App\Presentation\Middleware\AuthMiddleware;

class CouponController
{
    private CouponService $couponService;
    private AuthMiddleware $authMiddleware;

    public function __construct(CouponService $couponService, AuthMiddleware $authMiddleware)
    {
        $this->couponService = $couponService;
        $this->authMiddleware = $authMiddleware;
    }

    public function index(): void
    {
        try {
            $page = (int) ($_GET['page'] ?? 1);
            $limit = min((int) ($_GET['limit'] ?? 20), 50);
            $type = $_GET['type'] ?? '';
            $active = isset($_GET['active']) ? (bool) $_GET['active'] : null;

            $filters = [];
            if (!empty($type)) {
                $filters['type'] = $type;
            }
            if ($active !== null) {
                $filters['active'] = $active;
            }

            $result = $this->couponService->getCoupons($filters, $page, $limit);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $result['data'],
                'pagination' => $result['pagination']
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Failed to retrieve coupons: ' . $e->getMessage()
            ]);
        }
    }

    public function show(string $id): void
    {
        try {
            $coupon = $this->couponService->getCoupon($id);

            if (!$coupon) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'error' => 'Coupon not found'
                ]);
                return;
            }

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $this->formatCouponResponse($coupon)
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Failed to retrieve coupon: ' . $e->getMessage()
            ]);
        }
    }

    public function store(): void
    {
        // Check admin authentication
        $userPayload = $this->authMiddleware->handle('is_staff');
        if (!$userPayload) {
            return; // Error already sent by middleware
        }

        try {
            $input = json_decode(file_get_contents('php://input'), true);

            if (
                !isset($input['code']) || !isset($input['name']) ||
                !isset($input['description']) || !isset($input['type']) ||
                !isset($input['value'])
            ) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Missing required fields: code, name, description, type, value'
                ]);
                return;
            }

            $coupon = $this->couponService->createCoupon($input);

            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Coupon created successfully',
                'data' => $this->formatCouponResponse($coupon)
            ]);
        } catch (\InvalidArgumentException $e) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Failed to create coupon: ' . $e->getMessage()
            ]);
        }
    }

    public function update(string $id): void
    {
        // Check admin authentication
        $userPayload = $this->authMiddleware->handle('is_staff');
        if (!$userPayload) {
            return; // Error already sent by middleware
        }

        try {
            $input = json_decode(file_get_contents('php://input'), true);

            $coupon = $this->couponService->updateCoupon($id, $input);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Coupon updated successfully',
                'data' => $this->formatCouponResponse($coupon)
            ]);
        } catch (\InvalidArgumentException $e) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Failed to update coupon: ' . $e->getMessage()
            ]);
        }
    }

    public function delete(string $id): void
    {
        // Check admin authentication
        $userPayload = $this->authMiddleware->handle('is_staff');
        if (!$userPayload) {
            return; // Error already sent by middleware
        }

        try {
            $this->couponService->deleteCoupon($id);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Coupon deleted successfully'
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Failed to delete coupon: ' . $e->getMessage()
            ]);
        }
    }

    public function activate(string $id): void
    {
        // Check admin authentication
        $userPayload = $this->authMiddleware->handle('is_staff');
        if (!$userPayload) {
            return; // Error already sent by middleware
        }

        try {
            $coupon = $this->couponService->activateCoupon($id);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Coupon activated successfully',
                'data' => $this->formatCouponResponse($coupon)
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Failed to activate coupon: ' . $e->getMessage()
            ]);
        }
    }

    public function deactivate(string $id): void
    {
        // Check admin authentication
        $userPayload = $this->authMiddleware->handle('is_staff');
        if (!$userPayload) {
            return; // Error already sent by middleware
        }

        try {
            $coupon = $this->couponService->deactivateCoupon($id);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Coupon deactivated successfully',
                'data' => $this->formatCouponResponse($coupon)
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Failed to deactivate coupon: ' . $e->getMessage()
            ]);
        }
    }

    public function validate(): void
    {
        try {
            $input = json_decode(file_get_contents('php://input'), true);

            if (!isset($input['code'])) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Coupon code is required'
                ]);
                return;
            }

            $orderAmount = $input['order_amount'] ?? 0;
            $productIds = $input['product_ids'] ?? [];
            $categoryIds = $input['category_ids'] ?? [];

            $coupon = $this->couponService->validateCoupon($input['code'], $orderAmount, $productIds, $categoryIds);

            if (!$coupon) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Invalid or expired coupon code'
                ]);
                return;
            }

            $discount = $coupon->calculateDiscount($orderAmount);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => [
                    'coupon' => $this->formatCouponResponse($coupon),
                    'discount_amount' => $discount,
                    'discount_percent' => $coupon->getType() === 'percentage' ? $coupon->getValue() : null,
                    'free_shipping' => $coupon->getType() === 'free_shipping'
                ]
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Failed to validate coupon: ' . $e->getMessage()
            ]);
        }
    }

    public function statistics(): void
    {
        // Check admin authentication
        $userPayload = $this->authMiddleware->handle('is_staff');
        if (!$userPayload) {
            return; // Error already sent by middleware
        }

        try {
            $statistics = $this->couponService->getStatistics();

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $statistics
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Failed to get statistics: ' . $e->getMessage()
            ]);
        }
    }

    private function formatCouponResponse($coupon): array
    {
        return [
            'id' => $coupon->getId(),
            'code' => $coupon->getCode(),
            'name' => $coupon->getName(),
            'description' => $coupon->getDescription(),
            'type' => $coupon->getType(),
            'value' => $coupon->getValue(),
            'min_order_amount' => $coupon->getMinOrderAmount(),
            'max_discount_amount' => $coupon->getMaxDiscountAmount(),
            'is_active' => $coupon->isActive(),
            'is_single_use' => $coupon->isSingleUse(),
            'max_uses' => $coupon->getMaxUses(),
            'used_count' => $coupon->getUsedCount(),
            'start_date' => $coupon->getStartDate()?->format('Y-m-d H:i:s'),
            'end_date' => $coupon->getEndDate()?->format('Y-m-d H:i:s'),
            'applicable_categories' => $coupon->getApplicableCategories(),
            'excluded_categories' => $coupon->getExcludedCategories(),
            'applicable_products' => $coupon->getApplicableProducts(),
            'excluded_products' => $coupon->getExcludedProducts(),
            'first_time_only' => $coupon->isFirstTimeOnly(),
            'can_be_used' => $coupon->canBeUsed(),
            'created_at' => $coupon->getCreatedAt()->format('Y-m-d H:i:s'),
            'updated_at' => $coupon->getUpdatedAt()->format('Y-m-d H:i:s'),
        ];
    }
}
