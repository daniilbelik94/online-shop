<?php

namespace App\Domain\Service;

interface EmailServiceInterface
{
    /**
     * Send order confirmation email
     */
    public function sendOrderConfirmation(string $to, array $orderData): bool;

    /**
     * Send order status update email
     */
    public function sendOrderStatusUpdate(string $to, array $orderData): bool;

    /**
     * Send welcome email to new user
     */
    public function sendWelcomeEmail(string $to, array $userData): bool;
}
