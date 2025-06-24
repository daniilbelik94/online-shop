<?php

namespace App\Domain\Entity;

class User
{
    private ?string $id = null;
    private string $username;
    private string $email;
    private string $passwordHash;
    private string $firstName;
    private string $lastName;
    private ?string $phone = null;
    private string $role = 'customer';
    private bool $emailVerified = false;
    private bool $isActive = true;
    private \DateTimeImmutable $createdAt;
    private \DateTimeImmutable $updatedAt;
    private ?\DateTimeImmutable $lastLogin = null;

    public function __construct(
        string $username,
        string $email,
        string $passwordHash,
        string $firstName,
        string $lastName,
        ?string $phone = null
    ) {
        $this->username = $username;
        $this->email = $email;
        $this->passwordHash = $passwordHash;
        $this->firstName = $firstName;
        $this->lastName = $lastName;
        $this->phone = $phone;
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
    }

    // Getters
    public function getId(): ?string
    {
        return $this->id;
    }

    public function getUsername(): string
    {
        return $this->username;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function getPasswordHash(): string
    {
        return $this->passwordHash;
    }

    public function getFirstName(): string
    {
        return $this->firstName;
    }

    public function getLastName(): string
    {
        return $this->lastName;
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function getRole(): string
    {
        return $this->role;
    }

    public function isEmailVerified(): bool
    {
        return $this->emailVerified;
    }

    public function isActive(): bool
    {
        return $this->isActive;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): \DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function getLastLogin(): ?\DateTimeImmutable
    {
        return $this->lastLogin;
    }

    // Setters for mutable properties
    public function setId(string $id): void
    {
        $this->id = $id;
    }

    public function updateProfile(string $firstName, string $lastName, ?string $phone = null): void
    {
        $this->firstName = $firstName;
        $this->lastName = $lastName;
        $this->phone = $phone;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function setRole(string $role): void
    {
        if (!in_array($role, ['customer', 'admin', 'staff'])) {
            throw new \InvalidArgumentException('Invalid role');
        }
        $this->role = $role;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function verifyEmail(): void
    {
        $this->emailVerified = true;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function deactivate(): void
    {
        $this->isActive = false;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function activate(): void
    {
        $this->isActive = true;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function updateLastLogin(): void
    {
        $this->lastLogin = new \DateTimeImmutable();
    }

    public function changePassword(string $newPasswordHash): void
    {
        $this->passwordHash = $newPasswordHash;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function isStaff(): bool
    {
        return in_array($this->role, ['admin', 'staff']);
    }

    public function isSuperuser(): bool
    {
        return $this->role === 'admin';
    }
}
