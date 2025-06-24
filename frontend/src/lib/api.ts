import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

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
  
  getProducts: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
  }) => api.get('/admin/products', { params }),
  
  createProduct: (data: any) => api.post('/admin/products', data),
  
  updateProduct: (id: string, data: any) => api.put(`/admin/products/${id}`, data),
  
  getOrders: (params?: {
    page?: number;
    limit?: number;
    status?: string;
    user_id?: string;
  }) => api.get('/admin/orders', { params }),
};

export const publicAPI = {
  getProducts: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    sort?: string;
  }) => api.get('/products', { params }),
  
  getProduct: (slug: string) => api.get(`/products/${slug}`),
  
  getHealth: () => api.get('/health'),
};

export default api; 