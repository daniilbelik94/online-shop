import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';

// Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  created_at: string;
  updated_at: string;
  children?: Category[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description?: string;
  price: number;
  compare_price?: number;
  category_id: string;
  category?: Category;
  category_name?: string;
  brand?: string;
  sku?: string;
  stock_quantity: number;
  is_in_stock: boolean;
  is_featured: boolean;
  image_url: string;
  images: string[];
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ProductsResponse {
  data: Product[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

export interface ProductStats {
  total_products: number;
  active_products: number;
  out_of_stock: number;
  low_stock: number;
  total_value: number;
}

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  cart_price: number;
  name: string;
  slug: string;
  current_price: number;
  stock_quantity: number;
  is_active: boolean;
  image_url?: string;
  total: number;
}

export interface Cart {
  items: CartItem[];
  total: number;
  count: number;
  cart_id: string;
}

// Simplified API base URL - only localhost for development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Export the api instance
export { api };

// Session ID management
let sessionId: string | null = null;

const getSessionId = (): string => {
  if (!sessionId) {
    // Try to get from localStorage first
    sessionId = localStorage.getItem('cart_session_id');
    
    if (!sessionId) {
      // Generate new session ID
      sessionId = Array.from(crypto.getRandomValues(new Uint8Array(16)), 
        b => b.toString(16).padStart(2, '0')).join('');
      localStorage.setItem('cart_session_id', sessionId);
    }
  }
  return sessionId;
};

// Request interceptor to add auth token and session ID
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add session ID header for cart operations
    const currentSessionId = getSessionId();
    config.headers['X-Session-ID'] = currentSessionId;
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      const message = error.response?.data?.error || '';
      const isTokenProblem = /invalid|expired token/i.test(message);

      if (isTokenProblem) {
        // Truly invalid token → force logout
        store.dispatch(logout());
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      // For other 401s (e.g., "Authentication required") just propagate error
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

// API methods
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (userData: {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
  }) => api.post('/users', userData),
  
  getCurrentUser: () => api.get('/user/me'),
  
  updateProfile: (data: {
    first_name?: string;
    last_name?: string;
    phone?: string;
  }) => api.put('/user/me', data),
  
  changePassword: (data: {
    current_password: string;
    new_password: string;
  }) => api.post('/user/change-password', data),
};

export const adminAPI = {
  getUsers: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
  }) => api.get('/admin/users', { params }),
  
  updateUser: (id: string, data: {
    first_name?: string;
    last_name?: string;
    role?: string;
    is_active?: boolean;
    is_staff?: boolean;
  }) => api.put(`/admin/users/${id}`, data),
  
  // Product management
  getProducts: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    brand?: string;
    min_price?: number;
    max_price?: number;
    sort?: string;
  }) => api.get('/admin/products', { params }),
  
  createProduct: (data: {
    name: string;
    description: string;
    price: number;
    category_id: number;
    brand?: string;
    stock_quantity: number;
    sku?: string;
    image_url?: string;
    images?: string[];
  }) => api.post('/admin/products', data),
  
  updateProduct: (id: string, data: {
    name?: string;
    description?: string;
    price?: number;
    category_id?: number;
    brand?: string;
    stock_quantity?: number;
    sku?: string;
    image_url?: string;
    images?: string[];
  }) => api.put(`/admin/products/${id}`, data),
  
  deleteProduct: (id: string) => api.delete(`/admin/products/${id}`),
  
  getProductStats: () => api.get('/admin/products/stats'),
  
  getLowStockProducts: (threshold?: number) => 
    api.get('/admin/products/low-stock', { params: { threshold } }),
  
  // Categories (use public endpoint for now)
  getCategories: () => api.get('/categories'),
  
  getOrders: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    user_id?: string;
  }) => api.get('/admin/orders', { params }),

  getOrderStatistics: () => api.get('/admin/orders/statistics'),
  
  updateOrderStatus: (orderId: string, status: string) =>
    api.put(`/admin/orders/${orderId}/status`, { status }),
  
  updatePaymentStatus: (orderId: string, payment_status: string) =>
    api.put(`/admin/orders/${orderId}/payment-status`, { payment_status }),
};

export const publicAPI = {
  // Product catalog
  getProducts: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    brand?: string;
    min_price?: number;
    max_price?: number;
    sort?: string;
  }) => api.get('/products', { params }),
  
  searchProducts: (query: string, params?: {
    page?: number;
    limit?: number;
  }) => api.get('/products/search', { params: { q: query, ...params } }),
  
  getRecommendedProducts: (limit?: number) => 
    api.get('/products/recommended', { params: { limit } }),
  
  getFeaturedProducts: (limit?: number) => 
    api.get('/products/featured', { params: { limit } }),
  
  getProduct: (slug: string) => api.get(`/products/${slug}`),
  
  // Categories
  getCategories: () => api.get('/categories'),
  
  getHealth: () => api.get('/health'),
};

// Cart API
export const cartAPI = {
  getCart: () => api.get('/cart'),
  
  addToCart: (productId: string, quantity: number = 1) =>
    api.post('/cart/add', { product_id: productId, quantity }),
  
  updateCartItem: (itemId: string, quantity: number) =>
    api.put('/cart/update', { item_id: itemId, quantity }),
  
  removeFromCart: (itemId: string) =>
    api.delete('/cart/remove', { data: { item_id: itemId } }),
  
  clearCart: () => api.delete('/cart/clear'),
  
  mergeGuestCart: () => api.post('/cart/merge'),
};

// Orders API
export const ordersAPI = {
  getOrders: () => api.get('/orders'),
  
  getOrderById: (orderId: string) => api.get(`/orders/${orderId}`),
  
  createOrder: (orderData: {
    items: Array<{
      product_id: string;
      quantity: number;
      price: number;
    }>;
    shipping_address: {
      name: string;
      street: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
    billing_address?: {
      name: string;
      street: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
    payment_method: string;
    shipping_method: string;
    customer_notes?: string;
  }) => api.post('/orders', orderData),
  
  cancelOrder: (orderId: string) => api.post(`/orders/${orderId}/cancel`),
};

// Wishlist API
export const wishlistAPI = {
  getWishlist: () => api.get('/user/wishlist'),
  
  addToWishlist: (productId: string | number) =>
    api.post('/user/wishlist', { product_id: productId }),
  
  removeFromWishlist: (productId: string | number) =>
    api.delete(`/user/wishlist/${productId}`),
  
  clearWishlist: () => api.delete('/user/wishlist'),
};

// Image upload API
export const imageAPI = {
  uploadSingle: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/admin/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  uploadMultiple: (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images[]', file);
    });
    return api.post('/admin/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  deleteImage: (imageUrl: string) =>
    api.delete('/admin/delete/image', { data: { image_url: imageUrl } }),
};

export default api; 