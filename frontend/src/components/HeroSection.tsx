import React from 'react';
import {
  Paper,
  Typography,
  Button,
  Box,
  useTheme,
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  TrendingUp as TrendingIcon,
  LocalOffer as OfferIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';

interface HeroSectionProps {
  isAuthenticated: boolean;
  user?: User;
  isMobile: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
  isAuthenticated, 
  user, 
  isMobile 
}) => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
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
  );
};

export default HeroSection; 