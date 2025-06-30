<?php

namespace App\Presentation\Controller;

use App\Application\Service\WishlistService;
use App\Presentation\Middleware\AuthMiddleware;

class WishlistController
{
    private WishlistService $wishlistService;
    private AuthMiddleware $authMiddleware;

    public function __construct(WishlistService $wishlistService, AuthMiddleware $authMiddleware)
    {
        $this->wishlistService = $wishlistService;
        $this->authMiddleware = $authMiddleware;
    }

    /**
     * Get user's wishlist
     */
    public function getWishlist(): void
    {
        $currentUser = $this->authMiddleware->getCurrentUser();
        if (!$currentUser) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            return;
        }

        try {
            $wishlist = $this->wishlistService->getUserWishlist($currentUser['user_id']);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $wishlist,
                'count' => count($wishlist)
            ]);
        } catch (\Exception $e) {
            error_log("Wishlist error: " . $e->getMessage());
            error_log("Stack trace: " . $e->getTraceAsString());
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Failed to fetch wishlist: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Add product to wishlist
     */
    public function addToWishlist(): void
    {
        $currentUser = $this->authMiddleware->getCurrentUser();
        if (!$currentUser) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            return;
        }

        try {
            $input = json_decode(file_get_contents('php://input'), true);

            if (!isset($input['product_id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Product ID is required']);
                return;
            }

            $wishlistItem = $this->wishlistService->addToWishlist(
                $currentUser['user_id'],
                $input['product_id']
            );

            // Get updated wishlist with product details
            $wishlist = $this->wishlistService->getUserWishlist($currentUser['user_id']);

            // Find the newly added item with product details
            $newItem = null;
            foreach ($wishlist as $item) {
                if ($item['product_id'] === $input['product_id']) {
                    $newItem = $item;
                    break;
                }
            }

            http_response_code(201);
            echo json_encode([
                'success' => true,
                'message' => 'Product added to wishlist',
                'data' => $newItem,
                'wishlist' => $wishlist
            ]);
        } catch (\InvalidArgumentException $e) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Failed to add to wishlist: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove product from wishlist
     */
    public function removeFromWishlist(): void
    {
        $currentUser = $this->authMiddleware->getCurrentUser();
        if (!$currentUser) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            return;
        }

        try {
            // Get product_id from URL parameter (set by router)
            $productId = $_REQUEST['product_id'] ?? null;

            if (!$productId) {
                http_response_code(400);
                echo json_encode(['error' => 'Product ID is required']);
                return;
            }

            $removed = $this->wishlistService->removeFromWishlist(
                $currentUser['user_id'],
                $productId
            );

            if ($removed) {
                http_response_code(200);
                echo json_encode(['message' => 'Product removed from wishlist']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Product not found in wishlist']);
            }
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to remove from wishlist: ' . $e->getMessage()]);
        }
    }

    /**
     * Check if product is in wishlist
     */
    public function checkWishlist(): void
    {
        $currentUser = $this->authMiddleware->getCurrentUser();
        if (!$currentUser) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            return;
        }

        try {
            $productId = $_GET['product_id'] ?? null;

            if (!$productId) {
                http_response_code(400);
                echo json_encode(['error' => 'Product ID is required']);
                return;
            }

            $isInWishlist = $this->wishlistService->isInWishlist(
                $currentUser['user_id'],
                $productId
            );

            http_response_code(200);
            echo json_encode(['in_wishlist' => $isInWishlist]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to check wishlist: ' . $e->getMessage()]);
        }
    }

    /**
     * Clear entire wishlist
     */
    public function clearWishlist(): void
    {
        $currentUser = $this->authMiddleware->getCurrentUser();
        if (!$currentUser) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            return;
        }

        try {
            $cleared = $this->wishlistService->clearWishlist($currentUser['user_id']);

            if ($cleared) {
                http_response_code(200);
                echo json_encode(['message' => 'Wishlist cleared']);
            } else {
                http_response_code(200);
                echo json_encode(['message' => 'Wishlist was already empty']);
            }
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to clear wishlist: ' . $e->getMessage()]);
        }
    }

    /**
     * Get wishlist count
     */
    public function getWishlistCount(): void
    {
        $currentUser = $this->authMiddleware->getCurrentUser();
        if (!$currentUser) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            return;
        }

        try {
            $count = $this->wishlistService->getWishlistCount($currentUser['user_id']);

            http_response_code(200);
            echo json_encode(['count' => $count]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to get wishlist count: ' . $e->getMessage()]);
        }
    }
}
