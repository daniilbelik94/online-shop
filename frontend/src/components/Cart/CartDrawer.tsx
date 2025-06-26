import React, { useEffect, useState } from 'react';
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
  Paper,
  Tooltip,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Card,
  CardContent,
  CardMedia,
  Fade,
  Skeleton,
  Stack,
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
  BookmarkBorder as SaveForLaterIcon,
  Bookmark as SavedIcon,
  LocalOffer as PromoIcon,
  Inventory as StockIcon,
  TrendingUp as TrendingIcon,
  Star as StarIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  LocalShipping as ShippingIcon,
  CreditCard as PaymentIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { 
  removeFromCart, 
  updateQuantity, 
  clearCart,
  selectCartItems,
  selectCartTotal,
  selectCartCount,
} from '../../store/slices/cartSlice';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const cartCount = useSelector(selectCartCount);
  
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [savedItems, setSavedItems] = useState<any[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [clearCartDialogOpen, setClearCartDialogOpen] = useState(false);
  
  // Mock recommended products
  const [recommendations] = useState([
    {
      id: 'rec1',
      name: 'Wireless Bluetooth Headphones',
      price: 99.99,
      originalPrice: 149.99,
      image: '/placeholder-product.jpg',
      rating: 4.8,
      discount: 33,
    },
    {
      id: 'rec2',
      name: 'Premium Phone Case',
      price: 24.99,
      originalPrice: 39.99,
      image: '/placeholder-product.jpg',
      rating: 4.6,
      discount: 38,
    },
  ]);

  const handleQuantityChange = (id: string, quantity: number) => {
    if (quantity <= 0) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  const handleRemoveItem = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleSaveForLater = (item: any) => {
    setSavedItems(prev => [...prev, item]);
    dispatch(removeFromCart(item.id));
  };

  const handleMoveToCart = (item: any) => {
    setSavedItems(prev => prev.filter(saved => saved.id !== item.id));
    // Dispatch add to cart action
  };

  const handleApplyPromo = async () => {
    setLoading(true);
    setPromoError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock promo validation
      const validPromoCodes = {
        'SAVE10': 10,
        'WELCOME20': 20,
        'STUDENT15': 15,
        'FIRST50': 50,
      };
      
      const discount = validPromoCodes[promoCode.toUpperCase() as keyof typeof validPromoCodes];
      
      if (discount) {
        setPromoDiscount(discount);
        setPromoApplied(true);
      } else {
        setPromoError('Invalid promo code');
      }
    } catch (error) {
      setPromoError('Failed to apply promo code');
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePromo = () => {
    setPromoCode('');
    setPromoApplied(false);
    setPromoDiscount(0);
    setPromoError('');
  };

  const handleContinueToCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    setClearCartDialogOpen(false);
  };

  const calculateFinalTotal = () => {
    const discount = (cartTotal * promoDiscount) / 100;
    return cartTotal - discount;
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getShippingInfo = () => {
    if (cartTotal >= 50) {
      return { text: 'Free Shipping!', color: 'success.main', icon: '🚚' };
    } else {
      const needed = 50 - cartTotal;
      return { 
        text: `Add ${formatPrice(needed)} more for free shipping`, 
        color: 'warning.main',
        icon: '📦'
      };
    }
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: { xs: '100%', sm: 480 },
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          }
        }}
      >
        <Box sx={{ 
          height: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Header */}
          <Box sx={{ 
            p: 3, 
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(255,255,255,0.2)',
            position: 'relative',
            zIndex: 1,
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Badge badgeContent={cartCount} color="secondary">
                  <ShoppingCartIcon sx={{ fontSize: 28, color: 'white' }} />
                </Badge>
                <Box>
                  <Typography variant="h5" fontWeight="bold" color="white">
                    Shopping Cart
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    {cartCount} {cartCount === 1 ? 'item' : 'items'}
                  </Typography>
                </Box>
              </Box>
              <IconButton 
                onClick={onClose}
                sx={{ 
                  color: 'white',
                  '&:hover': { 
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    transform: 'scale(1.1)',
                  }
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
            
            {/* Shipping Progress */}
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                  {getShippingInfo().icon} {getShippingInfo().text}
                </Typography>
              </Box>
              <Box sx={{ 
                width: '100%', 
                height: 6, 
                borderRadius: 3,
                backgroundColor: 'rgba(255,255,255,0.2)',
                overflow: 'hidden',
              }}>
                <Box sx={{ 
                  width: `${Math.min((cartTotal / 50) * 100, 100)}%`,
                  height: '100%',
                  backgroundColor: cartTotal >= 50 ? '#4caf50' : '#ff9800',
                  borderRadius: 3,
                  transition: 'width 0.3s ease',
                }} />
              </Box>
            </Box>
          </Box>

          {/* Cart Items */}
          <Box sx={{ 
            flexGrow: 1, 
            overflow: 'auto',
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
          }}>
            {cartItems.length === 0 ? (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                height: '100%',
                p: 4,
                textAlign: 'center',
              }}>
                <ShoppingCartIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom color="text.secondary">
                  Your cart is empty
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Add some items to get started
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => {
                    onClose();
                    navigate('/products');
                  }}
                  sx={{
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                    }
                  }}
                >
                  Continue Shopping
                </Button>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {cartItems.map((item, index) => (
                  <Fade in key={item.id} timeout={300 + index * 100}>
                    <ListItem
                      sx={{
                        p: 3,
                        borderBottom: '1px solid rgba(0,0,0,0.1)',
                        '&:hover': {
                          backgroundColor: 'rgba(102, 126, 234, 0.05)',
                        }
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={item.images?.[0] || '/placeholder-product.jpg'}
                          variant="rounded"
                          sx={{ 
                            width: 80, 
                            height: 80,
                            border: '2px solid rgba(102, 126, 234, 0.2)',
                            borderRadius: 2,
                          }}
                        />
                      </ListItemAvatar>
                      
                      {/* Custom content instead of ListItemText to avoid DOM nesting issues */}
                      <Box sx={{ ml: 2, flexGrow: 1 }}>
                        {/* Product Info */}
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            {item.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            SKU: {item.sku || 'N/A'}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                            <Typography variant="h6" fontWeight="bold" color="primary">
                              {formatPrice(item.price)}
                            </Typography>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  textDecoration: 'line-through',
                                  color: 'text.secondary',
                                }}
                              >
                                {formatPrice(item.originalPrice)}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                        
                        {/* Controls */}
                        <Box sx={{ mt: 2 }}>
                          {/* Quantity Controls */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              sx={{
                                border: '1px solid rgba(102, 126, 234, 0.3)',
                                borderRadius: 1,
                                '&:hover': {
                                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                }
                              }}
                            >
                              <RemoveIcon />
                            </IconButton>
                            <Typography
                              variant="body1"
                              fontWeight="bold"
                              sx={{
                                minWidth: 40,
                                textAlign: 'center',
                                px: 2,
                                py: 1,
                                border: '1px solid rgba(0,0,0,0.2)',
                                borderRadius: 1,
                                backgroundColor: 'rgba(0,0,0,0.05)',
                              }}
                            >
                              {item.quantity}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              sx={{
                                border: '1px solid rgba(102, 126, 234, 0.3)',
                                borderRadius: 1,
                                '&:hover': {
                                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                                }
                              }}
                            >
                              <AddIcon />
                            </IconButton>
                          </Box>
                          
                          {/* Action Buttons */}
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Save for later">
                              <IconButton
                                size="small"
                                onClick={() => handleSaveForLater(item)}
                                sx={{ color: 'primary.main' }}
                              >
                                <SaveForLaterIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Remove from cart">
                              <IconButton
                                size="small"
                                onClick={() => handleRemoveItem(item.id)}
                                sx={{ color: 'error.main' }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Add to favorites">
                              <IconButton
                                size="small"
                                sx={{ color: 'secondary.main' }}
                              >
                                <FavoriteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                          
                          {/* Stock Info */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                            <StockIcon sx={{ fontSize: 16, color: 'success.main' }} />
                            <Typography variant="caption" color="success.main">
                              In Stock
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      
                      {/* Item Total */}
                      <Box sx={{ textAlign: 'right', ml: 2 }}>
                        <Typography variant="h6" fontWeight="bold" color="primary">
                          {formatPrice(item.price * item.quantity)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Total
                        </Typography>
                      </Box>
                    </ListItem>
                  </Fade>
                ))}
              </List>
            )}

            {/* Saved Items */}
            {savedItems.length > 0 && (
              <Box sx={{ p: 3, borderTop: '2px solid rgba(102, 126, 234, 0.2)' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  💾 Saved for Later ({savedItems.length})
                </Typography>
                {savedItems.map((item) => (
                  <Card key={item.id} sx={{ mb: 2, borderRadius: 2 }}>
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          src={item.images?.[0] || '/placeholder-product.jpg'}
                          variant="rounded"
                          sx={{ width: 50, height: 50 }}
                        />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body2" fontWeight="bold">
                            {item.name}
                          </Typography>
                          <Typography variant="body2" color="primary">
                            {formatPrice(item.price)}
                          </Typography>
                        </Box>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleMoveToCart(item)}
                          sx={{ borderRadius: 2 }}
                        >
                          Move to Cart
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}

            {/* Recommendations */}
            {cartItems.length > 0 && (
              <Box sx={{ p: 3, borderTop: '2px solid rgba(102, 126, 234, 0.2)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">
                    🔥 You might also like
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => setShowRecommendations(!showRecommendations)}
                  >
                    {showRecommendations ? 'Hide' : 'Show'}
                  </Button>
                </Box>
                
                {showRecommendations && (
                  <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
                    {recommendations.map((product) => (
                      <Card key={product.id} sx={{ minWidth: 200, borderRadius: 2 }}>
                        <CardMedia
                          component="img"
                          height="120"
                          image={product.image}
                          alt={product.name}
                        />
                        <CardContent sx={{ p: 2 }}>
                          <Typography variant="body2" fontWeight="bold" gutterBottom>
                            {product.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography variant="body2" fontWeight="bold" color="primary">
                              {formatPrice(product.price)}
                            </Typography>
                            <Typography 
                              variant="caption" 
                              sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                            >
                              {formatPrice(product.originalPrice)}
                            </Typography>
                          </Box>
                          <Chip
                            label={`${product.discount}% OFF`}
                            size="small"
                            color="secondary"
                            sx={{ mb: 1 }}
                          />
                          <Button
                            size="small"
                            variant="contained"
                            fullWidth
                            sx={{ borderRadius: 2 }}
                          >
                            Add to Cart
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}
              </Box>
            )}
          </Box>

          {/* Footer - Checkout Section */}
          {cartItems.length > 0 && (
            <Box sx={{ 
              p: 3,
              background: 'rgba(255,255,255,0.98)',
              backdropFilter: 'blur(10px)',
              borderTop: '1px solid rgba(0,0,0,0.1)',
            }}>
              {/* Promo Code */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  🎫 Promo Code
                </Typography>
                {!promoApplied ? (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      size="small"
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      error={!!promoError}
                      helperText={promoError}
                      sx={{ flexGrow: 1 }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PromoIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Button
                      variant="outlined"
                      onClick={handleApplyPromo}
                      disabled={!promoCode || loading}
                      sx={{ px: 3, borderRadius: 2 }}
                    >
                      {loading ? <CircularProgress size={20} /> : 'Apply'}
                    </Button>
                  </Box>
                ) : (
                  <Alert
                    severity="success"
                    action={
                      <IconButton onClick={handleRemovePromo} size="small">
                        <CloseIcon />
                      </IconButton>
                    }
                    sx={{ borderRadius: 2 }}
                  >
                    Promo code "{promoCode}" applied! Save {promoDiscount}%
                  </Alert>
                )}
              </Box>

              {/* Order Summary */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  📋 Order Summary
                </Typography>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 2,
                  background: 'rgba(102, 126, 234, 0.05)',
                  border: '1px solid rgba(102, 126, 234, 0.2)',
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Subtotal:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {formatPrice(cartTotal)}
                    </Typography>
                  </Box>
                  
                  {promoApplied && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="success.main">
                        Discount ({promoDiscount}%):
                      </Typography>
                      <Typography variant="body2" fontWeight="bold" color="success.main">
                        -{formatPrice((cartTotal * promoDiscount) / 100)}
                      </Typography>
                    </Box>
                  )}
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Shipping:</Typography>
                    <Typography variant="body2" fontWeight="bold" color={cartTotal >= 50 ? 'success.main' : 'inherit'}>
                      {cartTotal >= 50 ? 'FREE' : formatPrice(5.99)}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6" fontWeight="bold">
                      Total:
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      {formatPrice(calculateFinalTotal() + (cartTotal >= 50 ? 0 : 5.99))}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Action Buttons */}
              <Stack spacing={2}>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleContinueToCheckout}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    borderRadius: 3,
                    py: 1.5,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                    }
                  }}
                >
                  Proceed to Checkout
                </Button>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => {
                      onClose();
                      navigate('/products');
                    }}
                    sx={{ borderRadius: 2 }}
                  >
                    Continue Shopping
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => setClearCartDialogOpen(true)}
                    sx={{ borderRadius: 2, minWidth: 120 }}
                  >
                    Clear Cart
                  </Button>
                </Box>
              </Stack>

              {/* Security Badge */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: 1,
                mt: 2,
                p: 1,
                borderRadius: 2,
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
              }}>
                <SecurityIcon sx={{ fontSize: 16, color: 'success.main' }} />
                <Typography variant="caption" color="success.main" fontWeight="bold">
                  Secure Checkout • SSL Encrypted
                </Typography>
                <CheckCircleIcon sx={{ fontSize: 16, color: 'success.main' }} />
              </Box>
            </Box>
          )}
        </Box>
      </Drawer>

      {/* Clear Cart Confirmation Dialog */}
      <Dialog
        open={clearCartDialogOpen}
        onClose={() => setClearCartDialogOpen(false)}
        maxWidth="sm"
      >
        <DialogTitle>
          🗑️ Clear Shopping Cart
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove all items from your cart? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setClearCartDialogOpen(false)}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleClearCart}
            variant="contained" 
            color="error"
            sx={{ borderRadius: 2 }}
          >
            Clear Cart
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CartDrawer; 