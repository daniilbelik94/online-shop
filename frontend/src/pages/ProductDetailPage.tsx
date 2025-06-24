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
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as CartIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { addToCart } from '../store/slices/cartSlice';
import { publicAPI, Product } from '../lib/api';
import ImageGallery from '../components/ImageGallery';

const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch<AppDispatch>();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

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
        <Grid item xs={12} md={6}>
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
        <Grid item xs={12} md={6}>
          <Box sx={{ px: { xs: 1, sm: 0 } }}>
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

            {/* Price */}
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

            {/* Description */}
            <Card 
              sx={{ 
                mb: { xs: 2, sm: 3 }, 
                backgroundColor: '#f8f9fa',
                border: '1px solid #e9ecef',
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{
                    fontSize: { xs: '1rem', sm: '1.125rem' },
                    fontWeight: 'bold',
                    color: 'primary.main',
                    mb: 2
                  }}
                >
                  Description
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    lineHeight: 1.8,
                    color: 'text.primary',
                    whiteSpace: 'pre-line', // Preserve line breaks
                    '& p': {
                      marginBottom: '1em',
                    }
                  }}
                  component="div"
                >
                  {product.description?.split('\n').map((paragraph, index) => (
                    <Typography
                      key={index}
                      variant="body1"
                      paragraph
                      sx={{
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        lineHeight: 1.8,
                        mb: paragraph.trim() ? 1.5 : 0
                      }}
                    >
                      {paragraph}
                    </Typography>
                  ))}
                </Typography>
              </CardContent>
            </Card>

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

            {/* Add to Cart Button */}
            <Box sx={{ 
              display: 'flex', 
              gap: { xs: 1, sm: 2 },
              flexDirection: { xs: 'column', sm: 'row' }
            }}>
              <Button
                variant="contained"
                size={isMobile ? "medium" : "large"}
                startIcon={<CartIcon />}
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0 || addingToCart}
                sx={{ 
                  flex: 1,
                  py: { xs: 1, sm: 1.5 },
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                {addingToCart ? 'Adding...' : 
                 product.stock_quantity === 0 ? 'Out of Stock' : 
                 `Add ${quantity} to Cart`}
              </Button>
              
              <Button
                variant="outlined"
                size={isMobile ? "medium" : "large"}
                onClick={() => navigate('/products')}
                sx={{ 
                  minWidth: { xs: 'auto', sm: 140 },
                  py: { xs: 1, sm: 1.5 },
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                Continue Shopping
              </Button>
            </Box>

            {/* Additional Product Info */}
            <Box sx={{ mt: { xs: 3, sm: 4 } }}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                  fontWeight: 'bold'
                }}
              >
                Product Details
              </Typography>
              <Box sx={{ 
                display: 'grid', 
                gap: { xs: 0.5, sm: 1 },
                fontSize: { xs: '0.875rem', sm: '1rem' }
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Brand:
                  </Typography>
                  <Typography variant="body2">
                    {product.brand || 'N/A'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    SKU:
                  </Typography>
                  <Typography variant="body2">
                    {product.sku}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Stock:
                  </Typography>
                  <Typography variant="body2">
                    {product.stock_quantity} units
                  </Typography>
                </Box>
                {product.category && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      Category:
                    </Typography>
                    <Typography variant="body2">
                      {product.category.name}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetailPage; 