// Unified calculation functions for cart and checkout
export interface CartCalculations {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface ShippingOption {
  id: string;
  label: string;
  cost: number;
  icon?: any;
  description?: string;
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  minAmount?: number;
}

// Available shipping options
export const SHIPPING_OPTIONS: ShippingOption[] = [
  { 
    id: 'standard', 
    label: 'Standard Shipping (5-7 days)', 
    cost: 0,
    description: 'Free shipping on all orders'
  },
  { 
    id: 'express', 
    label: 'Express Shipping (2-3 days)', 
    cost: 15.99,
    description: 'Fast delivery'
  },
  { 
    id: 'overnight', 
    label: 'Overnight Shipping (1 day)', 
    cost: 29.99,
    description: 'Next day delivery'
  },
];

// Valid promo codes
export const VALID_PROMO_CODES: Record<string, PromoCode> = {
  'SAVE10': { code: 'SAVE10', discountPercent: 10 },
  'WELCOME20': { code: 'WELCOME20', discountPercent: 20, minAmount: 50 },
  'STUDENT15': { code: 'STUDENT15', discountPercent: 15 },
  'FIRST50': { code: 'FIRST50', discountPercent: 50, minAmount: 100 },
  'FLASH25': { code: 'FLASH25', discountPercent: 25 },
};

// Tax rate (8%)
export const TAX_RATE = 0.08;

// Free shipping threshold (removed - now shipping is always paid according to selected option)
export const FREE_SHIPPING_THRESHOLD = 0;

export function calculateSubtotal(cartTotal: number): number {
  return cartTotal;
}

export function calculateDiscount(subtotal: number, promoCode?: string): number {
  if (!promoCode || !VALID_PROMO_CODES[promoCode]) {
    return 0;
  }

  const promo = VALID_PROMO_CODES[promoCode];
  
  // Check minimum amount requirement
  if (promo.minAmount && subtotal < promo.minAmount) {
    return 0;
  }

  return (subtotal * promo.discountPercent) / 100;
}

export function calculateShipping(subtotal: number, shippingMethodId: string = 'standard'): number {
  const shippingOption = SHIPPING_OPTIONS.find(option => option.id === shippingMethodId);
  return shippingOption ? shippingOption.cost : 0;
}

export function calculateTax(subtotal: number, discount: number): number {
  // Tax is calculated on subtotal after discount
  const taxableAmount = subtotal - discount;
  return Math.max(0, taxableAmount * TAX_RATE);
}

export function calculateTotal(subtotal: number, discount: number, shipping: number, tax: number): number {
  return subtotal - discount + shipping + tax;
}

export function calculateCartTotals(
  cartTotal: number,
  promoCode?: string,
  shippingMethodId: string = 'standard'
): CartCalculations {
  const subtotal = calculateSubtotal(cartTotal);
  const discount = calculateDiscount(subtotal, promoCode);
  const shipping = calculateShipping(subtotal, shippingMethodId);
  const tax = calculateTax(subtotal, discount);
  const total = calculateTotal(subtotal, discount, shipping, tax);

  return {
    subtotal,
    discount,
    shipping,
    tax,
    total,
  };
}

export function validatePromoCode(code: string, subtotal: number): { 
  valid: boolean; 
  error?: string; 
  discount?: number;
} {
  if (!code.trim()) {
    return { valid: false, error: 'Please enter a promo code' };
  }

  const upperCode = code.toUpperCase();
  const promo = VALID_PROMO_CODES[upperCode];

  if (!promo) {
    return { valid: false, error: 'Invalid promo code' };
  }

  if (promo.minAmount && subtotal < promo.minAmount) {
    return { 
      valid: false, 
      error: `Minimum order amount of $${promo.minAmount} required for this promo code` 
    };
  }

  const discount = calculateDiscount(subtotal, upperCode);
  return { valid: true, discount };
}

export function formatPrice(price: number | string | null | undefined): string {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (typeof numericPrice !== 'number' || isNaN(numericPrice)) {
    return '$0.00';
  }
  
  return `$${numericPrice.toFixed(2)}`;
}

export function getShippingOptionById(id: string): ShippingOption | undefined {
  return SHIPPING_OPTIONS.find(option => option.id === id);
} 