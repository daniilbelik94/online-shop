<?php

namespace App\Utils;

class JsonResponse
{
    public static function success($data = null, string $message = null): void
    {
        http_response_code(200);
        header('Content-Type: application/json');
        $response = ['success' => true];
        if ($data !== null) {
            $response['data'] = $data;
        }
        if ($message) {
            $response['message'] = $message;
        }
        echo json_encode($response);
    }

    public static function error(string $message, int $code = 500): void
    {
        http_response_code($code);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'error' => $message
        ]);
    }

    public static function badRequest(string $message, $errors = null): void
    {
        http_response_code(400);
        header('Content-Type: application/json');
        $response = [
            'success' => false,
            'error' => $message
        ];
        if ($errors) {
            $response['errors'] = $errors;
        }
        echo json_encode($response);
    }

    public static function unauthorized(string $message): void
    {
        http_response_code(401);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'error' => $message
        ]);
    }

    public static function notFound(string $message): void
    {
        http_response_code(404);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'error' => $message
        ]);
    }
}
