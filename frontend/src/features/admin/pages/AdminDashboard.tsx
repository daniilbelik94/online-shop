import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import {
  People,
  Inventory,
  ShoppingCart,
  TrendingUp,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  const statsCards = [
    {
      title: 'Total Users',
      value: '1,234',
      icon: <People fontSize="large" />,
      color: '#1976d2',
      action: () => navigate('/admin/users'),
    },
    {
      title: 'Products',
      value: '567',
      icon: <Inventory fontSize="large" />,
      color: '#388e3c',
      action: () => navigate('/admin/products'),
    },
    {
      title: 'Orders',
      value: '89',
      icon: <ShoppingCart fontSize="large" />,
      color: '#f57c00',
      action: () => navigate('/admin/orders'),
    },
    {
      title: 'Revenue',
      value: '$12,345',
      icon: <TrendingUp fontSize="large" />,
      color: '#7b1fa2',
      action: () => {},
    },
  ];

  return (
    <AdminLayout>
      <Box>
        <Typography variant="h4" gutterBottom>
          Dashboard Overview
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Welcome to the admin dashboard. Here you can manage users, products, orders, and view key metrics.
        </Typography>
        
        <Grid container spacing={3}>
          {statsCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3,
                  }
                }}
                onClick={card.action}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="text.secondary" gutterBottom>
                        {card.title}
                      </Typography>
                      <Typography variant="h4" component="div">
                        {card.value}
                      </Typography>
                    </Box>
                    <Box sx={{ color: card.color }}>
                      {card.icon}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/admin/products/new')}
                  startIcon={<Inventory />}
                >
                  Add New Product
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate('/admin/users')}
                  startIcon={<People />}
                >
                  Manage Users
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate('/admin/orders')}
                  startIcon={<ShoppingCart />}
                >
                  View Recent Orders
                </Button>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • New user registered: john@example.com
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Order #1234 was shipped
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Product "iPhone 15" was updated
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • 5 new orders received today
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </AdminLayout>
  );
};

export default AdminDashboard; 