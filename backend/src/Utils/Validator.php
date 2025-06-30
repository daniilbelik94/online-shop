<?php

namespace App\Utils;

class Validator
{
    private array $errors = [];
    private array $data = [];

    public function validate(array $data, array $rules): bool
    {
        $this->data = $data;
        $this->errors = [];

        foreach ($rules as $field => $fieldRules) {
            foreach ($fieldRules as $rule) {
                $this->applyRule($field, $rule);
            }
        }

        return empty($this->errors);
    }

    private function applyRule(string $field, string $rule): void
    {
        $value = $this->data[$field] ?? null;

        switch ($rule) {
            case 'required':
                if (empty($value)) {
                    $this->errors[$field] = ucfirst($field) . ' is required';
                }
                break;

            case 'email':
                if (!empty($value) && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
                    $this->errors[$field] = 'Please enter a valid email address';
                }
                break;

            case 'min:8':
                if (!empty($value) && strlen($value) < 8) {
                    $this->errors[$field] = ucfirst($field) . ' must be at least 8 characters';
                }
                break;

            case 'min:3':
                if (!empty($value) && strlen($value) < 3) {
                    $this->errors[$field] = ucfirst($field) . ' must be at least 3 characters';
                }
                break;

            case 'max:50':
                if (!empty($value) && strlen($value) > 50) {
                    $this->errors[$field] = ucfirst($field) . ' must be less than 50 characters';
                }
                break;

            case 'max:200':
                if (!empty($value) && strlen($value) > 200) {
                    $this->errors[$field] = ucfirst($field) . ' must be less than 200 characters';
                }
                break;

            case 'password_strength':
                if (!empty($value)) {
                    if (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/', $value)) {
                        $this->errors[$field] = 'Password must contain uppercase, lowercase, number and special character';
                    }
                }
                break;

            case 'username_format':
                if (!empty($value)) {
                    if (!preg_match('/^[a-zA-Z0-9_]+$/', $value)) {
                        $this->errors[$field] = 'Username can only contain letters, numbers and underscores';
                    }
                }
                break;

            case 'phone_format':
                if (!empty($value)) {
                    if (!preg_match('/^\+?[\d\s\-\(\)]+$/', $value)) {
                        $this->errors[$field] = 'Please enter a valid phone number';
                    }
                }
                break;

            case 'positive_number':
                if (!empty($value) && (!is_numeric($value) || $value <= 0)) {
                    $this->errors[$field] = ucfirst($field) . ' must be a positive number';
                }
                break;

            case 'integer':
                if (!empty($value) && (!is_numeric($value) || floor($value) != $value)) {
                    $this->errors[$field] = ucfirst($field) . ' must be a whole number';
                }
                break;

            case 'non_negative':
                if (!empty($value) && (!is_numeric($value) || $value < 0)) {
                    $this->errors[$field] = ucfirst($field) . ' cannot be negative';
                }
                break;
        }
    }

    public function required(string $field, $value): void
    {
        if (empty($value)) {
            $this->errors[$field] = "{$field} is required";
        }
    }

    public function email(string $field, string $value): void
    {
        if (!empty($value) && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
            $this->errors[$field] = "{$field} must be a valid email address";
        }
    }

    public function minLength(string $field, string $value, int $minLength): void
    {
        if (!empty($value) && strlen($value) < $minLength) {
            $this->errors[$field] = "{$field} must be at least {$minLength} characters long";
        }
    }

    public function maxLength(string $field, string $value, int $maxLength): void
    {
        if (!empty($value) && strlen($value) > $maxLength) {
            $this->errors[$field] = "{$field} must be less than {$maxLength} characters";
        }
    }

    public function isValid(): bool
    {
        return empty($this->errors);
    }

    public function getErrors(): array
    {
        return $this->errors;
    }

    public function sanitize(array $data): array
    {
        $sanitized = [];

        foreach ($data as $key => $value) {
            if (is_string($value)) {
                $sanitized[$key] = htmlspecialchars(trim($value), ENT_QUOTES, 'UTF-8');
            } else {
                $sanitized[$key] = $value;
            }
        }

        return $sanitized;
    }

    public function validatePassword(string $password): bool
    {
        // Минимум 8 символов, хотя бы одна заглавная, одна строчная, одна цифра, один спецсимвол
        return strlen($password) >= 8 &&
            preg_match('/[A-Z]/', $password) &&
            preg_match('/[a-z]/', $password) &&
            preg_match('/\d/', $password) &&
            preg_match('/[@$!%*?&]/', $password);
    }

    public function validateEmail(string $email): bool
    {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }

    public function validatePhone(string $phone): bool
    {
        return preg_match('/^\+?[\d\s\-\(\)]+$/', $phone);
    }
}
