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
      // Get addresses from localStorage
      const addresses = localStorage.getItem('user_addresses');
      return addresses ? JSON.parse(addresses) : [];
    } catch (error) {
      console.error('Failed to load addresses:', error);
      return [];
    }
  },

  // Save address
  saveAddress: async (address: any): Promise<any> => {
    try {
      // Generate ID if not provided
      if (!address.id) {
        address.id = Date.now().toString();
      }

      // Get existing addresses
      const existingAddresses = await userProfileApi.getAddresses();
      
      // Update or add address
      const addressIndex = existingAddresses.findIndex(a => a.id === address.id);
      if (addressIndex >= 0) {
        existingAddresses[addressIndex] = address;
      } else {
        existingAddresses.push(address);
      }

      // Save to localStorage
      localStorage.setItem('user_addresses', JSON.stringify(existingAddresses));

      // Also call the backend API for compatibility
      try {
        await api.post('/user/addresses', address);
      } catch (e) {
        console.warn('Backend address save failed, but localStorage succeeded');
      }

      return address;
    } catch (error) {
      console.error('Failed to save address:', error);
      throw error;
    }
  },

  // Get payment methods
  getPaymentMethods: async (): Promise<any[]> => {
    try {
      // Get payment methods from localStorage
      const paymentMethods = localStorage.getItem('user_payment_methods');
      return paymentMethods ? JSON.parse(paymentMethods) : [];
    } catch (error) {
      console.error('Failed to load payment methods:', error);
      return [];
    }
  },

  // Save payment method
  savePaymentMethod: async (paymentMethod: any): Promise<any> => {
    try {
      // Generate ID if not provided
      if (!paymentMethod.id) {
        paymentMethod.id = Date.now().toString();
      }

      // Get existing payment methods
      const existingPaymentMethods = await userProfileApi.getPaymentMethods();
      
      // Update or add payment method
      const paymentMethodIndex = existingPaymentMethods.findIndex(pm => pm.id === paymentMethod.id);
      if (paymentMethodIndex >= 0) {
        existingPaymentMethods[paymentMethodIndex] = paymentMethod;
      } else {
        existingPaymentMethods.push(paymentMethod);
      }

      // Save to localStorage
      localStorage.setItem('user_payment_methods', JSON.stringify(existingPaymentMethods));

      // Also call the backend API for compatibility
      try {
        await api.post('/user/payment-methods', paymentMethod);
      } catch (e) {
        console.warn('Backend payment method save failed, but localStorage succeeded');
      }

      return paymentMethod;
    } catch (error) {
      console.error('Failed to save payment method:', error);
      throw error;
    }
  },

  // Delete address
  deleteAddress: async (addressId: string): Promise<void> => {
    try {
      // Get existing addresses
      const existingAddresses = await userProfileApi.getAddresses();
      
      // Remove address
      const filteredAddresses = existingAddresses.filter(a => a.id !== addressId);
      
      // Save back to localStorage
      localStorage.setItem('user_addresses', JSON.stringify(filteredAddresses));

      // Also call the backend API for compatibility
      try {
        await api.post('/user/addresses/delete', { id: addressId });
      } catch (e) {
        console.warn('Backend address delete failed, but localStorage succeeded');
      }
    } catch (error) {
      console.error('Failed to delete address:', error);
      throw error;
    }
  },

  // Delete payment method
  deletePaymentMethod: async (paymentMethodId: string): Promise<void> => {
    try {
      // Get existing payment methods
      const existingPaymentMethods = await userProfileApi.getPaymentMethods();
      
      // Remove payment method
      const filteredPaymentMethods = existingPaymentMethods.filter(pm => pm.id !== paymentMethodId);
      
      // Save back to localStorage
      localStorage.setItem('user_payment_methods', JSON.stringify(filteredPaymentMethods));

      // Also call the backend API for compatibility
      try {
        await api.post('/user/payment-methods/delete', { id: paymentMethodId });
      } catch (e) {
        console.warn('Backend payment method delete failed, but localStorage succeeded');
      }
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