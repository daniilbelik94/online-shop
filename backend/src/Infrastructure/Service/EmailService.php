<?php

namespace App\Infrastructure\Service;

use App\Domain\Service\EmailServiceInterface;

class EmailService implements EmailServiceInterface
{
    private array $config;

    public function __construct(array $config)
    {
        $this->config = $config;
    }

    public function sendOrderConfirmation(string $to, array $orderData): bool
    {
        try {
            $subject = "Order Confirmation - {$orderData['order_number']}";
            $body = $this->renderTemplate('order-confirmation', [
                'order' => $orderData,
                'app_name' => $this->config['app']['name'] ?? 'Online Shop',
                'app_url' => $this->config['app']['url'] ?? 'http://localhost:5173'
            ]);

            return $this->sendEmail($to, $subject, $body);
        } catch (\Exception $e) {
            error_log("Failed to send order confirmation email: " . $e->getMessage());
            return false;
        }
    }

    public function sendOrderStatusUpdate(string $to, array $orderData): bool
    {
        try {
            $subject = "Order Update - {$orderData['order_number']}";
            $body = $this->renderTemplate('order-status-update', [
                'order' => $orderData,
                'app_name' => $this->config['app']['name'] ?? 'Online Shop',
                'app_url' => $this->config['app']['url'] ?? 'http://localhost:5173'
            ]);

            return $this->sendEmail($to, $subject, $body);
        } catch (\Exception $e) {
            error_log("Failed to send order status update email: " . $e->getMessage());
            return false;
        }
    }

    public function sendWelcomeEmail(string $to, array $userData): bool
    {
        try {
            $subject = "Welcome to {$this->config['app']['name']}!";
            $body = $this->renderTemplate('welcome', [
                'user' => $userData,
                'app_name' => $this->config['app']['name'] ?? 'Online Shop',
                'app_url' => $this->config['app']['url'] ?? 'http://localhost:5173'
            ]);

            return $this->sendEmail($to, $subject, $body);
        } catch (\Exception $e) {
            error_log("Failed to send welcome email: " . $e->getMessage());
            return false;
        }
    }

    private function sendEmail(string $to, string $subject, string $body): bool
    {
        $emailConfig = $this->config['email'] ?? [];

        // Use PHP's built-in mail function for simplicity in development
        if (!($emailConfig['use_smtp'] ?? false)) {
            return $this->sendWithPhpMail($to, $subject, $body);
        }

        // For production, you would implement SMTP here
        // This is a placeholder for SMTP implementation
        return $this->sendWithSMTP($to, $subject, $body);
    }

    private function sendWithPhpMail(string $to, string $subject, string $body): bool
    {
        $emailConfig = $this->config['email'] ?? [];
        $fromEmail = $emailConfig['from_email'] ?? 'noreply@localhost.com';
        $fromName = $emailConfig['from_name'] ?? 'Online Shop';

        $headers = [
            'MIME-Version: 1.0',
            'Content-type: text/html; charset=UTF-8',
            "From: {$fromName} <{$fromEmail}>",
            "Reply-To: {$fromEmail}",
            'X-Mailer: PHP/' . phpversion()
        ];

        $result = mail($to, $subject, $body, implode("\r\n", $headers));

        if (!$result) {
            error_log("PHP mail() function failed to send email to: {$to}");
        } else {
            error_log("Email sent successfully to: {$to} with subject: {$subject}");
        }

        return $result;
    }

    private function sendWithSMTP(string $to, string $subject, string $body): bool
    {
        // Placeholder for SMTP implementation
        // In production, you would use a library like PHPMailer or SwiftMailer
        error_log("SMTP email sending not implemented yet. Would send to: {$to}");
        return false;
    }

    private function renderTemplate(string $template, array $data): string
    {
        $templatePath = __DIR__ . "/../../templates/email/{$template}.php";

        if (!file_exists($templatePath)) {
            throw new \Exception("Email template not found: {$template}");
        }

        // Extract variables for use in template
        extract($data);

        // Start output buffering
        ob_start();

        // Include the template
        include $templatePath;

        // Get the contents and clean the buffer
        $content = ob_get_clean();

        return $content;
    }
}