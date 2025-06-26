import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Alert,
  Grid,
  Paper,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Chip,
  Breadcrumbs,
} from '@mui/material';
import {
  Computer as ElectronicsIcon,
  Checkroom as ClothingIcon,
  MenuBook as BooksIcon,
  Home as HomeIcon,
  SportsBasketball as SportsIcon,
  Category as DefaultCategoryIcon,
  TrendingUp as TrendingIcon,
  Star as StarIcon,
  LocalOffer as OfferIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store';
import { addToCart } from '../store/slices/cartSlice';
import { fetchWishlist } from '../store/slices/wishlistSlice';
import { selectIsAuthenticated, selectUser } from '../store/slices/authSlice';
import { publicAPI, Product, Category } from '../lib/api';
import ProductSlider from '../components/ProductSlider';

const HomePage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  
  const [error, setError] = useState<string>('');
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Test API connection
        await publicAPI.getHealth();
        
        // Load recommended products, featured products and categories
        const [recommendedResponse, featuredResponse, categoriesResponse] = await Promise.all([
          publicAPI.getRecommendedProducts(8),
          publicAPI.getFeaturedProducts(6),
          publicAPI.getCategories(),
        ]);
        
        // Safe array handling
        const recommendedData = recommendedResponse.data?.data || recommendedResponse.data || [];
        const featuredData = featuredResponse.data?.data || featuredResponse.data || [];
        const categoriesData = categoriesResponse.data?.data || categoriesResponse.data || [];
        
        setRecommendedProducts(Array.isArray(recommendedData) ? recommendedData : []);
        setFeaturedProducts(Array.isArray(featuredData) ? featuredData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
        
      } catch (err) {
        setError('Failed to load data. Please ensure the backend is running.');
        console.error('API Error:', err);
        setRecommendedProducts([]);
        setFeaturedProducts([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Load wishlist when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [isAuthenticated, dispatch]);

  const handleAddToCart = async (product: Product) => {
    try {
      await dispatch(addToCart({ productId: product.id.toString(), quantity: 1 })).unwrap();
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const getCategoryIcon = (categorySlug: string) => {
    const iconProps = { 
      sx: { 
        fontSize: { xs: 40, sm: 48 }, 
        mb: 1,
        transition: 'all 0.3s ease',
        color: 'primary.main'
      } 
    };
    
    switch (categorySlug) {
      case 'electronics':
        return <ElectronicsIcon {...iconProps} />;
      case 'clothing':
        return <ClothingIcon {...iconProps} />;
      case 'books':
        return <BooksIcon {...iconProps} />;
      case 'home-garden':
        return <HomeIcon {...iconProps} />;
      case 'sports':
        return <SportsIcon {...iconProps} />;
      default:
        return <DefaultCategoryIcon {...iconProps} />;
    }
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 4 } }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <HomeIcon fontSize="small" />
          Home
        </Typography>
      </Breadcrumbs>

      {/* Welcome Section */}
      <Box sx={{ mb: { xs: 4, sm: 6 } }}>
        <Paper
          elevation={0}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 4,
            p: { xs: 4, sm: 6 },
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: 'inherit',
            }
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography 
              variant={isMobile ? 'h3' : 'h2'} 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '2.5rem', sm: '3.5rem' },
                mb: { xs: 2, sm: 3 },
                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}
            >
              {isAuthenticated ? `Welcome back, ${user?.first_name || 'User'}!` : 'Welcome to Our Store'}
            </Typography>
            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              sx={{ 
                mb: { xs: 3, sm: 4 },
                fontSize: { xs: '1.1rem', sm: '1.5rem' },
                opacity: 0.95,
                maxWidth: 600,
                mx: 'auto'
              }}
            >
              Discover amazing products at unbeatable prices with fast shipping
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/products')}
                startIcon={<ShoppingCartIcon />}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  px: { xs: 3, sm: 4 },
                  py: { xs: 1.5, sm: 2 },
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  fontWeight: 'bold',
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                  '&:hover': {
                    bgcolor: 'grey.100',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 25px rgba(0,0,0,0.3)',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Shop Now
              </Button>
              {!isAuthenticated && (
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/register')}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    px: { xs: 3, sm: 4 },
                    py: { xs: 1.5, sm: 2 },
                    fontSize: { xs: '1rem', sm: '1.1rem' },
                    fontWeight: 'bold',
                    borderRadius: 3,
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  Join Us
                </Button>
              )}
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Stats Section */}
      {!loading && (
        <Box sx={{ mb: { xs: 4, sm: 6 } }}>
          <Grid container spacing={3}>
            <Grid item xs={6} md={3}>
              <Card sx={{ borderRadius: 3, textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {recommendedProducts.length}+
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Products Available
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card sx={{ borderRadius: 3, textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    {categories.length}+
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Categories
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card sx={{ borderRadius: 3, textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Typography variant="h4" fontWeight="bold" color="warning.main">
                    24/7
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Customer Support
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card sx={{ borderRadius: 3, textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Typography variant="h4" fontWeight="bold" color="info.main">
                    Free
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Shipping Over $50
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Categories Section */}
      <Box sx={{ mb: { xs: 4, sm: 6 } }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography 
            variant={isMobile ? "h4" : "h3"} 
            component="h2" 
            gutterBottom 
            fontWeight="bold"
            sx={{ 
              mb: 2,
              fontSize: { xs: '2rem', sm: '2.5rem' }
            }}
          >
            Shop by Category
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Browse our extensive collection across multiple categories
          </Typography>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {categories.slice(0, 6).map((category) => (
              <Grid item xs={6} sm={4} md={2} key={category.id}>
                <Card
                  component={Link}
                  to={`/products?category=${category.slug}`}
                  sx={{
                    textDecoration: 'none',
                    borderRadius: 4,
                    textAlign: 'center',
                    p: 3,
                    height: '100%',
                    minHeight: 180,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease-in-out',
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                      borderColor: 'primary.main',
                      '& .MuiSvgIcon-root': {
                        transform: 'scale(1.1)',
                        color: 'primary.main',
                      },
                      '& .MuiTypography-root': {
                        color: 'primary.main',
                      }
                    },
                  }}
                >
                  {getCategoryIcon(category.slug)}
                  <Typography 
                    variant="h6" 
                    component="div" 
                    sx={{ 
                      fontWeight: 'bold',
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      textAlign: 'center',
                      lineHeight: 1.2,
                      transition: 'color 0.3s ease'
                    }}
                  >
                    {category.name}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Featured Products */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      ) : featuredProducts.length > 0 && (
        <Box sx={{ mb: { xs: 4, sm: 6 } }}>
          <ProductSlider
            products={featuredProducts}
            title="✨ Featured Products"
            onAddToCart={handleAddToCart}
            maxProducts={6}
          />
        </Box>
      )}

      {/* Recommended Products */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      ) : recommendedProducts.length > 0 && (
        <Box sx={{ mb: { xs: 4, sm: 6 } }}>
          <ProductSlider
            products={recommendedProducts}
            title="🔥 Recommended for You"
            onAddToCart={handleAddToCart}
            maxProducts={8}
          />
        </Box>
      )}

      {/* Call to Action */}
      {!loading && (recommendedProducts.length > 0 || featuredProducts.length > 0) && (
        <Box sx={{ textAlign: 'center', mt: { xs: 6, sm: 8 } }}>
          <Paper sx={{ p: { xs: 4, sm: 6 }, borderRadius: 4, bgcolor: 'grey.50' }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Ready to Shop?
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
              Explore our full collection of amazing products with great deals and fast shipping
            </Typography>
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/products"
              startIcon={<TrendingIcon />}
              sx={{
                px: 4,
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(25, 118, 210, 0.3)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 25px rgba(25, 118, 210, 0.4)',
                }
              }}
            >
              View All Products
            </Button>
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default HomePage;