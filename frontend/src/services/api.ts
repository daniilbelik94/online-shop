import { api, authAPI, ordersAPI } from '../lib/api';
import type { User, Order, UpdateProfileData, ChangePasswordData } from '../types';

// User Profile API
export const userProfileApi = {
  // Get current user profile
  getProfile: async (): Promise<User> => {
    const response = await authAPI.getCurrentUser();
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: UpdateProfileData): Promise<User> => {
    const response = await authAPI.updateProfile(data);
    return response.data;
  },

  // Change password
  changePassword: async (data: ChangePasswordData): Promise<void> => {
    await authAPI.changePassword({
      current_password: data.current_password,
      new_password: data.new_password
    });
  },

  // Get user orders
  getOrders: async (): Promise<Order[]> => {
    try {
      const response = await ordersAPI.getOrders();
      console.log('Orders API response:', response.data);
      
      // Handle different response formats from backend
      let orders = response.data?.data?.data || response.data?.data || response.data?.orders || response.data || [];
      
      // Ensure we have an array
      if (!Array.isArray(orders)) {
        orders = [];
      }
      
      console.log('Parsed orders:', orders);
      return orders;
    } catch (error) {
      console.error('Failed to load orders:', error);
      throw error;
    }
  },

  // Get order details by ID
  getOrderById: async (orderId: string): Promise<Order> => {
    try {
      const response = await ordersAPI.getOrderById(orderId);
      console.log('Order API response:', response.data);
      
      // Handle different response formats from backend
      const order = response.data?.order || response.data?.data?.order || response.data?.data || response.data;
      console.log('Parsed order:', order);
      
      if (!order || !order.id) {
        throw new Error('Order not found');
      }
      
      return order;
    } catch (error) {
      console.error('Failed to load order:', error);
      throw error;
    }
  },

  // Get order details (legacy method)
  getOrderDetails: async (orderId: string): Promise<Order> => {
    return userProfileApi.getOrderById(orderId);
  },

  // Get user addresses
  getAddresses: async (): Promise<any[]> => {
    try {
      const response = await api.get('/user/addresses');
      return response.data?.data?.addresses || response.data?.addresses || [];
    } catch (error) {
      console.error('Failed to load addresses:', error);
      // Return empty array instead of mock data
      return [];
    }
  },

  // Save address
  saveAddress: async (address: any): Promise<any> => {
    try {
      const response = await api.post('/user/addresses', address);
      return response.data?.data?.address || response.data?.address || response.data;
    } catch (error) {
      console.error('Failed to save address:', error);
      throw error;
    }
  },

  // Get payment methods
  getPaymentMethods: async (): Promise<any[]> => {
    try {
      const response = await api.get('/user/payment-methods');
      return response.data?.data?.payment_methods || response.data?.payment_methods || [];
    } catch (error) {
      console.error('Failed to load payment methods:', error);
      // Return empty array instead of mock data
      return [];
    }
  },

  // Save payment method
  savePaymentMethod: async (paymentMethod: any): Promise<any> => {
    try {
      const response = await api.post('/user/payment-methods', paymentMethod);
      return response.data?.data?.payment_method || response.data?.payment_method || response.data;
    } catch (error) {
      console.error('Failed to save payment method:', error);
      throw error;
    }
  },

  // Delete address
  deleteAddress: async (addressId: string): Promise<void> => {
    try {
      await api.post('/user/addresses/delete', { id: addressId });
    } catch (error) {
      console.error('Failed to delete address:', error);
      throw error;
    }
  },

  // Delete payment method
  deletePaymentMethod: async (paymentMethodId: string): Promise<void> => {
    try {
      await api.post('/user/payment-methods/delete', { id: paymentMethodId });
    } catch (error) {
      console.error('Failed to delete payment method:', error);
      throw error;
    }
  },

  // Create order
  createOrder: async (orderData: {
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
  }): Promise<Order> => {
    try {
      const response = await ordersAPI.createOrder(orderData);
      return response.data?.order || response.data?.data || response.data;
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    }
  },

  // Cancel order
  cancelOrder: async (orderId: string): Promise<void> => {
    try {
      await ordersAPI.cancelOrder(orderId);
    } catch (error) {
      console.error('Failed to cancel order:', error);
      throw error;
    }
  },

  // Initiate return
  initiateReturn: async (orderId: string): Promise<void> => {
    try {
      await api.post(`/orders/${orderId}/return`);
    } catch (error) {
      console.error('Failed to initiate return:', error);
      throw error;
    }
  },
}; 