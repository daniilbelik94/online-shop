import { createSlice, createAsyncThunk, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { wishlistAPI } from '../../lib/api';
import type { Product } from '../../lib/api';

interface WishlistState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async () => {
    const response = await wishlistAPI.getWishlist();
    return response.data?.data || response.data || [];
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId: string | number) => {
    const response = await wishlistAPI.addToWishlist(productId);
    return response.data?.product || response.data;
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId: string | number) => {
    await wishlistAPI.removeFromWishlist(productId);
    return productId;
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
      .addCase(fetchWishlist.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch wishlist';
      })
      
      // Add to wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        if (action.payload && !state.items.find(item => item.id === action.payload.id)) {
          state.items.push(action.payload);
        }
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
        state.items = state.items.filter(item => item.id !== action.payload.toString());
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
  (wishlist) => wishlist.items
);

export const selectWishlistCount = createSelector(
  [selectWishlistItems],
  (items) => items.length
);

export const selectIsInWishlist = createSelector(
  [selectWishlistItems, (state: any, productId: string | number) => productId],
  (items, productId) => items.some(item => item.id === productId.toString())
);

export default wishlistSlice.reducer; 