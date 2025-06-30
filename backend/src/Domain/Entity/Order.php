<?php

namespace App\Domain\Entity;

class Order
{
    private ?string $id = null;
    private string $orderNumber;
    private string $userId;
    private string $status = 'pending';
    private float $totalAmount;
    private ?string $shippingAddress = null;
    private ?string $billingAddress = null;
    private ?string $customerNotes = null;
    private string $paymentMethod = 'pending';
    private string $paymentStatus = 'pending';
    private ?string $shippingMethod = null;
    private ?float $shippingCost = null;
    private ?float $taxAmount = null;
    private ?float $discountAmount = null;
    private ?float $subtotal = null;
    private ?string $trackingNumber = null;
    private ?string $transactionId = null;
    private ?string $paymentNotes = null;
    private array $items = [];
    private \DateTimeImmutable $createdAt;
    private \DateTimeImmutable $updatedAt;
    private ?\DateTimeImmutable $shippedAt = null;
    private ?\DateTimeImmutable $deliveredAt = null;
    private ?\DateTimeImmutable $cancelledAt = null;
    private ?\DateTimeImmutable $returnRequestedAt = null;
    private ?\DateTimeImmutable $returnCompletedAt = null;
    private array $applicableCategories = [];

    // Order statuses
    public const STATUS_PENDING = 'pending';
    public const STATUS_PROCESSING = 'processing';
    public const STATUS_SHIPPED = 'shipped';
    public const STATUS_DELIVERED = 'delivered';
    public const STATUS_CANCELLED = 'cancelled';
    public const STATUS_RETURNED = 'returned';

    // Payment statuses
    public const PAYMENT_PENDING = 'pending';
    public const PAYMENT_PAID = 'paid';
    public const PAYMENT_FAILED = 'failed';
    public const PAYMENT_REFUNDED = 'refunded';
    public const PAYMENT_PARTIALLY_REFUNDED = 'partially_refunded';

    public function __construct(
        string $orderNumber,
        string $userId,
        float $totalAmount,
        string $shippingAddress,
        string $billingAddress
    ) {
        $this->orderNumber = $orderNumber;
        $this->userId = $userId;
        $this->totalAmount = $totalAmount;
        $this->shippingAddress = $shippingAddress;
        $this->billingAddress = $billingAddress;
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
    }

    // Getters
    public function getId(): ?string
    {
        return $this->id;
    }

    public function getOrderNumber(): string
    {
        return $this->orderNumber;
    }

    public function getUserId(): string
    {
        return $this->userId;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function getTotalAmount(): float
    {
        return $this->totalAmount;
    }

    public function getShippingAddress(): ?string
    {
        return $this->shippingAddress;
    }

    public function getBillingAddress(): ?string
    {
        return $this->billingAddress;
    }

    public function getCustomerNotes(): ?string
    {
        return $this->customerNotes;
    }

    public function getPaymentMethod(): string
    {
        return $this->paymentMethod;
    }

    public function getPaymentStatus(): string
    {
        return $this->paymentStatus;
    }

    public function getShippingMethod(): ?string
    {
        return $this->shippingMethod;
    }

    public function getShippingCost(): ?float
    {
        return $this->shippingCost;
    }

    public function getTaxAmount(): ?float
    {
        return $this->taxAmount;
    }

    public function getDiscountAmount(): ?float
    {
        return $this->discountAmount;
    }

    public function getItems(): array
    {
        return $this->items;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): \DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function getShippedAt(): ?\DateTimeImmutable
    {
        return $this->shippedAt;
    }

    public function getDeliveredAt(): ?\DateTimeImmutable
    {
        return $this->deliveredAt;
    }

    public function getSubtotal(): ?float
    {
        return $this->subtotal;
    }

    public function getTrackingNumber(): ?string
    {
        return $this->trackingNumber;
    }

    public function getTransactionId(): ?string
    {
        return $this->transactionId;
    }

    public function getPaymentNotes(): ?string
    {
        return $this->paymentNotes;
    }

    public function getCancelledAt(): ?\DateTimeImmutable
    {
        return $this->cancelledAt;
    }

    public function getReturnRequestedAt(): ?\DateTimeImmutable
    {
        return $this->returnRequestedAt;
    }

    public function getReturnCompletedAt(): ?\DateTimeImmutable
    {
        return $this->returnCompletedAt;
    }

    // Setters
    public function setId(string $id): void
    {
        $this->id = $id;
    }

    public function setItems(array $items): void
    {
        $this->items = $items;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function updateStatus(string $status): void
    {
        if (!in_array($status, [
            self::STATUS_PENDING,
            self::STATUS_PROCESSING,
            self::STATUS_SHIPPED,
            self::STATUS_DELIVERED,
            self::STATUS_CANCELLED,
            self::STATUS_RETURNED
        ])) {
            throw new \InvalidArgumentException('Invalid order status');
        }

        $this->status = $status;
        $this->updatedAt = new \DateTimeImmutable();

        // Set timestamp for status changes
        if ($status === self::STATUS_SHIPPED && !$this->shippedAt) {
            $this->shippedAt = new \DateTimeImmutable();
        } elseif ($status === self::STATUS_DELIVERED && !$this->deliveredAt) {
            $this->deliveredAt = new \DateTimeImmutable();
        }
    }

    public function updatePaymentStatus(string $paymentStatus): void
    {
        if (!in_array($paymentStatus, [
            self::PAYMENT_PENDING,
            self::PAYMENT_PAID,
            self::PAYMENT_FAILED,
            self::PAYMENT_REFUNDED,
            self::PAYMENT_PARTIALLY_REFUNDED
        ])) {
            throw new \InvalidArgumentException('Invalid payment status');
        }

        $this->paymentStatus = $paymentStatus;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function setPaymentMethod(string $paymentMethod): void
    {
        $this->paymentMethod = $paymentMethod;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function setShippingDetails(?string $shippingMethod = null, ?float $shippingCost = null): void
    {
        $this->shippingMethod = $shippingMethod;
        $this->shippingCost = $shippingCost;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function setTaxAmount(?float $taxAmount): void
    {
        $this->taxAmount = $taxAmount;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function setDiscountAmount(?float $discountAmount): void
    {
        $this->discountAmount = $discountAmount;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function setCustomerNotes(?string $customerNotes): void
    {
        $this->customerNotes = $customerNotes;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function updateAddresses(?string $shippingAddress = null, ?string $billingAddress = null): void
    {
        if ($shippingAddress !== null) {
            $this->shippingAddress = $shippingAddress;
        }
        if ($billingAddress !== null) {
            $this->billingAddress = $billingAddress;
        }
        $this->updatedAt = new \DateTimeImmutable();
    }

    // Business logic methods
    public function canBeCancelled(): bool
    {
        return in_array($this->status, [self::STATUS_PENDING, self::STATUS_PROCESSING]);
    }

    public function canBeShipped(): bool
    {
        return $this->status === self::STATUS_PROCESSING && $this->paymentStatus === self::PAYMENT_PAID;
    }

    public function canBeDelivered(): bool
    {
        return $this->status === self::STATUS_SHIPPED;
    }

    public function canBeRefunded(): bool
    {
        return $this->paymentStatus === self::PAYMENT_PAID;
    }

    public function isPaid(): bool
    {
        return $this->paymentStatus === self::PAYMENT_PAID;
    }

    public function isCancellable(): bool
    {
        return $this->canBeCancelled();
    }

    public function calculateSubtotal(): float
    {
        $subtotal = 0.0;
        foreach ($this->items as $item) {
            $subtotal += $item['price'] * $item['quantity'];
        }
        return $subtotal;
    }

    public function getItemsCount(): int
    {
        $count = 0;
        foreach ($this->items as $item) {
            $count += $item['quantity'];
        }
        return $count;
    }

    // New setters for enhanced fields
    public function setSubtotal(?float $subtotal): void
    {
        $this->subtotal = $subtotal;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function setTrackingNumber(?string $trackingNumber): void
    {
        $this->trackingNumber = $trackingNumber;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function setTransactionId(?string $transactionId): void
    {
        $this->transactionId = $transactionId;
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function setPaymentNotes(?string $paymentNotes): void
    {
        $this->paymentNotes = $paymentNotes;
        $this->updatedAt = new \DateTimeImmutable();
    }

    // Enhanced business logic methods
    public function cancel(): void
    {
        if (!$this->canBeCancelled()) {
            throw new \RuntimeException('Order cannot be cancelled in current status');
        }

        $this->status = self::STATUS_CANCELLED;
        $this->cancelledAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function requestReturn(): void
    {
        if ($this->status !== self::STATUS_DELIVERED) {
            throw new \RuntimeException('Only delivered orders can be returned');
        }

        $this->returnRequestedAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function completeReturn(): void
    {
        if (!$this->returnRequestedAt) {
            throw new \RuntimeException('Return must be requested first');
        }

        $this->status = self::STATUS_RETURNED;
        $this->returnCompletedAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
    }

    public function canBeReturned(): bool
    {
        return $this->status === self::STATUS_DELIVERED &&
            $this->deliveredAt &&
            $this->deliveredAt->diff(new \DateTimeImmutable())->days <= 30; // 30 days return policy
    }

    public function isReturnable(): bool
    {
        return $this->canBeReturned();
    }

    // Convert to array for API responses
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->orderNumber,
            'user_id' => $this->userId,
            'status' => $this->status,
            'payment_status' => $this->paymentStatus,
            'payment_method' => $this->paymentMethod,
            'shipping_method' => $this->shippingMethod,
            'tracking_number' => $this->trackingNumber,
            'transaction_id' => $this->transactionId,
            'subtotal' => $this->subtotal ?? $this->calculateSubtotal(),
            'tax_amount' => $this->taxAmount,
            'shipping_cost' => $this->shippingCost,
            'discount_amount' => $this->discountAmount,
            'total_amount' => $this->totalAmount,
            'shipping_address' => $this->shippingAddress,
            'billing_address' => $this->billingAddress,
            'customer_notes' => $this->customerNotes,
            'payment_notes' => $this->paymentNotes,
            'can_be_cancelled' => $this->canBeCancelled(),
            'can_be_returned' => $this->canBeReturned(),
            'items' => $this->items,
            'created_at' => $this->createdAt->format('Y-m-d H:i:s'),
            'updated_at' => $this->updatedAt->format('Y-m-d H:i:s'),
            'shipped_at' => $this->shippedAt?->format('Y-m-d H:i:s'),
            'delivered_at' => $this->deliveredAt?->format('Y-m-d H:i:s'),
            'cancelled_at' => $this->cancelledAt?->format('Y-m-d H:i:s'),
            'return_requested_at' => $this->returnRequestedAt?->format('Y-m-d H:i:s'),
            'return_completed_at' => $this->returnCompletedAt?->format('Y-m-d H:i:s'),
        ];
    }
}
