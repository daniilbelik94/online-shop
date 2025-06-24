import React, { useEffect } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Button,
  Divider,
  TextField,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import {
  fetchCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  selectCart,
  selectCartLoading,
  selectCartError,
  selectCartItemsCount,
  selectCartTotal,
} from '../../store/slices/cartSlice';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const formatPrice = (price: number | string | null | undefined): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return numPrice != null && !isNaN(numPrice) ? `$${numPrice.toFixed(2)}` : '$0.00';
};

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const cart = useSelector(selectCart);
  const loading = useSelector(selectCartLoading);
  const error = useSelector(selectCartError);
  const itemsCount = useSelector(selectCartItemsCount);
  const total = useSelector(selectCartTotal);

  useEffect(() => {
    if (open) {
      dispatch(fetchCart());
    }
  }, [open, dispatch]);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch(removeFromCart(itemId));
    } else {
      dispatch(updateCartItem({ itemId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (itemId: string) => {
    dispatch(removeFromCart(itemId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleCheckout = () => {
    // TODO: Implement checkout
    console.log('Checkout clicked');
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 400 },
          maxWidth: '100vw',
        },
      }}
    >
      <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShoppingCartIcon />
            Shopping Cart
            {itemsCount > 0 && (
              <Chip 
                label={itemsCount} 
                size="small" 
                color="primary" 
                sx={{ ml: 1 }}
              />
            )}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Loading */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Empty Cart */}
        {!loading && (!cart || cart.items.length === 0) && (
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              flex: 1,
              textAlign: 'center',
              py: 4
            }}
          >
            <ShoppingCartIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Your cart is empty
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Add some products to get started
            </Typography>
            <Button variant="contained" onClick={onClose}>
              Continue Shopping
            </Button>
          </Box>
        )}

        {/* Cart Items */}
        {!loading && cart && cart.items.length > 0 && (
          <>
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              <List>
                {cart.items.map((item, index) => (
                  <React.Fragment key={item.id}>
                    <ListItem
                      sx={{
                        px: 0,
                        py: 2,
                        flexDirection: 'column',
                        alignItems: 'stretch',
                      }}
                    >
                      <Box sx={{ display: 'flex', width: '100%', mb: 1 }}>
                        <ListItemAvatar>
                          <Avatar
                            src={item.image_url || '/placeholder-product.jpg'}
                            alt={item.name}
                            variant="rounded"
                            sx={{ width: 60, height: 60 }}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle2" noWrap>
                              {item.name}
                            </Typography>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {formatPrice(item.cart_price)} each
                              </Typography>
                              {item.current_price !== item.cart_price && (
                                <Typography variant="caption" color="warning.main">
                                  Price changed to {formatPrice(item.current_price)}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveItem(item.id)}
                          sx={{ alignSelf: 'flex-start' }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>

                      {/* Quantity Controls */}
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={loading}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <TextField
                            size="small"
                            value={item.quantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 0;
                              handleQuantityChange(item.id, value);
                            }}
                            inputProps={{
                              min: 0,
                              max: item.stock_quantity,
                              style: { textAlign: 'center', width: '60px' }
                            }}
                            type="number"
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={loading || item.quantity >= item.stock_quantity}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {formatPrice(item.total)}
                        </Typography>
                      </Box>

                      {/* Stock Warning */}
                      {item.quantity > item.stock_quantity && (
                        <Alert severity="warning" sx={{ mt: 1 }}>
                          Only {item.stock_quantity} items in stock
                        </Alert>
                      )}
                    </ListItem>
                    {index < cart.items.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Box>

            {/* Cart Summary */}
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">
                  Total: {formatPrice(total)}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleClearCart}
                  disabled={loading}
                >
                  Clear Cart
                </Button>
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleCheckout}
                disabled={loading || cart.items.length === 0}
                sx={{ mb: 1 }}
              >
                Proceed to Checkout
              </Button>

              <Button
                variant="text"
                fullWidth
                onClick={onClose}
              >
                Continue Shopping
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default CartDrawer; 