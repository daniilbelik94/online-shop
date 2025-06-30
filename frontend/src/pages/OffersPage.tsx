import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  Box,
  Skeleton,
  Alert,
  Tabs,
  Tab,
  Paper,
  Divider,
  Stack,
  IconButton,
  Tooltip,
  Badge,
  LinearProgress,
  useTheme,
  useMediaQuery,
  Fade,
  Zoom,
} from '@mui/material';
import {
  LocalOffer as OfferIcon,
  FlashOn as FlashIcon,
  Schedule as ScheduleIcon,
  School as StudentIcon,
  NewReleases as NewIcon,
  Clear as ClearanceIcon,
  Timer as TimerIcon,
  Percent as PercentIcon,
  AttachMoney as MoneyIcon,
  Star as StarIcon,
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  Visibility as ViewIcon,
  TrendingUp as TrendingIcon,
  LocalShipping as ShippingIcon,
  Verified as VerifiedIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Info as InfoIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

interface Offer {
  id: string;
  title: string;
  description: string;
  type: 'flash' | 'weekend' | 'clearance' | 'student' | 'new';
  discount_percent: number;
  min_order_amount?: number;
  max_discount_amount?: number;
  product_id?: string;
  category_id?: string;
  is_active: boolean;
  is_limited: boolean;
  max_uses?: number;
  used_count: number;
  start_date?: string;
  end_date?: string;
  image_url?: string;
  conditions: any[];
  created_at: string;
  updated_at: string;
}

const OffersPage: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [imageLoading, setImageLoading] = useState<{ [key: string]: boolean }>({});
  const [imageError, setImageError] = useState<{ [key: string]: boolean }>({});
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/offers');
      if (response.data.success) {
        setOffers(response.data.data);
        // Initialize image loading states
        const loadingStates: { [key: string]: boolean } = {};
        const errorStates: { [key: string]: boolean } = {};
        response.data.data.forEach((offer: Offer) => {
          loadingStates[offer.id] = true;
          errorStates[offer.id] = false;
        });
        setImageLoading(loadingStates);
        setImageError(errorStates);
      } else {
        setError('Failed to load offers');
      }
    } catch (err) {
      console.error('Error fetching offers:', err);
      setError('Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'flash':
        return <FlashIcon sx={{ color: 'error.main' }} />;
      case 'weekend':
        return <ScheduleIcon sx={{ color: 'primary.main' }} />;
      case 'clearance':
        return <ClearanceIcon sx={{ color: 'success.main' }} />;
      case 'student':
        return <StudentIcon sx={{ color: 'secondary.main' }} />;
      case 'new':
        return <NewIcon sx={{ color: 'warning.main' }} />;
      default:
        return <OfferIcon sx={{ color: 'grey.500' }} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'flash':
        return 'error';
      case 'weekend':
        return 'primary';
      case 'clearance':
        return 'success';
      case 'student':
        return 'secondary';
      case 'new':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'flash':
        return 'Flash Sale';
      case 'weekend':
        return 'Weekend Special';
      case 'clearance':
        return 'Clearance';
      case 'student':
        return 'Student Discount';
      case 'new':
        return 'New Arrival';
      default:
        return 'Special Offer';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeRemaining = (endDate: string) => {
    const now = new Date().getTime();
    const end = new Date(endDate).getTime();
    const diff = end - now;

    if (diff <= 0) return 'Expired';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const handleImageLoad = (offerId: string) => {
    setImageLoading(prev => ({ ...prev, [offerId]: false }));
  };

  const handleImageError = (offerId: string) => {
    setImageError(prev => ({ ...prev, [offerId]: true }));
    setImageLoading(prev => ({ ...prev, [offerId]: false }));
  };

  const getOfferImage = (offer: Offer) => {
    if (imageError[offer.id]) {
      return '/placeholder-product.jpg';
    }
    return offer.image_url || '/placeholder-product.jpg';
  };

  const filteredOffers = selectedType === 'all' 
    ? offers 
    : offers.filter(offer => offer.type === selectedType);

  const typeFilters = [
    { value: 'all', label: 'All Offers', icon: <OfferIcon />, count: offers.length },
    { value: 'flash', label: 'Flash Sales', icon: <FlashIcon />, count: offers.filter(o => o.type === 'flash').length },
    { value: 'weekend', label: 'Weekend Specials', icon: <ScheduleIcon />, count: offers.filter(o => o.type === 'weekend').length },
    { value: 'clearance', label: 'Clearance', icon: <ClearanceIcon />, count: offers.filter(o => o.type === 'clearance').length },
    { value: 'student', label: 'Student Discounts', icon: <StudentIcon />, count: offers.filter(o => o.type === 'student').length },
    { value: 'new', label: 'New Arrivals', icon: <NewIcon />, count: offers.filter(o => o.type === 'new').length }
  ];

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width="60%" height={60} />
          <Skeleton variant="text" width="40%" height={30} />
        </Box>
        
        <Grid container spacing={3}>
          {[...Array(6)].map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Card sx={{ height: '100%' }}>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" height={32} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" height={20} />
                  <Box sx={{ mt: 2 }}>
                    <Skeleton variant="rectangular" height={40} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={fetchOffers}>
              Try Again
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}
        >
          Special Offers & Deals
        </Typography>
        <Typography 
          variant="h6" 
          color="text.secondary" 
          sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}
        >
          Discover amazing discounts, flash sales, and exclusive promotions. 
          Don't miss out on these limited-time offers!
        </Typography>
        
        {/* Stats */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, mb: 4 }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="primary.main" fontWeight="bold">
              {offers.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Offers
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="success.main" fontWeight="bold">
              {offers.filter(o => o.type === 'flash').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Flash Sales
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" color="warning.main" fontWeight="bold">
              {offers.filter(o => o.is_limited && o.max_uses && (o.max_uses - o.used_count) < 10).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Ending Soon
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Type Filters */}
      <Paper sx={{ mb: 4, p: 2 }}>
        <Tabs 
          value={selectedType} 
          onChange={(_, newValue) => setSelectedType(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              minHeight: 64,
              textTransform: 'none',
              fontSize: '0.9rem',
              fontWeight: 500,
            }
          }}
        >
          {typeFilters.map((filter) => (
            <Tab
              key={filter.value}
              value={filter.value}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {filter.icon}
                  <span>{filter.label}</span>
                  {filter.count > 0 && (
                    <Chip 
                      label={filter.count} 
                      size="small" 
                      color="primary"
                      sx={{ minWidth: 20, height: 20, fontSize: '0.7rem' }}
                    />
                  )}
                </Box>
              }
            />
          ))}
        </Tabs>
      </Paper>

      {/* Offers Grid */}
      {filteredOffers.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <OfferIcon sx={{ fontSize: 80, color: 'grey.400', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No offers available
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {selectedType === 'all' 
              ? 'Check back soon for new offers!' 
              : `No ${getTypeLabel(selectedType).toLowerCase()} available at the moment.`
            }
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredOffers.map((offer) => (
            <Grid item xs={12} sm={6} md={4} key={offer.id}>
              <Fade in timeout={500}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: '1px solid',
                    borderColor: 'divider',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                      borderColor: 'primary.main',
                    },
                  }}
                >
                  {/* Image Section */}
                  <Box sx={{ position: 'relative', height: 200 }}>
                    {imageLoading[offer.id] && (
                      <Skeleton 
                        variant="rectangular" 
                        width="100%" 
                        height="100%" 
                        sx={{ position: 'absolute', top: 0, left: 0 }}
                      />
                    )}
                    <CardMedia
                      component="img"
                      image={getOfferImage(offer)}
                      alt={offer.title}
                      onLoad={() => handleImageLoad(offer.id)}
                      onError={() => handleImageError(offer.id)}
                      sx={{
                        height: '100%',
                        width: '100%',
                        objectFit: 'cover',
                        backgroundColor: '#f5f5f5',
                        display: imageLoading[offer.id] ? 'none' : 'block',
                      }}
                    />
                    
                    {/* Discount Badge */}
                    <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
                      <Chip
                        icon={<PercentIcon />}
                        label={`${offer.discount_percent}% OFF`}
                        color="error"
                        sx={{ 
                          fontWeight: 'bold',
                          backgroundColor: 'error.main',
                          color: 'white',
                          '& .MuiChip-icon': { color: 'white' }
                        }}
                      />
                    </Box>

                    {/* Type Badge */}
                    <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                      <Chip
                        icon={getTypeIcon(offer.type)}
                        label={getTypeLabel(offer.type)}
                        color={getTypeColor(offer.type) as any}
                        size="small"
                        variant="outlined"
                        sx={{ 
                          backgroundColor: 'rgba(255,255,255,0.9)',
                          backdropFilter: 'blur(10px)'
                        }}
                      />
                    </Box>

                    {/* Timer for flash sales */}
                    {offer.type === 'flash' && offer.end_date && (
                      <Box sx={{ position: 'absolute', bottom: 12, left: 12, right: 12 }}>
                        <Paper
                          sx={{
                            p: 1.5,
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            color: 'white',
                            backdropFilter: 'blur(10px)'
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <TimerIcon sx={{ fontSize: 16 }} />
                              <Typography variant="caption">Ends in:</Typography>
                            </Box>
                            <Typography variant="caption" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                              {getTimeRemaining(offer.end_date)}
                            </Typography>
                          </Box>
                        </Paper>
                      </Box>
                    )}

                    {/* Limited uses indicator */}
                    {offer.is_limited && offer.max_uses && (
                      <Box sx={{ position: 'absolute', bottom: offer.type === 'flash' ? 70 : 12, left: 12, right: 12 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <WarningIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                          <Typography variant="caption" color="warning.main" fontWeight="bold">
                            {offer.max_uses - offer.used_count} uses remaining
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={((offer.max_uses - offer.used_count) / offer.max_uses) * 100}
                          color="warning"
                          sx={{ mt: 0.5, height: 4, borderRadius: 2 }}
                        />
                      </Box>
                    )}
                  </Box>

                  {/* Content Section */}
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography 
                      variant="h6" 
                      component="h3" 
                      gutterBottom
                      sx={{ 
                        fontWeight: 'bold',
                        lineHeight: 1.3,
                        mb: 2
                      }}
                    >
                      {offer.title}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ mb: 3, lineHeight: 1.6 }}
                    >
                      {offer.description}
                    </Typography>

                    {/* Offer Details */}
                    <Stack spacing={1.5} sx={{ mb: 3 }}>
                      {offer.min_order_amount && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <MoneyIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            Min. order: ${offer.min_order_amount}
                          </Typography>
                        </Box>
                      )}
                      
                      {offer.max_discount_amount && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PercentIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            Max. discount: ${offer.max_discount_amount}
                          </Typography>
                        </Box>
                      )}

                      {offer.start_date && offer.end_date && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ScheduleIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(offer.start_date)} - {formatDate(offer.end_date)}
                          </Typography>
                        </Box>
                      )}

                      {/* Conditions */}
                      {offer.conditions && Object.keys(offer.conditions).length > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <InfoIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            Terms & conditions apply
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                  </CardContent>

                  {/* Actions */}
                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      onClick={() => {
                        if (offer.product_id) {
                          navigate(`/products/${offer.product_id}`);
                        } else if (offer.category_id) {
                          navigate(`/products?category=${offer.category_id}`);
                        } else {
                          navigate('/products');
                        }
                      }}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 'bold',
                        py: 1.5,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                        }
                      }}
                    >
                      Shop Now
                      <ArrowIcon sx={{ ml: 1, fontSize: 16 }} />
                    </Button>
                  </CardActions>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Newsletter Section */}
      <Box sx={{ mt: 8 }}>
        <Paper
          sx={{
            p: { xs: 4, md: 6 },
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 3,
            textAlign: 'center'
          }}
        >
          <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
            Never Miss a Deal!
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Subscribe to our newsletter and be the first to know about exclusive offers, 
            flash sales, and special promotions.
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            gap: 2, 
            maxWidth: 500, 
            mx: 'auto' 
          }}>
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: 'white',
                color: 'primary.main',
                fontWeight: 'bold',
                textTransform: 'none',
                px: 4,
                py: 1.5,
                '&:hover': {
                  backgroundColor: 'grey.100',
                }
              }}
            >
              Subscribe to Newsletter
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default OffersPage;
