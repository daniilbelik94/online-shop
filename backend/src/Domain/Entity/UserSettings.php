<?php

namespace App\Domain\Entity;

class UserSettings
{
    public function __construct(
        public readonly string $id,
        public readonly string $userId,
        // Notification settings
        public readonly bool $emailMarketing = true,
        public readonly bool $orderUpdates = true,
        public readonly bool $securityAlerts = true,
        public readonly bool $priceDrops = false,
        public readonly bool $backInStock = false,
        public readonly bool $newsletter = true,
        public readonly bool $smsNotifications = false,
        public readonly bool $pushNotifications = true,
        // Privacy settings
        public readonly string $profileVisibility = 'private',
        public readonly bool $showOnlineStatus = false,
        public readonly bool $shareWishlist = false,
        public readonly bool $allowRecommendations = true,
        public readonly bool $cookiesAnalytics = true,
        public readonly bool $cookiesMarketing = false,
        public readonly bool $dataSharing = false,
        // Appearance settings
        public readonly string $theme = 'light',
        public readonly string $language = 'en',
        public readonly string $currency = 'USD',
        public readonly string $timezone = 'UTC',
        public readonly bool $compactMode = false,
        public readonly bool $animations = true,
        public readonly bool $highContrast = false,
        // Shopping settings
        public readonly bool $saveForLater = true,
        public readonly bool $autoAddToWishlist = false,
        public readonly bool $oneClickBuy = false,
        public readonly bool $rememberPayment = false,
        public readonly string $defaultShipping = 'standard',
        public readonly bool $autoApplyDiscounts = true,
        // Security settings
        public readonly bool $twoFactorEnabled = false,
        public readonly bool $loginAlerts = true,
        public readonly int $passwordExpiry = 0,
        public readonly bool $secureCheckout = true,
        public readonly bool $biometricAuth = false,
        public readonly \DateTime $createdAt = new \DateTime(),
        public readonly \DateTime $updatedAt = new \DateTime()
    ) {}

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->userId,
            'notifications' => [
                'email_marketing' => $this->emailMarketing,
                'order_updates' => $this->orderUpdates,
                'security_alerts' => $this->securityAlerts,
                'price_drops' => $this->priceDrops,
                'back_in_stock' => $this->backInStock,
                'newsletter' => $this->newsletter,
                'sms_notifications' => $this->smsNotifications,
                'push_notifications' => $this->pushNotifications,
            ],
            'privacy' => [
                'profile_visibility' => $this->profileVisibility,
                'show_online_status' => $this->showOnlineStatus,
                'share_wishlist' => $this->shareWishlist,
                'allow_recommendations' => $this->allowRecommendations,
                'cookies_analytics' => $this->cookiesAnalytics,
                'cookies_marketing' => $this->cookiesMarketing,
                'data_sharing' => $this->dataSharing,
            ],
            'appearance' => [
                'theme' => $this->theme,
                'language' => $this->language,
                'currency' => $this->currency,
                'timezone' => $this->timezone,
                'compact_mode' => $this->compactMode,
                'animations' => $this->animations,
                'high_contrast' => $this->highContrast,
            ],
            'shopping' => [
                'save_for_later' => $this->saveForLater,
                'auto_add_to_wishlist' => $this->autoAddToWishlist,
                'one_click_buy' => $this->oneClickBuy,
                'remember_payment' => $this->rememberPayment,
                'default_shipping' => $this->defaultShipping,
                'auto_apply_discounts' => $this->autoApplyDiscounts,
            ],
            'security' => [
                'two_factor_enabled' => $this->twoFactorEnabled,
                'login_alerts' => $this->loginAlerts,
                'password_expiry' => $this->passwordExpiry,
                'secure_checkout' => $this->secureCheckout,
                'biometric_auth' => $this->biometricAuth,
            ],
            'created_at' => $this->createdAt->format('Y-m-d H:i:s'),
            'updated_at' => $this->updatedAt->format('Y-m-d H:i:s'),
        ];
    }
}
