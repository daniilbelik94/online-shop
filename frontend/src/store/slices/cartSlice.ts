import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { cartAPI, Cart, CartItem } from '../../lib/api';

interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  lastAction: string | null; // Track last successful action
  notification: {
    message: string;
    type: 'success' | 'error' | null;
  } | null;
}

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
  lastAction: null,
  notification: null,
};

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async () => {
    const response = await cartAPI.getCart();
    return response.data.data;
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }: { productId: string; quantity: number }) => {
    const response = await cartAPI.addToCart(productId, quantity);
    return response.data.data;
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
    const response = await cartAPI.updateCartItem(itemId, quantity);
    return response.data.data;
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId: string) => {
    const response = await cartAPI.removeFromCart(itemId);
    return response.data.data;
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async () => {
    const response = await cartAPI.clearCart();
    return response.data.data;
  }
);

export const mergeGuestCart = createAsyncThunk(
  'cart/mergeGuestCart',
  async () => {
    const response = await cartAPI.mergeGuestCart();
    return response.data.data;
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetCart: (state) => {
      state.cart = null;
      state.error = null;
      state.lastAction = null;
      state.notification = null;
    },
    clearNotification: (state) => {
      state.notification = null;
    },
    setNotification: (state, action: PayloadAction<{ message: string; type: 'success' | 'error' }>) => {
      state.notification = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action: PayloadAction<Cart>) => {
        state.loading = false;
        state.cart = action.payload;
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch cart';
      })
      
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.notification = null;
      })
      .addCase(addToCart.fulfilled, (state, action: PayloadAction<Cart>) => {
        state.loading = false;
        state.cart = action.payload;
        state.error = null;
        state.lastAction = 'ADD_TO_CART';
        state.notification = {
          message: 'Product added to cart successfully!',
          type: 'success'
        };
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add item to cart';
        state.notification = {
          message: action.error.message || 'Failed to add item to cart',
          type: 'error'
        };
      })
      
      // Update cart item
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.notification = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action: PayloadAction<Cart>) => {
        state.loading = false;
        state.cart = action.payload;
        state.error = null;
        state.lastAction = 'UPDATE_CART_ITEM';
        state.notification = {
          message: 'Cart updated successfully!',
          type: 'success'
        };
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update cart item';
        state.notification = {
          message: action.error.message || 'Failed to update cart item',
          type: 'error'
        };
      })
      
      // Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.notification = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action: PayloadAction<Cart>) => {
        state.loading = false;
        state.cart = action.payload;
        state.error = null;
        state.lastAction = 'REMOVE_FROM_CART';
        state.notification = {
          message: 'Item removed from cart!',
          type: 'success'
        };
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to remove item from cart';
        state.notification = {
          message: action.error.message || 'Failed to remove item from cart',
          type: 'error'
        };
      })
      
      // Clear cart
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action: PayloadAction<Cart>) => {
        state.loading = false;
        state.cart = action.payload;
        state.error = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to clear cart';
      })
      
      // Merge guest cart
      .addCase(mergeGuestCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(mergeGuestCart.fulfilled, (state, action: PayloadAction<Cart>) => {
        state.loading = false;
        state.cart = action.payload;
        state.error = null;
      })
      .addCase(mergeGuestCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to merge guest cart';
      });
  },
});

export const { clearError, resetCart, clearNotification, setNotification } = cartSlice.actions;

// Selectors
export const selectCart = (state: { cart: CartState }) => state.cart.cart;
export const selectCartLoading = (state: { cart: CartState }) => state.cart.loading;
export const selectCartError = (state: { cart: CartState }) => state.cart.error;
export const selectCartItemsCount = (state: { cart: CartState }) => 
  state.cart.cart?.count || 0;
export const selectCartTotal = (state: { cart: CartState }) => 
  state.cart.cart?.total || 0;
export const selectCartNotification = (state: { cart: CartState }) => 
  state.cart.notification;

export default cartSlice.reducer; 