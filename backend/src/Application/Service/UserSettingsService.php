<?php

namespace App\Application\Service;

use App\Domain\Entity\UserSettings;
use App\Infrastructure\Persistence\Postgres\PostgresUserSettingsRepository;

class UserSettingsService
{
    private PostgresUserSettingsRepository $userSettingsRepository;

    public function __construct(PostgresUserSettingsRepository $userSettingsRepository)
    {
        $this->userSettingsRepository = $userSettingsRepository;
    }

    public function getUserSettings(string $userId): ?UserSettings
    {
        return $this->userSettingsRepository->findByUserId($userId);
    }

    public function createDefaultSettings(string $userId): UserSettings
    {
        $settings = new UserSettings(
            id: bin2hex(random_bytes(16)),
            userId: $userId
        );

        $this->userSettingsRepository->save($settings);
        return $settings;
    }

    public function updateSettings(string $userId, array $settingsData): UserSettings
    {
        $existingSettings = $this->getUserSettings($userId);

        if (!$existingSettings) {
            $existingSettings = $this->createDefaultSettings($userId);
        }

        // Create updated settings object
        $updatedSettings = new UserSettings(
            id: $existingSettings->id,
            userId: $userId,
            // Notification settings
            emailMarketing: $settingsData['notifications']['email_marketing'] ?? $existingSettings->emailMarketing,
            orderUpdates: $settingsData['notifications']['order_updates'] ?? $existingSettings->orderUpdates,
            securityAlerts: $settingsData['notifications']['security_alerts'] ?? $existingSettings->securityAlerts,
            priceDrops: $settingsData['notifications']['price_drops'] ?? $existingSettings->priceDrops,
            backInStock: $settingsData['notifications']['back_in_stock'] ?? $existingSettings->backInStock,
            newsletter: $settingsData['notifications']['newsletter'] ?? $existingSettings->newsletter,
            smsNotifications: $settingsData['notifications']['sms_notifications'] ?? $existingSettings->smsNotifications,
            pushNotifications: $settingsData['notifications']['push_notifications'] ?? $existingSettings->pushNotifications,
            // Privacy settings
            profileVisibility: $settingsData['privacy']['profile_visibility'] ?? $existingSettings->profileVisibility,
            showOnlineStatus: $settingsData['privacy']['show_online_status'] ?? $existingSettings->showOnlineStatus,
            shareWishlist: $settingsData['privacy']['share_wishlist'] ?? $existingSettings->shareWishlist,
            allowRecommendations: $settingsData['privacy']['allow_recommendations'] ?? $existingSettings->allowRecommendations,
            cookiesAnalytics: $settingsData['privacy']['cookies_analytics'] ?? $existingSettings->cookiesAnalytics,
            cookiesMarketing: $settingsData['privacy']['cookies_marketing'] ?? $existingSettings->cookiesMarketing,
            dataSharing: $settingsData['privacy']['data_sharing'] ?? $existingSettings->dataSharing,
            // Appearance settings
            theme: $settingsData['appearance']['theme'] ?? $existingSettings->theme,
            language: $settingsData['appearance']['language'] ?? $existingSettings->language,
            currency: $settingsData['appearance']['currency'] ?? $existingSettings->currency,
            timezone: $settingsData['appearance']['timezone'] ?? $existingSettings->timezone,
            compactMode: $settingsData['appearance']['compact_mode'] ?? $existingSettings->compactMode,
            animations: $settingsData['appearance']['animations'] ?? $existingSettings->animations,
            highContrast: $settingsData['appearance']['high_contrast'] ?? $existingSettings->highContrast,
            // Shopping settings
            saveForLater: $settingsData['shopping']['save_for_later'] ?? $existingSettings->saveForLater,
            autoAddToWishlist: $settingsData['shopping']['auto_add_to_wishlist'] ?? $existingSettings->autoAddToWishlist,
            oneClickBuy: $settingsData['shopping']['one_click_buy'] ?? $existingSettings->oneClickBuy,
            rememberPayment: $settingsData['shopping']['remember_payment'] ?? $existingSettings->rememberPayment,
            defaultShipping: $settingsData['shopping']['default_shipping'] ?? $existingSettings->defaultShipping,
            autoApplyDiscounts: $settingsData['shopping']['auto_apply_discounts'] ?? $existingSettings->autoApplyDiscounts,
            // Security settings
            twoFactorEnabled: $settingsData['security']['two_factor_enabled'] ?? $existingSettings->twoFactorEnabled,
            loginAlerts: $settingsData['security']['login_alerts'] ?? $existingSettings->loginAlerts,
            passwordExpiry: $settingsData['security']['password_expiry'] ?? $existingSettings->passwordExpiry,
            secureCheckout: $settingsData['security']['secure_checkout'] ?? $existingSettings->secureCheckout,
            biometricAuth: $settingsData['security']['biometric_auth'] ?? $existingSettings->biometricAuth,
            createdAt: $existingSettings->createdAt,
            updatedAt: new \DateTime()
        );

        $this->userSettingsRepository->save($updatedSettings);
        return $updatedSettings;
    }

    public function deleteSettings(string $userId): bool
    {
        return $this->userSettingsRepository->deleteByUserId($userId);
    }
}
