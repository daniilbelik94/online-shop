<?php

namespace App\Presentation\Controller;

use Exception;

class ImageUploadController
{
    private string $uploadPath;
    private array $allowedTypes;
    private int $maxFileSize;

    public function __construct()
    {
        $this->uploadPath = __DIR__ . '/../../../public/uploads/';
        $this->allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        $this->maxFileSize = 5 * 1024 * 1024; // 5MB

        // Create upload directory if it doesn't exist
        if (!is_dir($this->uploadPath)) {
            mkdir($this->uploadPath, 0755, true);
        }
    }

    public function uploadSingle(): void
    {
        header('Content-Type: application/json');

        try {
            if (!isset($_FILES['image'])) {
                throw new Exception('No image file provided');
            }

            $file = $_FILES['image'];
            $this->validateFile($file);

            $filename = $this->generateUniqueFilename($file['name']);
            $fullPath = $this->uploadPath . $filename;

            if (!move_uploaded_file($file['tmp_name'], $fullPath)) {
                throw new Exception('Failed to move uploaded file');
            }

            // Return the URL path (not the full system path)
            $imageUrl = '/uploads/' . $filename;

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => [
                    'url' => $imageUrl,
                    'filename' => $filename,
                    'size' => $file['size'],
                    'type' => $file['type']
                ]
            ]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }

    public function uploadMultiple(): void
    {
        header('Content-Type: application/json');

        try {
            if (!isset($_FILES['images'])) {
                throw new Exception('No image files provided');
            }

            $files = $_FILES['images'];
            $uploadedFiles = [];

            // Handle multiple files
            if (is_array($files['tmp_name'])) {
                for ($i = 0; $i < count($files['tmp_name']); $i++) {
                    if ($files['error'][$i] === UPLOAD_ERR_OK) {
                        $file = [
                            'name' => $files['name'][$i],
                            'type' => $files['type'][$i],
                            'tmp_name' => $files['tmp_name'][$i],
                            'error' => $files['error'][$i],
                            'size' => $files['size'][$i]
                        ];

                        $this->validateFile($file);

                        $filename = $this->generateUniqueFilename($file['name']);
                        $fullPath = $this->uploadPath . $filename;

                        if (move_uploaded_file($file['tmp_name'], $fullPath)) {
                            $uploadedFiles[] = [
                                'url' => '/uploads/' . $filename,
                                'filename' => $filename,
                                'size' => $file['size'],
                                'type' => $file['type']
                            ];
                        }
                    }
                }
            } else {
                // Single file in multiple upload field
                $this->validateFile($files);

                $filename = $this->generateUniqueFilename($files['name']);
                $fullPath = $this->uploadPath . $filename;

                if (move_uploaded_file($files['tmp_name'], $fullPath)) {
                    $uploadedFiles[] = [
                        'url' => '/uploads/' . $filename,
                        'filename' => $filename,
                        'size' => $files['size'],
                        'type' => $files['type']
                    ];
                }
            }

            if (empty($uploadedFiles)) {
                throw new Exception('No files were uploaded successfully');
            }

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'data' => $uploadedFiles
            ]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }

    public function deleteImage(): void
    {
        header('Content-Type: application/json');

        try {
            $input = json_decode(file_get_contents('php://input'), true);

            if (!isset($input['filename']) || empty($input['filename'])) {
                throw new Exception('Filename is required');
            }

            $filename = basename($input['filename']); // Security: only filename, no path
            $fullPath = $this->uploadPath . $filename;

            if (!file_exists($fullPath)) {
                throw new Exception('File not found');
            }

            if (!unlink($fullPath)) {
                throw new Exception('Failed to delete file');
            }

            http_response_code(200);
            echo json_encode([
                'success' => true,
                'message' => 'File deleted successfully'
            ]);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode([
                'success' => false,
                'error' => $e->getMessage()
            ]);
        }
    }

    private function validateFile(array $file): void
    {
        if ($file['error'] !== UPLOAD_ERR_OK) {
            throw new Exception('File upload error: ' . $this->getUploadErrorMessage($file['error']));
        }

        if (!in_array($file['type'], $this->allowedTypes)) {
            throw new Exception('Invalid file type. Allowed types: ' . implode(', ', $this->allowedTypes));
        }

        if ($file['size'] > $this->maxFileSize) {
            throw new Exception('File size too large. Maximum size: ' . ($this->maxFileSize / 1024 / 1024) . 'MB');
        }

        // Additional security check
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        if (!in_array($mimeType, $this->allowedTypes)) {
            throw new Exception('Invalid file type detected');
        }
    }

    private function generateUniqueFilename(string $originalName): string
    {
        $extension = pathinfo($originalName, PATHINFO_EXTENSION);
        $baseName = pathinfo($originalName, PATHINFO_FILENAME);
        $safeName = preg_replace('/[^A-Za-z0-9_-]/', '_', $baseName);

        return $safeName . '_' . time() . '_' . uniqid() . '.' . $extension;
    }

    private function getUploadErrorMessage(int $error): string
    {
        switch ($error) {
            case UPLOAD_ERR_INI_SIZE:
            case UPLOAD_ERR_FORM_SIZE:
                return 'File is too large';
            case UPLOAD_ERR_PARTIAL:
                return 'File was only partially uploaded';
            case UPLOAD_ERR_NO_FILE:
                return 'No file was uploaded';
            case UPLOAD_ERR_NO_TMP_DIR:
                return 'Missing temporary folder';
            case UPLOAD_ERR_CANT_WRITE:
                return 'Failed to write file to disk';
            case UPLOAD_ERR_EXTENSION:
                return 'File upload stopped by extension';
            default:
                return 'Unknown upload error';
        }
    }
}
