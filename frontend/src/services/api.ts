export interface Order {
  id: number;
  order_number: string;
  date: string;
  status: string;
  total: number;
  items_count: number;
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