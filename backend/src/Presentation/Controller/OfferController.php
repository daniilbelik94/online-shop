<?php

namespace App\Presentation\Controller;

use App\Application\Service\OfferService;
use App\Presentation\Middleware\AuthMiddleware;

class OfferController
{
    private OfferService $offerService;
    private AuthMiddleware $authMiddleware;

    public function __construct(OfferService $offerService, AuthMiddleware $authMiddleware)
    {
        $this->offerService = $offerService;
        $this->authMiddleware = $authMiddleware;
    }

    public function index(): void
    {
        try {
            $page = (int) ($_GET['page'] ?? 1);
            $limit = min((int) ($_GET['limit'] ?? 20), 50);
            $type = $_GET['type'] ?? '';
            $category = $_GET['category'] ?? '';
            $active = isset($_GET['active']) ? (bool) $_GET['active'] : null;

            $filters = [];
            if (!empty($type)) {
                $filters['type'] = $type;
            }
            if (!empty($category)) {
                $filters['category_id'] = $category;
            }
            if ($active !== null) {
                $filters['active'] = $active;
            }

            $result = $this->offerService->getOffers($filters, $page, $limit);

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
                'error' => 'Failed to retrieve offers: ' . $e->getMessage()
            ]);
        }
    }

    public function show(string $id): void
    {
        try {
            $offer = $this->offerService->getOffer($id);

            if (!$offer) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'error' => 'Offer not found'
                ]);
                return;
            }

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $this->formatOfferResponse($offer)
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Failed to retrieve offer: ' . $e->getMessage()
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
                !isset($input['title']) || !isset($input['description']) ||
                !isset($input['type']) || !isset($input['discount_percent'])
            ) {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Missing required fields: title, description, type, discount_percent'
                ]);
                return;
            }

            $offer = $this->offerService->createOffer($input);

            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Offer created successfully',
                'data' => $this->formatOfferResponse($offer)
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
                'error' => 'Failed to create offer: ' . $e->getMessage()
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

            $offer = $this->offerService->updateOffer($id, $input);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Offer updated successfully',
                'data' => $this->formatOfferResponse($offer)
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
                'error' => 'Failed to update offer: ' . $e->getMessage()
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
            $this->offerService->deleteOffer($id);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Offer deleted successfully'
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Failed to delete offer: ' . $e->getMessage()
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
            $offer = $this->offerService->activateOffer($id);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Offer activated successfully',
                'data' => $this->formatOfferResponse($offer)
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Failed to activate offer: ' . $e->getMessage()
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
            $offer = $this->offerService->deactivateOffer($id);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'Offer deactivated successfully',
                'data' => $this->formatOfferResponse($offer)
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Failed to deactivate offer: ' . $e->getMessage()
            ]);
        }
    }

    public function toggleStatus(string $id): void
    {
        // Check admin authentication
        $userPayload = $this->authMiddleware->handle('is_staff');
        if (!$userPayload) {
            return; // Error already sent by middleware
        }

        try {
            $offer = $this->offerService->getOffer($id);

            if (!$offer) {
                http_response_code(404);
                echo json_encode([
                    'success' => false,
                    'error' => 'Offer not found'
                ]);
                return;
            }

            // Toggle the status
            if ($offer->isActive()) {
                $offer = $this->offerService->deactivateOffer($id);
                $message = 'Offer deactivated successfully';
            } else {
                $offer = $this->offerService->activateOffer($id);
                $message = 'Offer activated successfully';
            }

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => $message,
                'data' => $this->formatOfferResponse($offer)
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Failed to toggle offer status: ' . $e->getMessage()
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
            $statistics = $this->offerService->getStatistics();

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

    private function formatOfferResponse($offer): array
    {
        return [
            'id' => $offer->getId(),
            'title' => $offer->getTitle(),
            'description' => $offer->getDescription(),
            'type' => $offer->getType(),
            'discount_percent' => $offer->getDiscountPercent(),
            'min_order_amount' => $offer->getMinOrderAmount(),
            'max_discount_amount' => $offer->getMaxDiscountAmount(),
            'product_id' => $offer->getProductId(),
            'category_id' => $offer->getCategoryId(),
            'is_active' => $offer->isActive(),
            'is_limited' => $offer->isLimited(),
            'max_uses' => $offer->getMaxUses(),
            'used_count' => $offer->getUsedCount(),
            'start_date' => $offer->getStartDate()?->format('Y-m-d H:i:s'),
            'end_date' => $offer->getEndDate()?->format('Y-m-d H:i:s'),
            'image_url' => $offer->getImageUrl(),
            'conditions' => $offer->getConditions(),
            'can_be_used' => $offer->canBeUsed(),
            'created_at' => $offer->getCreatedAt()->format('Y-m-d H:i:s'),
            'updated_at' => $offer->getUpdatedAt()->format('Y-m-d H:i:s'),
        ];
    }
}
