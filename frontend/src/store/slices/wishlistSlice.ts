import { createSlice, createAsyncThunk, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { wishlistAPI } from '../../lib/api';
import type { WishlistItem, WishlistState, Product } from '../../types';
import { addNotification } from './notificationSlice';

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await wishlistAPI.getWishlist();
      const data = response.data?.data || response.data || [];
      return Array.isArray(data) ? data : [];
    } catch (error: any) {
      // If it's an authentication error, return empty array instead of rejecting
      if (error.response?.status === 401) {
        return [];
      }
      return rejectWithValue(error.response?.data?.error || error.message || 'Failed to fetch wishlist');
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId: string | number, { rejectWithValue, dispatch }) => {
    try {
      const response = await wishlistAPI.addToWishlist(productId);
      
      // Backend returns wishlist item, we need to fetch updated wishlist
      // or get product details and create the wishlist item
      
      // For now, trigger a refresh of the entire wishlist
      const wishlistResponse = await wishlistAPI.getWishlist();
      const wishlistData = wishlistResponse.data?.data || wishlistResponse.data || [];
      const safeWishlistData = Array.isArray(wishlistData) ? wishlistData : [];
      
      // Find the newly added item
      const newItem = safeWishlistData.find((item: any) => 
        (item.product_id || item.product?.id) === productId.toString()
      );
      
      // Dispatch success notification
      dispatch(addNotification({
        message: `Added "${newItem?.product?.name || 'Product'}" to wishlist!`,
        severity: 'success',
        duration: 3000,
      }));
      
      return { wishlistData: safeWishlistData, newItem };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to add to wishlist';
      
      // Dispatch error notification
      dispatch(addNotification({
        message: errorMessage,
        severity: 'error',
        duration: 5000,
      }));
      
      return rejectWithValue(errorMessage);
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId: string | number, { rejectWithValue, dispatch, getState }) => {
    try {
      // Get product name before removing
      const state = getState() as any;
      const items = Array.isArray(state.wishlist.items) ? state.wishlist.items : [];
      const item = items.find((item: WishlistItem) => 
        item.product_id === productId.toString()
      );
      const productName = item?.product?.name || 'Product';
      
      await wishlistAPI.removeFromWishlist(productId);
      
      // Dispatch success notification
      dispatch(addNotification({
        message: `Removed "${productName}" from wishlist`,
        severity: 'info',
        duration: 3000,
      }));
      
      return productId;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to remove from wishlist';
      
      // Dispatch error notification
      dispatch(addNotification({
        message: errorMessage,
        severity: 'error',
        duration: 5000,
      }));
      
      return rejectWithValue(errorMessage);
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearWishlist: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action: PayloadAction<WishlistItem[]>) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.items = [];
        state.error = action.error.message || 'Failed to fetch wishlist';
      })
      
      // Add to wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action: PayloadAction<{ wishlistData: WishlistItem[], newItem?: WishlistItem }>) => {
        state.loading = false;
        state.items = Array.isArray(action.payload.wishlistData) ? action.payload.wishlistData : [];
        state.error = null;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add to wishlist';
      })
      
      // Remove from wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action: PayloadAction<string | number>) => {
        state.loading = false;
        if (Array.isArray(state.items)) {
          state.items = state.items.filter(item => item.product_id !== action.payload.toString());
        } else {
          state.items = [];
        }
        state.error = null;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to remove from wishlist';
      });
  },
});

export const { clearError, clearWishlist } = wishlistSlice.actions;

// Basic selectors
export const selectWishlistState = (state: { wishlist: WishlistState }) => state.wishlist;
export const selectWishlistLoading = (state: { wishlist: WishlistState }) => state.wishlist.loading;
export const selectWishlistError = (state: { wishlist: WishlistState }) => state.wishlist.error;

// Memoized selectors
export const selectWishlistItems = createSelector(
  [selectWishlistState],
  (wishlist) => Array.isArray(wishlist.items) ? wishlist.items : []
);

export const selectWishlistCount = createSelector(
  [selectWishlistItems],
  (items) => Array.isArray(items) ? items.length : 0
);

export const selectIsInWishlist = createSelector(
  [selectWishlistItems, (state: any, productId: string | number) => productId],
  (items, productId) => Array.isArray(items) ? items.some(item => item.product_id === productId.toString()) : false
);

// Selector to get products from wishlist items
export const selectWishlistProducts = createSelector(
  [selectWishlistItems],
  (items) => Array.isArray(items) ? items.map(item => item.product).filter(Boolean) : []
);

export default wishlistSlice.reducer; 