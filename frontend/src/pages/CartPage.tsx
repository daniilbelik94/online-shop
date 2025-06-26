import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  IconButton,
  Avatar,
  Chip,
  Divider,
  TextField,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Breadcrumbs,
  Link,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  Badge,
  Skeleton,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  Home as HomeIcon,
  Storefront as ProductsIcon,
  BookmarkBorder as SaveForLaterIcon,
  Bookmark as SavedIcon,
  LocalOffer as PromoIcon,
  Inventory as StockIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  ArrowForward as ArrowForwardIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  TrendingUp as TrendingIcon,
  Star as StarIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Refresh as RefreshIcon,
  ClearAll as ClearAllIcon,
  ShoppingBag as ShoppingBagIcon,
  Timeline as TimelineIcon,
  AttachMoney as MoneyIcon,
  LocalFireDepartment as FireIcon,
  Flash as FlashIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  removeFromCart,
  updateQuantity,
  clearCart,
  selectCartItems,
  selectCartTotal,
  selectCartCount,
} from '../store/slices/cartSlice';

const CartPage: React.FC = () => {
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
  const [clearCartDialogOpen, setClearCartDialogOpen] = useState(false);
  const [showSavedItems, setShowSavedItems] = useState(true);
  const [showRecommendations, setShowRecommendations] = useState(true);

  // Mock data
  const [recommendations] = useState([
    {
      id: 'rec1',
      name: 'Wireless Bluetooth Headphones',
      price: 99.99,
      originalPrice: 149.99,
      image: '/placeholder-product.jpg',
      rating: 4.8,
      discount: 33,
      reviews: 2847,
      inStock: true,
    },
    {
      id: 'rec2',
      name: 'Premium Phone Case',
      price: 24.99,
      originalPrice: 39.99,
      image: '/placeholder-product.jpg',
      rating: 4.6,
      discount: 38,
      reviews: 1256,
      inStock: true,
    },
    {
      id: 'rec3',
      name: 'Smart Watch Band',
      price: 39.99,
      originalPrice: 59.99,
      image: '/placeholder-product.jpg',
      rating: 4.7,
      discount: 33,
      reviews: 892,
      inStock: false,
    },
  ]);

  const [recentlyViewed] = useState([
    {
      id: 'rv1',
      name: 'Laptop Stand Adjustable',
      price: 49.99,
      image: '/placeholder-product.jpg',
      rating: 4.5,
    },
    {
      id: 'rv2',
      name: 'Bluetooth Keyboard',
      price: 79.99,
      image: '/placeholder-product.jpg',
      rating: 4.4,
    },
  ]);

  const steps = [
    'Shopping Cart',
    'Shipping Info',
    'Payment',
    'Order Review',
  ];

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
    // Dispatch add to cart action here
  };

  const handleApplyPromo = async () => {
    setLoading(true);
    setPromoError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const validPromoCodes = {
        'SAVE10': 10,
        'WELCOME20': 20,
        'STUDENT15': 15,
        'FIRST50': 50,
        'FLASH25': 25,
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

  const handleClearCart = () => {
    dispatch(clearCart());
    setClearCartDialogOpen(false);
  };

  const calculateSubtotal = () => cartTotal;
  const calculateDiscount = () => (cartTotal * promoDiscount) / 100;
  const calculateShipping = () => cartTotal >= 50 ? 0 : 5.99;
  const calculateTax = () => (cartTotal - calculateDiscount()) * 0.08; // 8% tax
  const calculateTotal = () => 
    cartTotal - calculateDiscount() + calculateShipping() + calculateTax();

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getShippingProgress = () => {
    if (cartTotal >= 50) {
      return { progress: 100, text: 'Free Shipping Unlocked! 🎉', color: 'success' };
    } else {
      const needed = 50 - cartTotal;
      const progress = (cartTotal / 50) * 100;
      return { 
        progress, 
        text: `Add ${formatPrice(needed)} more for free shipping`, 
        color: 'warning' 
      };
    }
  };

  if (cartItems.length === 0 && savedItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 4 }}>
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate('/')}
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            <HomeIcon fontSize="small" />
            Home
          </Link>
          <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <ShoppingCartIcon fontSize="small" />
            Shopping Cart
          </Typography>
        </Breadcrumbs>

        {/* Empty Cart */}
        <Paper
          sx={{
            p: 8,
            textAlign: 'center',
            borderRadius: 4,
            background: 'linear-gradient(135deg, #f8f9ff 0%, #e8f2ff 100%)',
            border: '2px dashed rgba(102, 126, 234, 0.3)',
          }}
        >
          <ShoppingCartIcon sx={{ fontSize: 120, color: 'text.secondary', mb: 3 }} />
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
            Looks like you haven't added anything to your cart yet. 
            Start shopping to fill it up with amazing products!
          </Typography>
          
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/products')}
              startIcon={<ProductsIcon />}
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                }
              }}
            >
              Start Shopping
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/')}
              startIcon={<HomeIcon />}
              sx={{ borderRadius: 3, px: 4, py: 1.5 }}
            >
              Go Home
            </Button>
          </Stack>

          {/* Quick Links */}
          <Box sx={{ mt: 6 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Popular Categories
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
              {['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books'].map((category) => (
                <Chip
                  key={category}
                  label={category}
                  onClick={() => navigate('/products')}
                  variant="outlined"
                  sx={{ 
                    borderRadius: 3,
                    '&:hover': {
                      backgroundColor: 'primary.main',
                      color: 'white',
                    }
                  }}
                />
              ))}
            </Stack>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate('/')}
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          <HomeIcon fontSize="small" />
          Home
        </Link>
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <ShoppingCartIcon fontSize="small" />
          Shopping Cart
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          🛒 Shopping Cart
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
        </Typography>
      </Box>

      {/* Progress Stepper */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Stepper activeStep={0} alternativeLabel>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel 
                sx={{
                  '& .MuiStepLabel-label': {
                    fontWeight: index === 0 ? 'bold' : 'normal',
                    color: index === 0 ? 'primary.main' : 'text.secondary',
                  }
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Shipping Progress */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3, background: 'linear-gradient(135deg, #f8f9ff 0%, #e8f2ff 100%)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ShippingIcon color="primary" />
            <Typography variant="h6" fontWeight="bold">
              {getShippingProgress().text}
            </Typography>
          </Box>
          {cartTotal < 50 && (
            <Chip
              label="FREE SHIPPING AT $50"
              color="warning"
              sx={{ fontWeight: 'bold' }}
            />
          )}
        </Box>
        
        <Box sx={{ 
          width: '100%', 
          height: 8, 
          backgroundColor: 'rgba(0,0,0,0.1)', 
          borderRadius: 4,
          overflow: 'hidden',
        }}>
          <Box sx={{ 
            width: `${getShippingProgress().progress}%`,
            height: '100%',
            background: cartTotal >= 50 
              ? 'linear-gradient(90deg, #4caf50, #8bc34a)' 
              : 'linear-gradient(90deg, #ff9800, #ffc107)',
            borderRadius: 4,
            transition: 'width 0.3s ease',
          }} />
        </Box>
      </Paper>

      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
            {/* Cart Header */}
            <Box sx={{ 
              p: 3, 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Badge badgeContent={cartCount} color="secondary">
                    <ShoppingCartIcon sx={{ fontSize: 32 }} />
                  </Badge>
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      Your Items
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Review and modify your selection
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Refresh prices">
                    <IconButton sx={{ color: 'white' }}>
                      <RefreshIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Clear cart">
                    <IconButton 
                      sx={{ color: 'white' }}
                      onClick={() => setClearCartDialogOpen(true)}
                    >
                      <ClearAllIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Box>

            {/* Cart Items List */}
            <Box sx={{ p: 3 }}>
              {cartItems.map((item, index) => (
                <Card 
                  key={item.id} 
                  sx={{ 
                    mb: 3, 
                    borderRadius: 3,
                    border: '1px solid rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Grid container spacing={3} alignItems="center">
                      {/* Product Image */}
                      <Grid item xs={12} sm={3}>
                        <Box sx={{ position: 'relative' }}>
                          <Avatar
                            src={item.images?.[0] || '/placeholder-product.jpg'}
                            variant="rounded"
                            sx={{ 
                              width: '100%', 
                              height: 120,
                              border: '2px solid rgba(102, 126, 234, 0.2)',
                            }}
                          />
                          {item.originalPrice && item.originalPrice > item.price && (
                            <Chip
                              label={`${Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF`}
                              size="small"
                              color="secondary"
                              sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                fontWeight: 'bold',
                              }}
                            />
                          )}
                        </Box>
                      </Grid>

                      {/* Product Info */}
                      <Grid item xs={12} sm={4}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          SKU: {item.sku || 'N/A'}
                        </Typography>
                        
                        {/* Price */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
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

                        {/* Stock Status */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <StockIcon sx={{ fontSize: 16, color: 'success.main' }} />
                          <Typography variant="caption" color="success.main" fontWeight="bold">
                            In Stock • Ships in 1-2 days
                          </Typography>
                        </Box>
                      </Grid>

                      {/* Quantity Controls */}
                      <Grid item xs={12} sm={3}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                          Quantity
                        </Typography>
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
                          <TextField
                            size="small"
                            value={item.quantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 1;
                              handleQuantityChange(item.id, value);
                            }}
                            inputProps={{ 
                              min: 1, 
                              style: { textAlign: 'center', width: '60px' } 
                            }}
                            type="number"
                            sx={{ 
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 1,
                              }
                            }}
                          />
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
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Save for later">
                            <IconButton
                              size="small"
                              onClick={() => handleSaveForLater(item)}
                              sx={{ color: 'primary.main' }}
                            >
                              <SaveForLaterIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Add to favorites">
                            <IconButton size="small" sx={{ color: 'secondary.main' }}>
                              <FavoriteIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Share">
                            <IconButton size="small" sx={{ color: 'info.main' }}>
                              <ShareIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Remove">
                            <IconButton
                              size="small"
                              onClick={() => handleRemoveItem(item.id)}
                              sx={{ color: 'error.main' }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </Grid>

                      {/* Item Total */}
                      <Grid item xs={12} sm={2}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                          Total
                        </Typography>
                        <Typography variant="h5" fontWeight="bold" color="primary">
                          {formatPrice(item.price * item.quantity)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {formatPrice(item.price)} × {item.quantity}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Paper>

          {/* Saved Items */}
          {savedItems.length > 0 && (
            <Paper sx={{ mt: 4, borderRadius: 3, overflow: 'hidden' }}>
              <Box sx={{ 
                p: 3, 
                background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                cursor: 'pointer',
              }}
              onClick={() => setShowSavedItems(!showSavedItems)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <SavedIcon sx={{ fontSize: 32, color: 'rgba(0,0,0,0.7)' }} />
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        Saved for Later ({savedItems.length})
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        Items you want to purchase later
                      </Typography>
                    </Box>
                  </Box>
                  {showSavedItems ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </Box>
              </Box>

              <Collapse in={showSavedItems}>
                <Box sx={{ p: 3 }}>
                  <Grid container spacing={2}>
                    {savedItems.map((item) => (
                      <Grid item xs={12} sm={6} md={4} key={item.id}>
                        <Card sx={{ borderRadius: 2 }}>
                          <CardMedia
                            component="img"
                            height="140"
                            image={item.images?.[0] || '/placeholder-product.jpg'}
                            alt={item.name}
                          />
                          <CardContent>
                            <Typography variant="subtitle2" fontWeight="bold" noWrap>
                              {item.name}
                            </Typography>
                            <Typography variant="h6" color="primary" fontWeight="bold">
                              {formatPrice(item.price)}
                            </Typography>
                          </CardContent>
                          <CardActions>
                            <Button 
                              size="small" 
                              variant="contained"
                              onClick={() => handleMoveToCart(item)}
                              sx={{ borderRadius: 2 }}
                            >
                              Move to Cart
                            </Button>
                            <Button size="small" color="error">
                              Remove
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Collapse>
            </Paper>
          )}

          {/* Recommendations */}
          <Paper sx={{ mt: 4, borderRadius: 3, overflow: 'hidden' }}>
            <Box sx={{ 
              p: 3, 
              background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
              cursor: 'pointer',
            }}
            onClick={() => setShowRecommendations(!showRecommendations)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <FireIcon sx={{ fontSize: 32, color: 'rgba(0,0,0,0.7)' }} />
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      You Might Also Like
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Recommended based on your cart
                    </Typography>
                  </Box>
                </Box>
                {showRecommendations ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </Box>
            </Box>

            <Collapse in={showRecommendations}>
              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  {recommendations.map((product) => (
                    <Grid item xs={12} sm={6} md={4} key={product.id}>
                      <Card sx={{ 
                        borderRadius: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                        }
                      }}>
                        <Box sx={{ position: 'relative' }}>
                          <CardMedia
                            component="img"
                            height="200"
                            image={product.image}
                            alt={product.name}
                          />
                          <Chip
                            label={`${product.discount}% OFF`}
                            size="small"
                            color="secondary"
                            sx={{
                              position: 'absolute',
                              top: 12,
                              right: 12,
                              fontWeight: 'bold',
                            }}
                          />
                          {!product.inStock && (
                            <Chip
                              label="Out of Stock"
                              size="small"
                              color="error"
                              sx={{
                                position: 'absolute',
                                top: 12,
                                left: 12,
                                fontWeight: 'bold',
                              }}
                            />
                          )}
                        </Box>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            {product.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography variant="h6" fontWeight="bold" color="primary">
                              {formatPrice(product.price)}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                textDecoration: 'line-through',
                                color: 'text.secondary',
                              }}
                            >
                              {formatPrice(product.originalPrice)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {[...Array(5)].map((_, i) => (
                                <StarIcon
                                  key={i}
                                  sx={{
                                    fontSize: 16,
                                    color: i < Math.floor(product.rating) ? '#ffc107' : '#e0e0e0',
                                  }}
                                />
                              ))}
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              ({product.reviews})
                            </Typography>
                          </Box>
                        </CardContent>
                        <CardActions sx={{ p: 2 }}>
                          <Button 
                            variant="contained" 
                            fullWidth 
                            disabled={!product.inStock}
                            sx={{ borderRadius: 2 }}
                          >
                            {product.inStock ? 'Add to Cart' : 'Notify Me'}
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Collapse>
          </Paper>
        </Grid>

        {/* Order Summary Sidebar */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ position: 'sticky', top: 20 }}>
            {/* Promo Code */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                🎫 Promo Code
              </Typography>
              {!promoApplied ? (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    error={!!promoError}
                    helperText={promoError}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PromoIcon />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ borderRadius: 2 }}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleApplyPromo}
                    disabled={!promoCode || loading}
                    sx={{ px: 3, borderRadius: 2, minWidth: 100 }}
                  >
                    {loading ? <CircularProgress size={20} /> : 'Apply'}
                  </Button>
                </Box>
              ) : (
                <Alert
                  severity="success"
                  action={
                    <IconButton onClick={handleRemovePromo} size="small">
                      <DeleteIcon />
                    </IconButton>
                  }
                  sx={{ borderRadius: 2 }}
                >
                  Code "{promoCode}" applied! Save {promoDiscount}%
                </Alert>
              )}

              {/* Popular Promo Codes */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  Try these codes:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
                  {['SAVE10', 'WELCOME20', 'STUDENT15'].map((code) => (
                    <Chip
                      key={code}
                      label={code}
                      size="small"
                      variant="outlined"
                      onClick={() => setPromoCode(code)}
                      sx={{ cursor: 'pointer', borderRadius: 2 }}
                    />
                  ))}
                </Stack>
              </Box>
            </Paper>

            {/* Order Summary */}
            <Paper sx={{ p: 3, borderRadius: 3, background: 'linear-gradient(135deg, #f8f9ff 0%, #e8f2ff 100%)' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                📋 Order Summary
              </Typography>

              <List sx={{ py: 0 }}>
                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemText primary="Subtotal:" />
                  <Typography variant="body1" fontWeight="bold">
                    {formatPrice(calculateSubtotal())}
                  </Typography>
                </ListItem>

                {promoApplied && (
                  <ListItem sx={{ px: 0, py: 1 }}>
                    <ListItemText 
                      primary={`Discount (${promoDiscount}%):`}
                      sx={{ color: 'success.main' }}
                    />
                    <Typography variant="body1" fontWeight="bold" color="success.main">
                      -{formatPrice(calculateDiscount())}
                    </Typography>
                  </ListItem>
                )}

                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemText primary="Shipping:" />
                  <Typography 
                    variant="body1" 
                    fontWeight="bold"
                    color={calculateShipping() === 0 ? 'success.main' : 'inherit'}
                  >
                    {calculateShipping() === 0 ? 'FREE' : formatPrice(calculateShipping())}
                  </Typography>
                </ListItem>

                <ListItem sx={{ px: 0, py: 1 }}>
                  <ListItemText primary="Tax:" />
                  <Typography variant="body1" fontWeight="bold">
                    {formatPrice(calculateTax())}
                  </Typography>
                </ListItem>
              </List>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" fontWeight="bold">
                  Total:
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="primary">
                  {formatPrice(calculateTotal())}
                </Typography>
              </Box>

              {/* Checkout Button */}
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={() => navigate('/checkout')}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  borderRadius: 3,
                  py: 2,
                  mb: 2,
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

              {/* Additional Actions */}
              <Stack spacing={1}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate('/products')}
                  sx={{ borderRadius: 2 }}
                >
                  Continue Shopping
                </Button>
                
                <Button
                  variant="text"
                  fullWidth
                  onClick={() => setClearCartDialogOpen(true)}
                  color="error"
                  sx={{ borderRadius: 2 }}
                >
                  Clear Cart
                </Button>
              </Stack>

              {/* Security Badges */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: 1,
                mt: 3,
                p: 2,
                borderRadius: 2,
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
              }}>
                <SecurityIcon sx={{ fontSize: 18, color: 'success.main' }} />
                <Typography variant="caption" color="success.main" fontWeight="bold">
                  Secure Checkout
                </Typography>
                <CheckCircleIcon sx={{ fontSize: 18, color: 'success.main' }} />
              </Box>

              {/* Payment Methods */}
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  We accept:
                </Typography>
                <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 1 }}>
                  {['💳', '🏦', '📱', '💰'].map((icon, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: 32,
                        height: 24,
                        borderRadius: 1,
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                      }}
                    >
                      {icon}
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Paper>

            {/* Recently Viewed */}
            <Paper sx={{ p: 3, mt: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                👀 Recently Viewed
              </Typography>
              {recentlyViewed.map((item) => (
                <Box key={item.id} sx={{ display: 'flex', gap: 2, mb: 2, p: 2, borderRadius: 2, backgroundColor: 'grey.50' }}>
                  <Avatar
                    src={item.image}
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
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          sx={{
                            fontSize: 12,
                            color: i < Math.floor(item.rating) ? '#ffc107' : '#e0e0e0',
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                  <Button size="small" variant="outlined" sx={{ borderRadius: 2 }}>
                    Add
                  </Button>
                </Box>
              ))}
            </Paper>
          </Box>
        </Grid>
      </Grid>

      {/* Clear Cart Dialog */}
      <Dialog
        open={clearCartDialogOpen}
        onClose={() => setClearCartDialogOpen(false)}
        maxWidth="sm"
        fullWidth
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
    </Container>
  );
};

export default CartPage; 