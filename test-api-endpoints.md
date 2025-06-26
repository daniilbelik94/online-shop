# API Endpoints to Implement

## 🎯 New Features That Need Backend Implementation

### 1. **Enhanced Order Management**

- `GET /api/orders/{id}` - Get detailed order information with all fields
- `POST /api/orders/{id}/cancel` - Cancel an order
- `POST /api/orders/{id}/return` - Initiate order return
- `GET /api/orders/{id}/tracking` - Get tracking information

**Required Order Fields:**

```json
{
  "id": "uuid",
  "order_number": "ORD-2025-123456",
  "status": "pending|processing|shipped|delivered|cancelled",
  "payment_status": "pending|paid|failed|refunded",
  "payment_method": "paypal|credit_card|bank_transfer",
  "shipping_method": "standard|express|overnight",
  "tracking_number": "string",
  "transaction_id": "string",
  "can_be_cancelled": boolean,
  "shipped_at": "datetime",
  "delivered_at": "datetime",
  "billing_address": "string",
  "shipping_address": "string",
  "customer_notes": "string",
  "payment_notes": "string",
  "subtotal": number,
  "tax_amount": number,
  "shipping_cost": number,
  "discount_amount": number,
  "total": number,
  "items": [
    {
      "product_id": "uuid",
      "product_name": "string",
      "product_image": "url",
      "quantity": number,
      "price": number
    }
  ]
}
```

### 2. **User Settings & Preferences**

- `GET /api/user/settings` - Get user settings
- `PUT /api/user/settings` - Update user settings
- `GET /api/user/devices` - Get active devices
- `DELETE /api/user/devices/{id}` - Revoke device access
- `POST /api/user/export-data` - Request data export
- `POST /api/user/delete-account` - Delete account request

**Settings Structure:**

```json
{
  "notifications": {
    "email_marketing": boolean,
    "order_updates": boolean,
    "security_alerts": boolean,
    "price_drops": boolean,
    "back_in_stock": boolean,
    "newsletter": boolean,
    "sms_notifications": boolean,
    "push_notifications": boolean
  },
  "privacy": {
    "profile_visibility": "public|friends|private",
    "show_online_status": boolean,
    "share_wishlist": boolean,
    "allow_recommendations": boolean,
    "cookies_analytics": boolean,
    "cookies_marketing": boolean,
    "data_sharing": boolean
  },
  "appearance": {
    "theme": "light|dark|auto",
    "language": "en|es|fr|de|it",
    "currency": "USD|EUR|GBP|CAD",
    "timezone": "string",
    "compact_mode": boolean,
    "animations": boolean,
    "high_contrast": boolean
  },
  "shopping": {
    "save_for_later": boolean,
    "auto_add_to_wishlist": boolean,
    "one_click_buy": boolean,
    "remember_payment": boolean,
    "default_shipping": "standard|express|overnight",
    "auto_apply_discounts": boolean
  },
  "security": {
    "two_factor_enabled": boolean,
    "login_alerts": boolean,
    "password_expiry": number,
    "secure_checkout": boolean,
    "biometric_auth": boolean
  }
}
```

### 3. **Enhanced Wishlist**

- `GET /api/user/wishlist` - Get user wishlist ✅ (exists)
- `POST /api/user/wishlist` - Add item to wishlist ✅ (exists)
- `DELETE /api/user/wishlist/{productId}` - Remove item ✅ (exists)
- `POST /api/user/wishlist/bulk` - Bulk add/remove items

### 4. **Product Reviews & Ratings**

- `GET /api/products/{id}/reviews` - Get product reviews
- `POST /api/products/{id}/reviews` - Add review
- `PUT /api/products/{id}/reviews/{reviewId}` - Update review
- `DELETE /api/products/{id}/reviews/{reviewId}` - Delete review

**Review Structure:**

```json
{
  "id": "uuid",
  "user_id": "uuid",
  "product_id": "uuid",
  "rating": 1-5,
  "title": "string",
  "comment": "string",
  "verified_purchase": boolean,
  "helpful_count": number,
  "created_at": "datetime",
  "user": {
    "name": "string",
    "avatar": "url"
  }
}
```

### 5. **User Profile Statistics**

- `GET /api/user/statistics` - Get user statistics

**Statistics Structure:**

```json
{
  "total_orders": number,
  "total_spent": number,
  "average_order_value": number,
  "loyalty_points": number,
  "membership_level": "Bronze|Silver|Gold|Platinum",
  "next_level_progress": number,
  "favorite_categories": ["string"],
  "last_order_date": "datetime",
  "member_since": "datetime"
}
```

### 6. **Enhanced Product Data**

- Products should include:
  - `short_description` field
  - `rating` and `review_count`
  - `is_low_stock` calculated field
  - `free_shipping` calculated field (price >= 50)

### 7. **Address Management**

- `GET /api/user/addresses` - Get user addresses ✅ (exists)
- `POST /api/user/addresses` - Add address ✅ (exists)
- `PUT /api/user/addresses/{id}` - Update address
- `DELETE /api/user/addresses/{id}` - Delete address ✅ (exists)
- `POST /api/user/addresses/{id}/set-default` - Set default address

### 8. **Notification System**

- `GET /api/user/notifications` - Get notifications
- `POST /api/user/notifications/{id}/read` - Mark as read
- `POST /api/user/notifications/mark-all-read` - Mark all as read

### 9. **Quick Actions**

- `POST /api/products/compare` - Add to comparison
- `GET /api/products/compare` - Get comparison list
- `DELETE /api/products/compare/{id}` - Remove from comparison

## 🔧 Implementation Priority

### High Priority (Implement First)

1. Enhanced order details with all fields
2. Order actions (cancel, return, tracking)
3. User settings CRUD operations
4. Product reviews and ratings
5. User statistics calculation

### Medium Priority

1. Device management
2. Notification system
3. Address management enhancements
4. Data export functionality

### Low Priority

1. Product comparison
2. Advanced analytics
3. Two-factor authentication
4. Biometric authentication

## 📋 Testing Checklist

### Order Management

- [ ] View detailed order information
- [ ] Cancel pending orders
- [ ] Request returns for delivered orders
- [ ] Track shipment status
- [ ] Download order receipts

### User Settings

- [ ] Update notification preferences
- [ ] Change privacy settings
- [ ] Modify appearance preferences
- [ ] Configure shopping preferences
- [ ] Manage security settings

### Wishlist Integration

- [ ] Add items to wishlist from product cards
- [ ] Remove items from wishlist
- [ ] View wishlist in profile
- [ ] Add wishlist items to cart

### Profile Statistics

- [ ] Display accurate order count
- [ ] Show correct total spending
- [ ] Calculate membership level
- [ ] Update loyalty points

## 🚀 API Response Examples

### Enhanced Order Response

```json
{
  "success": true,
  "data": {
    "id": "853b142d-a4fe-4428-85ac-d8b4c81cc65b",
    "order_number": "ORD-2025-251446",
    "status": "pending",
    "payment_status": "pending",
    "payment_method": "paypal",
    "tracking_number": null,
    "can_be_cancelled": true,
    "total": 162.75,
    "items": [
      {
        "product_id": "123",
        "product_name": "iPhone 15 Pro",
        "product_image": "https://example.com/image.jpg",
        "quantity": 1,
        "price": 150.0
      }
    ]
  }
}
```

### User Settings Response

```json
{
  "success": true,
  "data": {
    "notifications": {
      "email_marketing": true,
      "order_updates": true,
      "security_alerts": true
    },
    "privacy": {
      "profile_visibility": "private",
      "share_wishlist": false
    }
  }
}
```
