import React from 'react';
import {
  Paper,
  Typography,
  Button,
  Box,
  useTheme,
} from '@mui/material';
import {
  TrendingUp as TrendingIcon,
  LocalOffer as OfferIcon,
  ShoppingCart as CartIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const CallToAction: React.FC = () => {
  const theme = useTheme();

  return (
    <Paper sx={{ 
      p: { xs: 4, sm: 6 }, 
      borderRadius: 4, 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
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
    }}>
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Typography 
          variant="h3" 
          fontWeight="bold" 
          gutterBottom
          sx={{ 
            mb: 2,
            fontSize: { xs: '2rem', sm: '2.5rem' },
            textAlign: 'center',
          }}
        >
          Ready to Start Shopping?
        </Typography>
        
        <Typography 
          variant="subtitle1" 
          sx={{ 
            mb: 4, 
            maxWidth: 600, 
            mx: 'auto', 
            opacity: 0.9,
            textAlign: 'center',
            lineHeight: 1.6,
            fontSize: { xs: '1rem', sm: '1.1rem' },
          }}
        >
          Join thousands of satisfied customers and discover amazing deals on quality products. 
          Start your shopping journey today!
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          justifyContent: 'center', 
          flexWrap: 'wrap',
          mb: 3,
        }}>
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
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.3)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.3)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Shop Now
          </Button>
          
          <Button
            variant="outlined"
            size="large"
            component={Link}
            to="/offers"
            startIcon={<OfferIcon />}
            sx={{
              px: 4,
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: 3,
              borderColor: 'rgba(255,255,255,0.5)',
              color: 'white',
              '&:hover': {
                borderColor: 'white',
                backgroundColor: 'rgba(255,255,255,0.1)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            View Offers
          </Button>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          gap: 3, 
          justifyContent: 'center', 
          flexWrap: 'wrap',
          opacity: 0.8,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CartIcon sx={{ fontSize: 20 }} />
            <Typography variant="body2">Free Shipping</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <StarIcon sx={{ fontSize: 20 }} />
            <Typography variant="body2">Quality Guaranteed</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <OfferIcon sx={{ fontSize: 20 }} />
            <Typography variant="body2">Best Prices</Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default CallToAction; 