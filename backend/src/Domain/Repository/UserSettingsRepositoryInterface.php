<?php

namespace App\Domain\Repository;

use App\Domain\Entity\UserSettings;

interface UserSettingsRepositoryInterface
{
    public function findByUserId(string $userId): ?UserSettings;
    public function save(UserSettings $settings): void;
    public function deleteByUserId(string $userId): bool;
}
