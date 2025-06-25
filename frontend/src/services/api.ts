import { api } from '../lib/api';
import type { User, Order, UpdateProfileData, ChangePasswordData } from '../types';

// User Profile API
export const userProfileApi = {
  // Get current user profile
  getProfile: async (): Promise<User> => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: UpdateProfileData): Promise<User> => {
    const response = await api.put('/user/profile', data);
    return response.data;
  },

  // Change password
  changePassword: async (data: ChangePasswordData): Promise<void> => {
    await api.post('/user/change-password', data);
  },

  // Get user orders
  getOrders: async (): Promise<Order[]> => {
    const response = await api.get('/user/orders');
    return response.data;
  },
}; 