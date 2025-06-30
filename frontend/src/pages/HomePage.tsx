import React, { useEffect, useState, useCallback, Suspense } from 'react';
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
  Skeleton,
  Fade,
  Zoom,
  Slide,
  Grow,
  useScrollTrigger,
  Fab,
  Snackbar,
  AlertTitle,
  Divider,
  Avatar,
  Rating,
  Badge,
  LinearProgress,
  Tooltip,
  IconButton,
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
  KeyboardArrowUp as ScrollTopIcon,
  Search as SearchIcon,
  LocalShipping as ShippingIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
  Verified as VerifiedIcon,
  FlashOn as FlashIcon,
  Favorite as FavoriteIcon,
  Visibility as ViewIcon,
  Compare as CompareIcon,
  Share as ShareIcon,
  Bookmark as BookmarkIcon,
  Timer as TimerIcon,
  Discount as DiscountIcon,
  EmojiEvents as AwardIcon,
  People as PeopleIcon,
  Speed as SpeedIcon,
  Nature as NatureIcon,
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store';
import { addToCart } from '../store/slices/cartSlice';
import { fetchWishlist } from '../store/slices/wishlistSlice';
import { selectIsAuthenticated, selectUser } from '../store/slices/authSlice';
import { publicAPI, Product, Category } from '../lib/api';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import ProductSlider from '../components/ProductSlider';
import NewsletterSignup from '../components/NewsletterSignup';
import QuickSearch from '../components/QuickSearch';
import TestimonialSlider from '../components/TestimonialSlider';
import CategoryGrid from '../components/CategoryGrid';
import StatsSection from '../components/StatsSection';
import FeaturesSection from '../components/FeaturesSection';
import HeroSection from '../components/HeroSection';
import CallToAction from '../components/CallToAction';

// Lazy load components for better performance
const LazyProductSlider = React.lazy(() => import('../components/ProductSlider'));
const LazyNewsletterSignup = React.lazy(() => import('../components/NewsletterSignup'));

interface HomePageData {
  recommendedProducts: Product[];
  featuredProducts: Product[];
  categories: Category[];
  stats: {
    totalProducts: number;
    totalCategories: number;
    totalCustomers: number;
    totalOrders: number;
  };
  testimonials: Array<{
    id: string;
    name: string;
    rating: number;
    comment: string;
    avatar?: string;
    verified: boolean;
  }>;
}

const HomePage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'info' });

  // Scroll trigger for floating action button
  const scrollTrigger = useScrollTrigger({
    threshold: 400,
  });

  useEffect(() => {
    setShowScrollTop(scrollTrigger);
  }, [scrollTrigger]);

  // Load wishlist when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [isAuthenticated, dispatch]);

  // Fetch all data with React Query for better caching and error handling
  const { data: homeData, isLoading, error } = useQuery<HomePageData>({
    queryKey: ['home-page-data'],
    queryFn: async () => {
      try {
        // Test API connection
        await publicAPI.getHealth();
        
        // Load all data in parallel
        const [recommendedResponse, featuredResponse, categoriesResponse] = await Promise.all([
          publicAPI.getRecommendedProducts(8),
          publicAPI.getFeaturedProducts(6),
          publicAPI.getCategories(),
        ]);
        
        // Safe array handling
        const recommendedData = recommendedResponse.data?.data || recommendedResponse.data || [];
        const featuredData = featuredResponse.data?.data || featuredResponse.data || [];
        const categoriesData = categoriesResponse.data?.data || categoriesResponse.data || [];
        
        // Mock stats - in real app this would come from API
        const stats = {
          totalProducts: 1500,
          totalCategories: categoriesData.length,
          totalCustomers: 25000,
          totalOrders: 150000,
        };

        // Mock testimonials - in real app this would come from API
        const testimonials = [
          {
            id: '1',
            name: 'Sarah Johnson',
            rating: 5,
            comment: 'Amazing shopping experience! Fast delivery and excellent quality products. Highly recommended!',
            avatar: '/avatars/sarah.jpg',
            verified: true,
          },
          {
            id: '2',
            name: 'Michael Chen',
            rating: 5,
            comment: 'Great prices and fantastic customer service. The website is easy to use and orders arrive quickly.',
            avatar: '/avatars/michael.jpg',
            verified: true,
          },
          {
            id: '3',
            name: 'Emily Rodriguez',
            rating: 5,
            comment: 'Love the variety of products available. Always find what I\'m looking for at competitive prices.',
            avatar: '/avatars/emily.jpg',
            verified: true,
          },
          {
            id: '4',
            name: 'David Thompson',
            rating: 5,
            comment: 'Outstanding customer support and lightning-fast shipping. Will definitely shop here again!',
            avatar: '/avatars/david.jpg',
            verified: true,
          },
        ];

        return {
          recommendedProducts: Array.isArray(recommendedData) ? recommendedData : [],
          featuredProducts: Array.isArray(featuredData) ? featuredData : [],
          categories: Array.isArray(categoriesData) ? categoriesData : [],
          stats,
          testimonials,
        };
      } catch (err) {
        console.error('API Error:', err);
        throw new Error('Failed to load data. Please ensure the backend is running.');
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });

  const handleAddToCart = async (product: Product) => {
    try {
      await dispatch(addToCart({ productId: product.id.toString(), quantity: 1 })).unwrap();
      setSnackbar({ 
        open: true, 
        message: `${product.name} added to cart!`, 
        severity: 'success' 
      });
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: 'Failed to add to cart. Please try again.', 
        severity: 'error' 
      });
      console.error('Failed to add to cart:', error);
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Online Shop - Amazing Products at Great Prices',
          text: 'Check out this amazing online store with quality products and fast shipping!',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      setSnackbar({ 
        open: true, 
        message: 'Link copied to clipboard!', 
        severity: 'info' 
      });
    }
  };

  // SEO meta data
  const seoData = {
    title: 'Online Shop - Quality Products at Great Prices | Fast Shipping',
    description: 'Discover amazing products at unbeatable prices with fast shipping. Shop electronics, clothing, books, home & garden, sports and more. Join thousands of satisfied customers!',
    keywords: 'online shop, ecommerce, electronics, clothing, books, home, garden, sports, fast shipping, quality products, best prices',
    image: '/og-image.jpg',
    url: window.location.href,
  };

  if (error) {
    return (
      <>
        <Helmet>
          <title>Error - Online Shop</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>
            <AlertTitle>Error Loading Page</AlertTitle>
            {error.message}
            <Box sx={{ mt: 2 }}>
              <Button 
                variant="outlined" 
                onClick={() => window.location.reload()}
                sx={{ mr: 1 }}
              >
                Retry
              </Button>
              <Button 
                variant="contained" 
                onClick={() => navigate('/products')}
              >
                Browse Products
              </Button>
            </Box>
          </Alert>
        </Container>
      </>
    );
  }

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords} />
        <meta name="author" content="Online Shop" />
        
        {/* Open Graph */}
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:image" content={seoData.image} />
        <meta property="og:url" content={seoData.url} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Online Shop" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.title} />
        <meta name="twitter:description" content={seoData.description} />
        <meta name="twitter:image" content={seoData.image} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Online Shop",
            "description": seoData.description,
            "url": window.location.origin,
            "potentialAction": {
              "@type": "SearchAction",
              "target": `${window.location.origin}/products?search={search_term_string}`,
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
      </Helmet>

      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 4 } }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <HomeIcon fontSize="small" />
            Home
          </Typography>
        </Breadcrumbs>

        {/* Hero Section */}
        <Fade in timeout={800}>
          <Box sx={{ mb: { xs: 4, sm: 6 } }}>
            <HeroSection 
              isAuthenticated={isAuthenticated}
              user={user}
              isMobile={isMobile}
            />
          </Box>
        </Fade>

        {/* Quick Search */}
        <Slide direction="up" in timeout={1000}>
          <Box sx={{ mb: { xs: 4, sm: 6 } }}>
            <QuickSearch />
          </Box>
        </Slide>

        {/* Stats Section */}
        {!isLoading && homeData && (
          <Grow in timeout={1200}>
            <Box sx={{ mb: { xs: 4, sm: 6 } }}>
              <StatsSection stats={homeData.stats} />
            </Box>
          </Grow>
        )}

        {/* Categories Section */}
        <Zoom in timeout={1400}>
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
            
            {isLoading ? (
              <CategoryGridSkeleton />
            ) : (
              <CategoryGrid categories={homeData?.categories || []} />
            )}
          </Box>
        </Zoom>

        {/* Featured Products */}
        {isLoading ? (
          <ProductSliderSkeleton />
        ) : homeData?.featuredProducts && homeData.featuredProducts.length > 0 && (
          <Fade in timeout={1600}>
            <Box sx={{ mb: { xs: 4, sm: 6 } }}>
              <Suspense fallback={<ProductSliderSkeleton />}>
                <LazyProductSlider
                  products={homeData.featuredProducts}
                  title="✨ Featured Products"
                  onAddToCart={handleAddToCart}
                  maxProducts={6}
                />
              </Suspense>
            </Box>
          </Fade>
        )}

        {/* Recommended Products */}
        {isLoading ? (
          <ProductSliderSkeleton />
        ) : homeData?.recommendedProducts && homeData.recommendedProducts.length > 0 && (
          <Fade in timeout={1800}>
            <Box sx={{ mb: { xs: 4, sm: 6 } }}>
              <Suspense fallback={<ProductSliderSkeleton />}>
                <LazyProductSlider
                  products={homeData.recommendedProducts}
                  title={isAuthenticated ? `🔥 Recommended for ${user?.first_name || 'You'}` : "🔥 Popular Products"}
                  onAddToCart={handleAddToCart}
                  maxProducts={8}
                />
              </Suspense>
            </Box>
          </Fade>
        )}

        {/* Features Section */}
        <Grow in timeout={2000}>
          <Box sx={{ mb: { xs: 6, sm: 8 } }}>
            <FeaturesSection isMobile={isMobile} />
          </Box>
        </Grow>

        {/* Testimonials Section */}
        {!isLoading && homeData && (
          <Slide direction="up" in timeout={2200}>
            <Box sx={{ mb: { xs: 6, sm: 8 } }}>
              <TestimonialSlider testimonials={homeData.testimonials} />
            </Box>
          </Slide>
        )}

        {/* Newsletter Signup */}
        <Fade in timeout={2400}>
          <Box sx={{ mb: { xs: 6, sm: 8 } }}>
            <Suspense fallback={<NewsletterSkeleton />}>
              <LazyNewsletterSignup />
            </Suspense>
          </Box>
        </Fade>

        {/* Call to Action */}
        {!isLoading && homeData && ((homeData.recommendedProducts && homeData.recommendedProducts.length > 0) || (homeData.featuredProducts && homeData.featuredProducts.length > 0)) && (
          <Zoom in timeout={2600}>
            <Box sx={{ textAlign: 'center', mt: { xs: 6, sm: 8 } }}>
              <CallToAction />
            </Box>
          </Zoom>
        )}
      </Container>

      {/* Floating Action Buttons */}
      <Box sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }}>
        <Fade in={showScrollTop}>
          <Fab
            color="primary"
            size="medium"
            onClick={handleScrollToTop}
            sx={{ mb: 2 }}
            aria-label="scroll to top"
          >
            <ScrollTopIcon />
          </Fab>
        </Fade>
        
        <Tooltip title="Share this page">
          <Fab
            color="secondary"
            size="medium"
            onClick={handleShare}
            aria-label="share"
          >
            <ShareIcon />
          </Fab>
        </Tooltip>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

// Skeleton components for loading states
const CategoryGridSkeleton: React.FC = () => (
  <Grid container spacing={3}>
    {[...Array(6)].map((_, index) => (
      <Grid item xs={6} sm={4} md={2} key={index}>
        <Card sx={{ borderRadius: 4, textAlign: 'center', p: 3, height: 180 }}>
          <Skeleton variant="circular" width={48} height={48} sx={{ mx: 'auto', mb: 1 }} />
          <Skeleton variant="text" width="80%" height={24} sx={{ mx: 'auto' }} />
        </Card>
      </Grid>
    ))}
  </Grid>
);

const ProductSliderSkeleton: React.FC = () => (
  <Box sx={{ mb: { xs: 4, sm: 6 } }}>
    <Skeleton variant="text" width="60%" height={40} sx={{ mx: 'auto', mb: 3 }} />
    <Grid container spacing={2}>
      {[...Array(4)].map((_, index) => (
        <Grid item xs={6} sm={4} md={3} key={index}>
          <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Skeleton variant="rectangular" height={200} />
            <CardContent>
              <Skeleton variant="text" width="100%" height={20} />
              <Skeleton variant="text" width="60%" height={20} />
              <Skeleton variant="text" width="40%" height={20} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);

const NewsletterSkeleton: React.FC = () => (
  <Paper sx={{ p: { xs: 4, sm: 6 }, borderRadius: 4, textAlign: 'center' }}>
    <Skeleton variant="text" width="50%" height={40} sx={{ mx: 'auto', mb: 2 }} />
    <Skeleton variant="text" width="80%" height={24} sx={{ mx: 'auto', mb: 3 }} />
    <Skeleton variant="rectangular" width={300} height={56} sx={{ mx: 'auto' }} />
  </Paper>
);

export default HomePage;