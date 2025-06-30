import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Category as CategoryIcon,
  People as PeopleIcon,
  LocalShipping as ShippingIcon,
} from '@mui/icons-material';

interface StatsSectionProps {
  stats: {
    totalProducts: number;
    totalCategories: number;
    totalCustomers: number;
    totalOrders: number;
  };
}

const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
  const theme = useTheme();

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const statItems = [
    {
      icon: <CartIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      value: formatNumber(stats.totalProducts),
      label: 'Products Available',
      color: 'primary.main',
    },
    {
      icon: <CategoryIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      value: formatNumber(stats.totalCategories),
      label: 'Categories',
      color: 'success.main',
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
      value: formatNumber(stats.totalCustomers),
      label: 'Happy Customers',
      color: 'warning.main',
    },
    {
      icon: <ShippingIcon sx={{ fontSize: 40, color: 'info.main' }} />,
      value: formatNumber(stats.totalOrders),
      label: 'Orders Delivered',
      color: 'info.main',
    },
  ];

  return (
    <Grid container spacing={3}>
      {statItems.map((item, index) => (
        <Grid item xs={6} md={3} key={index}>
          <Card 
            sx={{ 
              borderRadius: 3, 
              textAlign: 'center', 
              p: 2,
              height: '100%',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
              },
            }}
          >
            <CardContent>
              <Box sx={{ mb: 1 }}>
                {item.icon}
              </Box>
              <Typography 
                variant="h4" 
                fontWeight="bold" 
                sx={{ 
                  color: item.color,
                  mb: 0.5,
                  fontSize: { xs: '1.5rem', sm: '2rem' }
                }}
              >
                {item.value}+
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  fontSize: { xs: '0.8rem', sm: '0.875rem' },
                  lineHeight: 1.2,
                }}
              >
                {item.label}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default StatsSection; 