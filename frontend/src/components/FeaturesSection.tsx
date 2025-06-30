import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  Star as StarIcon,
  LocalOffer as OfferIcon,
  Support as SupportIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Nature as NatureIcon,
  Timer as TimerIcon,
} from '@mui/icons-material';

interface FeaturesSectionProps {
  isMobile: boolean;
}

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ isMobile }) => {
  const theme = useTheme();

  const features = [
    {
      icon: <ShoppingCartIcon sx={{ fontSize: 30, color: 'success.main' }} />,
      title: 'Fast Shipping',
      description: 'Free shipping on orders over $50. Get your products delivered quickly and safely.',
      bgColor: 'success.light',
      iconColor: 'success.main',
    },
    {
      icon: <StarIcon sx={{ fontSize: 30, color: 'primary.main' }} />,
      title: 'Quality Products',
      description: 'All products are carefully selected and quality-tested before shipping.',
      bgColor: 'primary.light',
      iconColor: 'primary.main',
    },
    {
      icon: <OfferIcon sx={{ fontSize: 30, color: 'warning.main' }} />,
      title: 'Best Prices',
      description: 'Competitive prices with regular discounts and special offers.',
      bgColor: 'warning.light',
      iconColor: 'warning.main',
    },
    {
      icon: <SupportIcon sx={{ fontSize: 30, color: 'info.main' }} />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support to help you with any questions.',
      bgColor: 'info.light',
      iconColor: 'info.main',
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 30, color: 'error.main' }} />,
      title: 'Secure Payments',
      description: 'Your payment information is protected with bank-level security.',
      bgColor: 'error.light',
      iconColor: 'error.main',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 30, color: 'secondary.main' }} />,
      title: 'Quick Checkout',
      description: 'Streamlined checkout process for a smooth shopping experience.',
      bgColor: 'secondary.light',
      iconColor: 'secondary.main',
    },
    {
      icon: <TimerIcon sx={{ fontSize: 30, color: 'success.main' }} />,
      title: 'Same Day Dispatch',
      description: 'Orders placed before 2 PM are shipped the same day.',
      bgColor: 'success.light',
      iconColor: 'success.main',
    },
    {
      icon: <NatureIcon sx={{ fontSize: 30, color: 'info.main' }} />,
      title: 'Eco-Friendly',
      description: 'We use sustainable packaging and support environmental initiatives.',
      bgColor: 'info.light',
      iconColor: 'info.main',
    },
  ];

  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography 
          variant={isMobile ? "h4" : "h3"} 
          fontWeight="bold" 
          gutterBottom
          sx={{ mb: 2 }}
        >
          Why Choose Us?
        </Typography>
        <Typography 
          variant="subtitle1" 
          color="text.secondary"
          sx={{ maxWidth: 600, mx: 'auto' }}
        >
          We provide the best shopping experience with these amazing benefits
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper 
              sx={{ 
                p: 3, 
                textAlign: 'center', 
                borderRadius: 3, 
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                },
              }}
            >
              <Box sx={{ 
                width: 60, 
                height: 60, 
                borderRadius: '50%',
                bgcolor: feature.bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}>
                {feature.icon}
              </Box>
              <Typography 
                variant="h6" 
                fontWeight="bold" 
                gutterBottom
                sx={{ mb: 1 }}
              >
                {feature.title}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ lineHeight: 1.5 }}
              >
                {feature.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FeaturesSection; 