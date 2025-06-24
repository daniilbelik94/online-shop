<?php

namespace App\Domain\Entity;

class Category
{
    private ?string $id = null;
    private string $name;
    private string $slug;
    private ?string $description = null;
    private ?string $parentId = null;
    private ?string $imageUrl = null;
    private bool $isActive = true;
    private int $sortOrder = 0;
    private \DateTimeImmutable $createdAt;
    private \DateTimeImmutable $updatedAt;

    public function __construct(
        string $name,
        string $slug
    ) {
        $this->name = $name;
        $this->slug = $slug;
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
    }

    // Getters
    public function getId(): ?string
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getSlug(): string
    {
        return $this->slug;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function getParentId(): ?string
    {
        return $this->parentId;
    }

    public function getImageUrl(): ?string
    {
        return $this->imageUrl;
    }

    public function isActive(): bool
    {
        return $this->isActive;
    }

    public function getSortOrder(): int
    {
        return $this->sortOrder;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): \DateTimeImmutable
    {
        return $this->updatedAt;
    }

    // Setters
    public function setId(string $id): void
    {
        $this->id = $id;
    }

    public function updateDetails(
        string $name,
        ?string $description = null,
        ?string $imageUrl = null
    ): void {
        $this->name = $name;
        $this->description = $description;
        $this->imageUrl = $imageUrl;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function setParent(?string $parentId): void
    {
        $this->parentId = $parentId;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function setSortOrder(int $sortOrder): void
    {
        $this->sortOrder = $sortOrder;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function activate(): void
    {
        $this->isActive = true;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function deactivate(): void
    {
        $this->isActive = false;
        $this->updatedAt = new \DateTimeImmutable();
    }
}