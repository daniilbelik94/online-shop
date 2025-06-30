import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, authAPI, adminAPI } from '../lib/api';
import { useToast } from '../components/ToastNotifications';
import type { Product, Category, Order, User } from '../types';

// Query Keys
export const queryKeys = {
  products: ['products'] as const,
  product: (slug: string) => ['product', slug] as const,
  categories: ['categories'] as const,
  cart: ['cart'] as const,
  orders: ['orders'] as const,
  order: (id: string) => ['order', id] as const,
  user: ['user'] as const,
  users: ['users'] as const,
  offers: ['offers'] as const,
};

// Products
export const useProducts = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: string;
}) => {
  console.log('useProducts called with params:', params);
  
  return useQuery({
    queryKey: [...queryKeys.products, params],
    queryFn: async () => {
      console.log('useProducts queryFn executing with params:', params);
      const response = await api.get('/products', { params });
      console.log('useProducts response:', response.data);
      return response.data;
    },
    staleTime: 0, // Немедленно считать устаревшим для отладки
    refetchOnWindowFocus: false, // Не обновлять при фокусе окна
    refetchOnMount: true, // Обновлять при монтировании
    enabled: true, // Всегда включен
    refetchOnReconnect: true, // Обновлять при восстановлении соединения
  });
};

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: queryKeys.product(slug),
    queryFn: async () => {
      const response = await api.get(`/products/${slug}`);
      return response.data;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 минут для деталей продукта
  });
};

// Categories
export const useCategories = () => {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: async () => {
      const response = await api.get('/categories');
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 10 минут для категорий
  });
};

// Cart
export const useCart = () => {
  return useQuery({
    queryKey: queryKeys.cart,
    queryFn: async () => {
      const response = await api.get('/cart');
      return response.data;
    },
    staleTime: 30 * 1000, // 30 секунд для корзины
  });
};

// Orders
export const useOrders = () => {
  return useQuery({
    queryKey: queryKeys.orders,
    queryFn: async () => {
      const response = await api.get('/orders');
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 минуты для заказов
  });
};

export const useOrder = (id: string) => {
  return useQuery({
    queryKey: queryKeys.order(id),
    queryFn: async () => {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 минут для деталей заказа
  });
};

// User
export const useUser = () => {
  return useQuery({
    queryKey: queryKeys.user,
    queryFn: async () => {
      const response = await authAPI.getCurrentUser();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 минут для пользователя
  });
};

// Admin - Users
export const useUsers = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
}) => {
  return useQuery({
    queryKey: [...queryKeys.users, params],
    queryFn: async () => {
      const response = await adminAPI.getUsers(params);
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // 2 минуты для списка пользователей
  });
};

// Mutations
export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  
  return useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      const response = await api.post('/cart/items', { product_id: productId, quantity });
      return response.data;
    },
    onSuccess: () => {
      // Инвалидировать кэш корзины
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      showSuccess('Product added to cart successfully!');
    },
    onError: (error: any) => {
      showError(error?.response?.data?.message || 'Failed to add product to cart');
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  
  return useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      const response = await api.put(`/cart/items/${itemId}`, { quantity });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      showSuccess('Cart updated successfully!');
    },
    onError: (error: any) => {
      showError(error?.response?.data?.message || 'Failed to update cart');
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  
  return useMutation({
    mutationFn: async (itemId: string) => {
      const response = await api.delete(`/cart/items/${itemId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      showSuccess('Product removed from cart');
    },
    onError: (error: any) => {
      showError(error?.response?.data?.message || 'Failed to remove product from cart');
    },
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  
  return useMutation({
    mutationFn: async (orderData: any) => {
      const response = await api.post('/orders', orderData);
      return response.data;
    },
    onSuccess: () => {
      // Инвалидировать кэш заказов и корзины
      queryClient.invalidateQueries({ queryKey: queryKeys.orders });
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
      showSuccess('Order created successfully!');
    },
    onError: (error: any) => {
      showError(error?.response?.data?.message || 'Failed to create order');
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  
  return useMutation({
    mutationFn: async (userData: any) => {
      const response = await authAPI.updateProfile(userData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
      showSuccess('Profile updated successfully!');
    },
    onError: (error: any) => {
      showError(error?.response?.data?.message || 'Failed to update profile');
    },
  });
};

// Admin mutations
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  
  return useMutation({
    mutationFn: async (productData: any) => {
      const response = await adminAPI.createProduct(productData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      showSuccess('Product created successfully!');
    },
    onError: (error: any) => {
      showError(error?.response?.data?.message || 'Failed to create product');
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await adminAPI.updateProduct(id, data);
      return response.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      queryClient.invalidateQueries({ queryKey: queryKeys.product(variables.id) });
      showSuccess('Product updated successfully!');
    },
    onError: (error: any) => {
      showError(error?.response?.data?.message || 'Failed to update product');
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await adminAPI.deleteProduct(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      showSuccess('Product deleted successfully!');
    },
    onError: (error: any) => {
      showError(error?.response?.data?.message || 'Failed to delete product');
    },
  });
}; 