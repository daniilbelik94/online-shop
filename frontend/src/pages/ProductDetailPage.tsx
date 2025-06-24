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
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as CartIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { publicAPI, Product } from '../lib/api';

const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
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
        setProduct(response.data);
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
      // TODO: Implement actual cart functionality
      console.log('Adding to cart:', { product, quantity });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(`${quantity} pcs of "${product.name}" added to cart!`);
    } catch (err) {
      console.error('Error adding to cart:', err);
    } finally {
      setAddingToCart(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { label: 'Out of Stock', color: 'error' as const };
    if (quantity <= 5) return { label: `Only ${quantity} left`, color: 'warning' as const };
    return { label: 'In Stock', color: 'success' as const };
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Product not found'}
        </Alert>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/products')}
          variant="outlined"
        >
          Back to Catalog
        </Button>
      </Container>
    );
  }

  const stockStatus = getStockStatus(product.stock_quantity);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
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
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <img
              src={product.image_url || '/api/placeholder/500/500'}
              alt={product.name}
              style={{
                width: '100%',
                maxWidth: 500,
                height: 'auto',
                borderRadius: 8,
              }}
            />
          </Paper>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Box>
            {/* Product Name and Brand */}
            <Typography variant="h3" component="h1" gutterBottom>
              {product.name}
            </Typography>
            
            {product.brand && (
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Brand: {product.brand}
              </Typography>
            )}

            {/* SKU */}
            <Typography variant="body2" color="text.secondary" gutterBottom>
              SKU: {product.sku}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Price */}
            <Typography variant="h4" color="primary" fontWeight="bold" gutterBottom>
              {formatPrice(product.price)}
            </Typography>

            {/* Stock Status */}
            <Box sx={{ mb: 3 }}>
              <Chip
                label={stockStatus.label}
                color={stockStatus.color}
                size="medium"
              />
            </Box>

            {/* Quantity Selector */}
            {product.stock_quantity > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" gutterBottom>
                  Quantity:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <RemoveIcon />
                  </Button>
                  <TextField
                    value={quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value >= 1 && value <= product.stock_quantity) {
                        setQuantity(value);
                      }
                    }}
                    size="small"
                    sx={{ width: 80 }}
                    inputProps={{ 
                      style: { textAlign: 'center' },
                      min: 1,
                      max: product.stock_quantity 
                    }}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock_quantity}
                  >
                    <AddIcon />
                  </Button>
                </Box>
              </Box>
            )}

            {/* Add to Cart Button */}
            <Box sx={{ mb: 3 }}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={addingToCart ? <CircularProgress size={20} /> : <CartIcon />}
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0 || addingToCart}
                sx={{ py: 1.5 }}
              >
                {addingToCart 
                  ? 'Adding...' 
                  : product.stock_quantity === 0 
                    ? 'Out of Stock' 
                    : `Add to Cart for ${formatPrice(product.price * quantity)}`
                }
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Product Description */}
            <Typography variant="h6" gutterBottom>
              Product Description
            </Typography>
            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>

            {/* Product Details */}
            <Paper sx={{ p: 2, mt: 3, backgroundColor: 'grey.50' }}>
              <Typography variant="h6" gutterBottom>
                Specifications
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Category:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    {product.category?.name || 'Not specified'}
                  </Typography>
                </Grid>
                
                {product.brand && (
                  <>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Brand:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        {product.brand}
                      </Typography>
                    </Grid>
                  </>
                )}
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    SKU:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    {product.sku}
                  </Typography>
                </Grid>
                
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    In Stock:
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2">
                    {product.stock_quantity} pcs
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </Grid>
      </Grid>

      {/* Back Button */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/products')}
          variant="outlined"
          size="large"
        >
          Back to Catalog
        </Button>
      </Box>
    </Container>
  );
};

export default ProductDetailPage; 