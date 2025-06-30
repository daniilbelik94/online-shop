<?php

namespace App\Presentation\Controller;

use Stripe\Stripe;
use Stripe\PaymentIntent;
use Stripe\Exception\ApiErrorException;

class PaymentController
{
    private string $stripeSecretKey;

    public function __construct(string $stripeSecretKey)
    {
        $this->stripeSecretKey = $stripeSecretKey;
        Stripe::setApiKey($this->stripeSecretKey);
    }

    public function createPaymentIntent(): void
    {
        header('Content-Type: application/json');

        try {
            $input = json_decode(file_get_contents('php://input'), true);

            if (!isset($input['amount']) || $input['amount'] <= 0) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid amount']);
                return;
            }

            $paymentIntent = PaymentIntent::create([
                'amount' => $input['amount'], // в центах
                'currency' => 'usd',
                'metadata' => [
                    'user_id' => $input['user_id'] ?? null,
                    'order_id' => $input['order_id'] ?? null
                ]
            ]);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'clientSecret' => $paymentIntent->client_secret
            ]);
        } catch (ApiErrorException $e) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Payment intent creation failed: ' . $e->getMessage()
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Failed to create payment intent: ' . $e->getMessage()
            ]);
        }
    }

    public function confirmPayment(): void
    {
        header('Content-Type: application/json');

        try {
            $input = json_decode(file_get_contents('php://input'), true);

            if (!isset($input['payment_intent_id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Payment intent ID required']);
                return;
            }

            $paymentIntent = PaymentIntent::retrieve($input['payment_intent_id']);

            if ($paymentIntent->status === 'succeeded') {
                // Обновить статус заказа
                // $this->orderService->updatePaymentStatus($orderId, 'paid');

                http_response_code(200);
                echo json_encode([
                    'success' => true,
                    'message' => 'Payment confirmed successfully'
                ]);
            } else {
                http_response_code(400);
                echo json_encode([
                    'success' => false,
                    'error' => 'Payment not completed'
                ]);
            }
        } catch (ApiErrorException $e) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Payment confirmation failed: ' . $e->getMessage()
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Failed to confirm payment: ' . $e->getMessage()
            ]);
        }
    }

    public function getPaymentStatus(string $paymentIntentId): void
    {
        header('Content-Type: application/json');

        try {
            $paymentIntent = PaymentIntent::retrieve($paymentIntentId);

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'status' => $paymentIntent->status,
                'amount' => $paymentIntent->amount,
                'currency' => $paymentIntent->currency
            ]);
        } catch (ApiErrorException $e) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => 'Failed to retrieve payment status: ' . $e->getMessage()
            ]);
        } catch (\Exception $e) {
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Failed to get payment status: ' . $e->getMessage()
            ]);
        }
    }
}
