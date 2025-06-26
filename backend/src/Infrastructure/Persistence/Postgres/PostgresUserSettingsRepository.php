<?php

namespace App\Infrastructure\Persistence\Postgres;

use App\Domain\Entity\UserSettings;
use App\Domain\Repository\UserSettingsRepositoryInterface;
use PDO;

class PostgresUserSettingsRepository implements UserSettingsRepositoryInterface
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function findByUserId(string $userId): ?UserSettings
    {
        $sql = "SELECT * FROM user_settings WHERE user_id = :user_id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(['user_id' => $userId]);

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$row) {
            return null;
        }

        return $this->mapRowToEntity($row);
    }

    public function save(UserSettings $settings): void
    {
        // Check if settings exist
        $existing = $this->findByUserId($settings->userId);

        if ($existing) {
            $this->update($settings);
        } else {
            $this->insert($settings);
        }
    }

    public function deleteByUserId(string $userId): bool
    {
        $sql = "DELETE FROM user_settings WHERE user_id = :user_id";
        $stmt = $this->pdo->prepare($sql);
        $result = $stmt->execute(['user_id' => $userId]);

        return $result && $stmt->rowCount() > 0;
    }

    private function insert(UserSettings $settings): void
    {
        $sql = "INSERT INTO user_settings (
            id, user_id, email_marketing, order_updates, security_alerts, price_drops,
            back_in_stock, newsletter, sms_notifications, push_notifications,
            profile_visibility, show_online_status, share_wishlist, allow_recommendations,
            cookies_analytics, cookies_marketing, data_sharing,
            theme, language, currency, timezone, compact_mode, animations, high_contrast,
            save_for_later, auto_add_to_wishlist, one_click_buy, remember_payment,
            default_shipping, auto_apply_discounts,
            two_factor_enabled, login_alerts, password_expiry, secure_checkout, biometric_auth,
            created_at, updated_at
        ) VALUES (
            :id, :user_id, :email_marketing, :order_updates, :security_alerts, :price_drops,
            :back_in_stock, :newsletter, :sms_notifications, :push_notifications,
            :profile_visibility, :show_online_status, :share_wishlist, :allow_recommendations,
            :cookies_analytics, :cookies_marketing, :data_sharing,
            :theme, :language, :currency, :timezone, :compact_mode, :animations, :high_contrast,
            :save_for_later, :auto_add_to_wishlist, :one_click_buy, :remember_payment,
            :default_shipping, :auto_apply_discounts,
            :two_factor_enabled, :login_alerts, :password_expiry, :secure_checkout, :biometric_auth,
            :created_at, :updated_at
        )";

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($this->mapEntityToParams($settings));
    }

    private function update(UserSettings $settings): void
    {
        $sql = "UPDATE user_settings SET
            email_marketing = :email_marketing, order_updates = :order_updates,
            security_alerts = :security_alerts, price_drops = :price_drops,
            back_in_stock = :back_in_stock, newsletter = :newsletter,
            sms_notifications = :sms_notifications, push_notifications = :push_notifications,
            profile_visibility = :profile_visibility, show_online_status = :show_online_status,
            share_wishlist = :share_wishlist, allow_recommendations = :allow_recommendations,
            cookies_analytics = :cookies_analytics, cookies_marketing = :cookies_marketing,
            data_sharing = :data_sharing, theme = :theme, language = :language,
            currency = :currency, timezone = :timezone, compact_mode = :compact_mode,
            animations = :animations, high_contrast = :high_contrast,
            save_for_later = :save_for_later, auto_add_to_wishlist = :auto_add_to_wishlist,
            one_click_buy = :one_click_buy, remember_payment = :remember_payment,
            default_shipping = :default_shipping, auto_apply_discounts = :auto_apply_discounts,
            two_factor_enabled = :two_factor_enabled, login_alerts = :login_alerts,
            password_expiry = :password_expiry, secure_checkout = :secure_checkout,
            biometric_auth = :biometric_auth, updated_at = :updated_at
            WHERE user_id = :user_id";

        $stmt = $this->pdo->prepare($sql);
        $params = $this->mapEntityToParams($settings);
        unset($params[':id']); // Remove ID from params for update
        unset($params[':created_at']); // Don't update created_at
        $stmt->execute($params);
    }

    private function mapRowToEntity(array $row): UserSettings
    {
        return new UserSettings(
            id: $row['id'],
            userId: $row['user_id'],
            emailMarketing: (bool)$row['email_marketing'],
            orderUpdates: (bool)$row['order_updates'],
            securityAlerts: (bool)$row['security_alerts'],
            priceDrops: (bool)$row['price_drops'],
            backInStock: (bool)$row['back_in_stock'],
            newsletter: (bool)$row['newsletter'],
            smsNotifications: (bool)$row['sms_notifications'],
            pushNotifications: (bool)$row['push_notifications'],
            profileVisibility: $row['profile_visibility'],
            showOnlineStatus: (bool)$row['show_online_status'],
            shareWishlist: (bool)$row['share_wishlist'],
            allowRecommendations: (bool)$row['allow_recommendations'],
            cookiesAnalytics: (bool)$row['cookies_analytics'],
            cookiesMarketing: (bool)$row['cookies_marketing'],
            dataSharing: (bool)$row['data_sharing'],
            theme: $row['theme'],
            language: $row['language'],
            currency: $row['currency'],
            timezone: $row['timezone'],
            compactMode: (bool)$row['compact_mode'],
            animations: (bool)$row['animations'],
            highContrast: (bool)$row['high_contrast'],
            saveForLater: (bool)$row['save_for_later'],
            autoAddToWishlist: (bool)$row['auto_add_to_wishlist'],
            oneClickBuy: (bool)$row['one_click_buy'],
            rememberPayment: (bool)$row['remember_payment'],
            defaultShipping: $row['default_shipping'],
            autoApplyDiscounts: (bool)$row['auto_apply_discounts'],
            twoFactorEnabled: (bool)$row['two_factor_enabled'],
            loginAlerts: (bool)$row['login_alerts'],
            passwordExpiry: (int)$row['password_expiry'],
            secureCheckout: (bool)$row['secure_checkout'],
            biometricAuth: (bool)$row['biometric_auth'],
            createdAt: new \DateTime($row['created_at']),
            updatedAt: new \DateTime($row['updated_at'])
        );
    }

    private function mapEntityToParams(UserSettings $settings): array
    {
        return [
            ':id' => $settings->id,
            ':user_id' => $settings->userId,
            ':email_marketing' => $settings->emailMarketing,
            ':order_updates' => $settings->orderUpdates,
            ':security_alerts' => $settings->securityAlerts,
            ':price_drops' => $settings->priceDrops,
            ':back_in_stock' => $settings->backInStock,
            ':newsletter' => $settings->newsletter,
            ':sms_notifications' => $settings->smsNotifications,
            ':push_notifications' => $settings->pushNotifications,
            ':profile_visibility' => $settings->profileVisibility,
            ':show_online_status' => $settings->showOnlineStatus,
            ':share_wishlist' => $settings->shareWishlist,
            ':allow_recommendations' => $settings->allowRecommendations,
            ':cookies_analytics' => $settings->cookiesAnalytics,
            ':cookies_marketing' => $settings->cookiesMarketing,
            ':data_sharing' => $settings->dataSharing,
            ':theme' => $settings->theme,
            ':language' => $settings->language,
            ':currency' => $settings->currency,
            ':timezone' => $settings->timezone,
            ':compact_mode' => $settings->compactMode,
            ':animations' => $settings->animations,
            ':high_contrast' => $settings->highContrast,
            ':save_for_later' => $settings->saveForLater,
            ':auto_add_to_wishlist' => $settings->autoAddToWishlist,
            ':one_click_buy' => $settings->oneClickBuy,
            ':remember_payment' => $settings->rememberPayment,
            ':default_shipping' => $settings->defaultShipping,
            ':auto_apply_discounts' => $settings->autoApplyDiscounts,
            ':two_factor_enabled' => $settings->twoFactorEnabled,
            ':login_alerts' => $settings->loginAlerts,
            ':password_expiry' => $settings->passwordExpiry,
            ':secure_checkout' => $settings->secureCheckout,
            ':biometric_auth' => $settings->biometricAuth,
            ':created_at' => $settings->createdAt->format('Y-m-d H:i:s'),
            ':updated_at' => $settings->updatedAt->format('Y-m-d H:i:s'),
        ];
    }
}
