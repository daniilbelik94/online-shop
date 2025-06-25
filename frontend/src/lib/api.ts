import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';

// Types
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  parent_id?: number;
  created_at: string;
  updated_at: string;
  children?: Category[];
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  category_id: number;
  category?: Category;
  brand?: string;
  sku: string;
  stock_quantity: number;
  image_url?: string;
  images?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
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

const API_BASE_URL = import.meta.env.VITE_API_URL || (
  // Use relative path for same-domain deployment (Railway)
  window.location.hostname === 'localhost' 
    ? 'http://localhost:8080/api'
    : '/api'
);

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
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
      // Token expired or invalid - logout user
      store.dispatch(logout());
      window.location.href = '/login';
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

export default api; 