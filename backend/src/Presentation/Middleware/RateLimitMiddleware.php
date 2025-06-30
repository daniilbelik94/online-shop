<?php

namespace App\Presentation\Middleware;

class RateLimitMiddleware
{
    private $redis;
    private $maxRequests;
    private $window;

    public function __construct($redis = null, int $maxRequests = 100, int $window = 3600)
    {
        $this->redis = $redis;
        $this->maxRequests = $maxRequests;
        $this->window = $window;
    }

    public function handle(): bool
    {
        // If Redis is not available, skip rate limiting
        if (!$this->redis) {
            return true;
        }

        $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
        $key = "rate_limit:$ip";

        try {
            $requests = $this->redis->incr($key);

            if ($requests === 1) {
                $this->redis->expire($key, $this->window);
            }

            if ($requests > $this->maxRequests) {
                http_response_code(429);
                header('Content-Type: application/json');
                echo json_encode([
                    'success' => false,
                    'error' => 'Too many requests. Please try again later.',
                    'retry_after' => $this->window
                ]);
                return false;
            }

            return true;
        } catch (\Exception $e) {
            // If Redis is unavailable, log error but allow request
            error_log("Rate limiting error: " . $e->getMessage());
            return true;
        }
    }

    public function handleStrict(): bool
    {
        // For critical endpoints like login, use stricter limits
        $this->maxRequests = 10;
        $this->window = 300; // 5 minutes
        return $this->handle();
    }
}
