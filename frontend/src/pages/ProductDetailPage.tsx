import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Paper,
  Chip,
  Divider,
  TextField,
  Alert,
  CircularProgress,
  Breadcrumbs,
  Link,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  IconButton,
  Tabs,
  Tab,
  Tooltip,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as CartIcon,
  ArrowBack as BackIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store';
import { addToCart } from '../store/slices/cartSlice';
import { selectIsAuthenticated } from '../store/slices/authSlice';
import { selectIsInWishlist, addToWishlist, removeFromWishlist } from '../store/slices/wishlistSlice';
import { publicAPI, Product } from '../lib/api';
import ImageGallery from '../components/ImageGallery';

const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  // Wishlist status
  const isInWishlist = useSelector((state: any) => product ? selectIsInWishlist(state, product.id) : false);

  useEffect(() => {
    const loadProduct = async () => {
      if (!slug) {
        setError('Product slug not found');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        
        const response = await publicAPI.getProduct(slug);
        setProduct(response.data.data || response.data);
      } catch (err) {
        setError('Product not found');
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug]);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (product?.stock_quantity || 0)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      setAddingToCart(true);
      await dispatch(addToCart({ productId: product.id.toString(), quantity })).unwrap();
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to add to cart:', error);
      // You could show an error message here
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!product) return;
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      if (isInWishlist) {
        await dispatch(removeFromWishlist(product.id)).unwrap();
      } else {
        await dispatch(addToWishlist(product.id)).unwrap();
      }
    } catch (e) {
      console.error('Wishlist update failed:', e);
    }
  };

  const formatPrice = (price: number | undefined | null) => {
    if (price == null || isNaN(Number(price))) {
      return '$0.00';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Number(price));
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { label: 'Out of Stock', color: 'error' as const };
    if (quantity <= 5) return { label: `Only ${quantity} left`, color: 'warning' as const };
    return { label: 'In Stock', color: 'success' as const };
  };

  const TabPanel: React.FC<{ index: number; value: number; children: React.ReactNode }> = ({ index, value, children }) => {
    return (
      <Box hidden={value !== index} sx={{ mt: 2 }}>
        {value === index && <Box>{children}</Box>}
      </Box>
    );
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 4 } }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 4 } }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Product not found'}
        </Alert>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/products')}
          variant="outlined"
          size={isMobile ? "medium" : "large"}
        >
          Back to Catalog
        </Button>
      </Container>
    );
  }

  const stockStatus = getStockStatus(product.stock_quantity);

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 4 } }}>
      {/* Breadcrumbs */}
      <Breadcrumbs 
        sx={{ 
          mb: { xs: 2, sm: 3 },
          fontSize: { xs: '0.75rem', sm: '0.875rem' }
        }}
      >
        <Link component={RouterLink} to="/" underline="hover">
          Home
        </Link>
        <Link component={RouterLink} to="/products" underline="hover">
          Catalog
        </Link>
        {product.category && (
          <Link 
            component={RouterLink} 
            to={`/products?category=${product.category.slug}`} 
            underline="hover"
          >
            {product.category.name}
          </Link>
        )}
        <Typography 
          color="text.primary"
          sx={{ 
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: { xs: '150px', sm: 'none' }
          }}
        >
          {product.name}
        </Typography>
      </Breadcrumbs>

      <Grid container spacing={{ xs: 2, sm: 3, md: 4 }}>
        {/* Product Image */}
        <Grid item xs={12} md={7} sx={{ display: 'flex', alignItems: 'center' }}>
          <ImageGallery 
            images={product.images && product.images.length > 0 
              ? product.images.map(img => typeof img === 'string' ? img : img.image_url)
              : product.image_url 
                ? [product.image_url] 
                : []
            }
            alt={product.name}
            productName={product.name}
          />
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={5}>
          <Box sx={{ px: { xs: 1, sm: 2 } }}>
            {/* Product Name and Brand */}
            <Typography 
              variant={isSmallMobile ? "h5" : isMobile ? "h4" : "h3"} 
              component="h1" 
              gutterBottom
              sx={{
                fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' },
                lineHeight: 1.2,
                fontWeight: { xs: 'bold', md: 'normal' }
              }}
            >
              {product.name}
            </Typography>
            
            {product.brand && (
              <Typography 
                variant={isMobile ? "body1" : "h6"} 
                color="text.secondary" 
                gutterBottom
                sx={{
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                }}
              >
                Brand: {product.brand}
              </Typography>
            )}

            {/* SKU */}
            <Typography 
              variant="body2" 
              color="text.secondary" 
              gutterBottom
              sx={{
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}
            >
              SKU: {product.sku}
            </Typography>

            <Divider sx={{ my: { xs: 1.5, sm: 2 } }} />

            {/* Price & Rating */}
            <Typography 
              variant={isSmallMobile ? "h5" : isMobile ? "h4" : "h3"} 
              color="primary" 
              fontWeight="bold" 
              gutterBottom
              sx={{
                fontSize: { xs: '1.75rem', sm: '2.125rem', md: '3rem' }
              }}
            >
              {formatPrice(product.price)}
            </Typography>

            {product.compare_price && product.compare_price > product.price && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography 
                  variant="body1" 
                  sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                >
                  {formatPrice(product.compare_price)}
                </Typography>
                <Chip 
                  label={`-${Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}%`} 
                  color="error" 
                  size="small" 
                />
              </Box>
            )}

            {/* Ratings placeholder */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
              {[1,2,3,4,5].map((i) => (
                <StarIcon key={i} fontSize="small" color={i <= 4 ? 'warning' : 'disabled'} />
              ))}
              <Typography variant="caption" color="text.secondary">(120 reviews)</Typography>
            </Box>

            {/* Stock Status */}
            <Box sx={{ mb: { xs: 2, sm: 3 } }}>
              <Chip
                label={stockStatus.label}
                color={stockStatus.color}
                size="medium"
                sx={{
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  height: { xs: 28, sm: 32 }
                }}
              />
            </Box>

            {/* Tabs for description/details/reviews */}
            <Tabs value={tabValue} onChange={(_, v)=>setTabValue(v)} sx={{ mb: 2 }}>
              <Tab label="Description" />
              <Tab label="Details" />
              <Tab label="Reviews" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <Card sx={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', borderRadius: 2 }}>
                <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                  {product.description?.split('\n').map((paragraph, idx) => (
                    <Typography key={idx} variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
                      {paragraph}
                    </Typography>
                  ))}
                </CardContent>
              </Card>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Card sx={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', borderRadius: 2 }}>
                <CardContent>
                  <Stack spacing={1}>
                    <Box sx={{ display:'flex', justifyContent:'space-between' }}>
                      <Typography color="text.secondary">Brand</Typography><Typography>{product.brand||'N/A'}</Typography>
                    </Box>
                    <Box sx={{ display:'flex', justifyContent:'space-between' }}>
                      <Typography color="text.secondary">SKU</Typography><Typography>{product.sku}</Typography>
                    </Box>
                    <Box sx={{ display:'flex', justifyContent:'space-between' }}>
                      <Typography color="text.secondary">Category</Typography><Typography>{product.category?.name}</Typography>
                    </Box>
                    <Box sx={{ display:'flex', justifyContent:'space-between' }}>
                      <Typography color="text.secondary">Stock</Typography><Typography>{product.stock_quantity}</Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Card sx={{ p:2, textAlign:'center', border:'1px dashed', borderColor:'divider' }}>
                <Typography variant="body1">Reviews feature coming soon! ⭐️</Typography>
              </Card>
            </TabPanel>

            {/* Quantity Selector */}
            {product.stock_quantity > 0 && (
              <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                <Typography 
                  variant="body1" 
                  gutterBottom
                  sx={{
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    fontWeight: 'medium'
                  }}
                >
                  Quantity:
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: { xs: 1, sm: 2 },
                  flexWrap: 'wrap'
                }}>
                  <Button
                    variant="outlined"
                    size={isMobile ? "small" : "medium"}
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    sx={{ minWidth: { xs: 36, sm: 40 } }}
                  >
                    <RemoveIcon fontSize={isMobile ? "small" : "medium"} />
                  </Button>
                  <TextField
                    value={quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value >= 1 && value <= product.stock_quantity) {
                        setQuantity(value);
                      }
                    }}
                    size={isMobile ? "small" : "medium"}
                    sx={{ 
                      width: { xs: 60, sm: 80 },
                      '& input': {
                        textAlign: 'center',
                        fontSize: { xs: '0.875rem', sm: '1rem' }
                      }
                    }}
                    inputProps={{
                      min: 1,
                      max: product.stock_quantity,
                      type: 'number'
                    }}
                  />
                  <Button
                    variant="outlined"
                    size={isMobile ? "small" : "medium"}
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock_quantity}
                    sx={{ minWidth: { xs: 36, sm: 40 } }}
                  >
                    <AddIcon fontSize={isMobile ? "small" : "medium"} />
                  </Button>
                </Box>
              </Box>
            )}

            {/* Action Buttons */}
            <Stack spacing={1.5} sx={{ mt: 3 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<CartIcon />}
                        onClick={handleAddToCart}
                        disabled={product.stock_quantity === 0 || addingToCart}
                        sx={{
                            fontWeight: 'bold',
                            borderRadius: 2,
                            textTransform: 'none',
                            py: 1.2,
                            flex: 1,
                        }}
                    >
                        {addingToCart ? 'Adding...' : product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                    <Button
                        variant={isInWishlist ? 'contained' : 'outlined'}
                        color="secondary"
                        startIcon={isInWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                        onClick={handleWishlistToggle}
                        sx={{
                            fontWeight: 'bold',
                            borderRadius: 2,
                            textTransform: 'none',
                            py: 1.2,
                        }}
                    >
                        {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                    </Button>
                </Stack>
                <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    onClick={() => navigate('/products')}
                    sx={{
                        fontWeight: 'bold',
                        borderRadius: 2,
                        textTransform: 'none',
                        py: 1.2,
                    }}
                >
                    Continue Shopping
                </Button>
            </Stack>

            {/* Trust Badges & Share */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 3 }}>
                 <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Tooltip title="Free shipping on orders $50+">
                        <Chip icon={<CartIcon fontSize='small'/>} label="Free Shipping" variant="outlined" size="small" />
                    </Tooltip>
                    <Tooltip title="30-day hassle-free returns">
                        <Chip icon={<ShareIcon fontSize='small'/>} label="Easy Returns" variant="outlined" size="small" />
                    </Tooltip>
                </Stack>
                 <IconButton
                    color="default"
                    onClick={() => navigator.share && navigator.share({ url: window.location.href, title: product.name })}
                >
                    <ShareIcon />
                </IconButton>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetailPage; 