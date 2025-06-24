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
} from '@mui/material';
import {
  Computer as ElectronicsIcon,
  Checkroom as ClothingIcon,
  MenuBook as BooksIcon,
  Home as HomeIcon,
  SportsBasketball as SportsIcon,
  Category as DefaultCategoryIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { addToCart } from '../store/slices/cartSlice';
import { publicAPI, Product, Category } from '../lib/api';
import ProductSlider from '../components/ProductSlider';

const HomePage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const dispatch = useDispatch<AppDispatch>();
  
  const [error, setError] = useState<string>('');
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Test API connection
        await publicAPI.getHealth();
        
        // Load recommended products with increased limit and categories
        const [productsResponse, categoriesResponse] = await Promise.all([
          publicAPI.getRecommendedProducts(12), // Increased to 12
          publicAPI.getCategories(),
        ]);
        
        setRecommendedProducts(productsResponse.data.data || productsResponse.data);
        setCategories(categoriesResponse.data.data || categoriesResponse.data || []);
        
      } catch (err) {
        setError('Failed to load data. Please ensure the backend is running.');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAddToCart = async (product: Product) => {
    try {
      await dispatch(addToCart({ productId: product.id, quantity: 1 })).unwrap();
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to add to cart:', error);
      // You could show an error message here
    }
  };

  const getCategoryIcon = (categorySlug: string) => {
    const iconProps = { 
      sx: { 
        fontSize: { xs: 32, sm: 40 }, 
        mb: 1,
        transition: 'all 0.3s ease'
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
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 4 } }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          borderRadius: 3,
          p: { xs: 3, sm: 6 },
          mb: { xs: 4, sm: 6 },
          textAlign: 'center',
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
        }}
      >
        <Typography 
          variant={isMobile ? 'h3' : 'h2'} 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            fontSize: { xs: '2rem', sm: '3.5rem' },
            mb: { xs: 2, sm: 3 }
          }}
        >
          Welcome to Our Store
        </Typography>
        <Typography
          variant={isMobile ? 'body1' : 'h5'}
          sx={{ 
            mb: { xs: 3, sm: 4 },
            fontSize: { xs: '1rem', sm: '1.5rem' },
            opacity: 0.9
          }}
        >
          Discover amazing products at unbeatable prices
        </Typography>
        <Button
          variant="contained"
          size="large"
          component={Link}
          to="/products"
          sx={{
            bgcolor: 'white',
            color: 'primary.main',
            px: { xs: 3, sm: 4 },
            py: { xs: 1.5, sm: 2 },
            fontSize: { xs: '1rem', sm: '1.1rem' },
            fontWeight: 'bold',
            '&:hover': {
              bgcolor: 'grey.100',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s ease'
          }}
        >
          Shop Now
        </Button>
      </Box>

      {/* Categories Section */}
      <Box sx={{ mb: { xs: 4, sm: 6 } }}>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          component="h2" 
          gutterBottom 
          align="center" 
          sx={{ 
            mb: { xs: 2, sm: 3 },
            fontSize: { xs: '1.5rem', sm: '2.125rem' }
          }}
        >
          Popular Categories
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={{ xs: 2, sm: 3 }} justifyContent="center">
            {categories.slice(0, 5).map((category) => (
              <Grid item xs={6} sm={4} md={2} key={category.id}>
                <Paper
                  component={Link}
                  to={`/products?category=${category.slug}`}
                  sx={{
                    p: { xs: 2, sm: 3 },
                    textAlign: 'center',
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minHeight: { xs: 100, sm: 120 },
                    transition: 'all 0.3s ease-in-out',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: { xs: 'translateY(-4px)', sm: 'translateY(-8px)' },
                      boxShadow: { xs: 4, sm: 6 },
                      '& .MuiSvgIcon-root': {
                        transform: 'scale(1.1)',
                        color: 'primary.main',
                      },
                    },
                    '&:active': {
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  {getCategoryIcon(category.slug)}
                  <Typography 
                    variant={isMobile ? "body1" : "h6"} 
                    component="div" 
                    sx={{ 
                      fontWeight: 'medium',
                      fontSize: { xs: '0.875rem', sm: '1.25rem' },
                      textAlign: 'center',
                      lineHeight: 1.2
                    }}
                  >
                    {category.name}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Recommended Products Slider */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      ) : (
        <ProductSlider
          products={recommendedProducts}
          title="Recommended Products"
          onAddToCart={handleAddToCart}
          maxProducts={12}
        />
      )}

      {/* Call to Action */}
      {recommendedProducts.length > 0 && (
        <Box sx={{ textAlign: 'center', mt: { xs: 4, sm: 6 } }}>
          <Button
            variant="outlined"
            size={isMobile ? "medium" : "large"}
            component={Link}
            to="/products"
            sx={{
              px: { xs: 3, sm: 4 },
              py: { xs: 1, sm: 1.5 },
              fontSize: { xs: '0.9rem', sm: '1rem' },
              fontWeight: 'medium',
              borderRadius: 2
            }}
          >
            View All Products
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default HomePage;