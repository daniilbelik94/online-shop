// User types
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  created_at?: string;
  role?: string;
}

// Product types
export interface Product {
  id: number;
  name: string;
  description: string;
  short_description?: string;
  price: number;
  compare_price?: number;
  category_id: number;
  category_name?: string;
  brand?: string;
  stock_quantity: number;
  is_in_stock: boolean;
  is_featured: boolean;
  sku?: string;
  slug: string;
  image_url: string;
  images: string[];
  created_at?: string;
  updated_at?: string;
}

// Category types
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent_id?: number;
  created_at?: string;
  updated_at?: string;
}

// Cart types
export interface CartItem {
  id: number;
  product_id: number;
  product: Product;
  quantity: number;
  price: number;
}

// Order types
export interface Order {
  id: number;
  order_number: string;
  date: string;
  status: string;
  total: number;
  items_count: number;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product: Product;
  quantity: number;
  price: number;
}

// API Request/Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface UpdateProfileData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
}

// Admin types
export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  brand?: string;
  min_price?: number;
  max_price?: number;
  sort?: string;
}

export interface OrderFilters {
  page?: number;
  limit?: number;
  status?: string;
  user_id?: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  short_description?: string;
  price: number;
  compare_price?: number;
  category_id: number;
  brand?: string;
  stock_quantity: number;
  sku?: string;
  image_url?: string;
  images?: string[];
  is_featured?: boolean;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  id: number;
} 