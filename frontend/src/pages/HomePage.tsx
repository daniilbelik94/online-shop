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
import { publicAPI, Product, Category } from '../lib/api';
import ProductCard from '../components/ProductCard';

const HomePage: React.FC = () => {
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
        
        // Load recommended products and categories
        const [productsResponse, categoriesResponse] = await Promise.all([
          publicAPI.getRecommendedProducts(8),
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

  const handleAddToCart = (product: Product) => {
    // TODO: Implement cart functionality
    console.log('Add to cart:', product);
    // For now, just show an alert
    alert(`Product "${product.name}" added to cart!`);
  };

  const getCategoryIcon = (categorySlug: string) => {
    switch (categorySlug) {
      case 'electronics':
        return <ElectronicsIcon sx={{ fontSize: 40, mb: 1 }} />;
      case 'clothing':
        return <ClothingIcon sx={{ fontSize: 40, mb: 1 }} />;
      case 'books':
        return <BooksIcon sx={{ fontSize: 40, mb: 1 }} />;
      case 'home-garden':
        return <HomeIcon sx={{ fontSize: 40, mb: 1 }} />;
      case 'sports':
        return <SportsIcon sx={{ fontSize: 40, mb: 1 }} />;
      default:
        return <DefaultCategoryIcon sx={{ fontSize: 40, mb: 1 }} />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold',
          }}
        >
          Welcome to Our E-Commerce Store
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Discover amazing products at unbeatable prices
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2, maxWidth: 600, mx: 'auto' }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/products"
            sx={{ px: 4, py: 1.5 }}
          >
            Shop Now
          </Button>
        </Box>
      </Box>

      {/* Categories Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 3 }}>
          Popular Categories
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3} justifyContent="center">
            {categories.slice(0, 5).map((category) => (
              <Grid item xs={6} sm={4} md={2} key={category.id}>
                <Paper
                  component={Link}
                  to={`/products?category=${category.slug}`}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minHeight: 120,
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6,
                      '& .MuiSvgIcon-root': {
                        transform: 'scale(1.1)',
                        color: 'primary.main',
                      },
                    },
                  }}
                >
                  {getCategoryIcon(category.slug)}
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'medium' }}>
                    {category.name}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Recommended Products Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center" sx={{ mb: 3 }}>
          Recommended Products
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : recommendedProducts.length > 0 ? (
          <Grid container spacing={3}>
            {recommendedProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <ProductCard product={product} onAddToCart={handleAddToCart} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1" align="center" color="text.secondary">
            Loading products...
          </Typography>
        )}
        
        {recommendedProducts.length > 0 && (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/products"
            >
              View All Products
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default HomePage;