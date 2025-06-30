import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  Button,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AttachMoney,
  ShoppingCart,
  People,
  Inventory,
  Download,
  Visibility,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';

interface SalesData {
  date: string;
  revenue: number;
  orders: number;
  customers: number;
}

interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  stock: number;
}

interface TopCategory {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  products: number;
}

const AnalyticsPage: React.FC = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('30');

  // Mock data - в реальном приложении это будет из API
  const { data: salesData } = useQuery({
    queryKey: ['analytics-sales', timeRange],
    queryFn: async () => {
      // Генерируем мок данные для последних 30 дней
      const data: SalesData[] = [];
      const today = new Date();
      
      for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        data.push({
          date: date.toISOString().split('T')[0],
          revenue: Math.floor(Math.random() * 2000) + 500,
          orders: Math.floor(Math.random() * 50) + 10,
          customers: Math.floor(Math.random() * 20) + 5,
        });
      }
      
      return data;
    },
  });

  const { data: topProducts } = useQuery({
    queryKey: ['analytics-top-products'],
    queryFn: async () => {
      return [
        {
          id: '1',
          name: 'iPhone 15 Pro',
          sales: 45,
          revenue: 20250,
          stock: 12,
        },
        {
          id: '2',
          name: 'MacBook Air M2',
          sales: 32,
          revenue: 38400,
          stock: 8,
        },
        {
          id: '3',
          name: 'AirPods Pro',
          sales: 67,
          revenue: 13400,
          stock: 25,
        },
        {
          id: '4',
          name: 'iPad Air',
          sales: 28,
          revenue: 16800,
          stock: 15,
        },
        {
          id: '5',
          name: 'Apple Watch Series 9',
          sales: 39,
          revenue: 15600,
          stock: 18,
        },
      ] as TopProduct[];
    },
  });

  const { data: topCategories } = useQuery({
    queryKey: ['analytics-top-categories'],
    queryFn: async () => {
      return [
        {
          id: '1',
          name: 'Smartphones',
          sales: 156,
          revenue: 46800,
          products: 25,
        },
        {
          id: '2',
          name: 'Laptops',
          sales: 89,
          revenue: 71200,
          products: 18,
        },
        {
          id: '3',
          name: 'Accessories',
          sales: 234,
          revenue: 23400,
          products: 45,
        },
        {
          id: '4',
          name: 'Tablets',
          sales: 67,
          revenue: 40200,
          products: 12,
        },
        {
          id: '5',
          name: 'Wearables',
          sales: 98,
          revenue: 29400,
          products: 15,
        },
      ] as TopCategory[];
    },
  });

  const totalRevenue = salesData?.reduce((sum, day) => sum + day.revenue, 0) || 0;
  const totalOrders = salesData?.reduce((sum, day) => sum + day.orders, 0) || 0;
  const totalCustomers = salesData?.reduce((sum, day) => sum + day.customers, 0) || 0;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const revenueChange = 12.5; // Mock change percentage
  const ordersChange = 8.3;
  const customersChange = 15.7;
  const avgOrderChange = -2.1;

  const statsCards = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      change: revenueChange,
      icon: <AttachMoney fontSize="large" />,
      color: '#1976d2',
    },
    {
      title: 'Total Orders',
      value: totalOrders.toLocaleString(),
      change: ordersChange,
      icon: <ShoppingCart fontSize="large" />,
      color: '#388e3c',
    },
    {
      title: 'New Customers',
      value: totalCustomers.toLocaleString(),
      change: customersChange,
      icon: <People fontSize="large" />,
      color: '#f57c00',
    },
    {
      title: 'Avg Order Value',
      value: `$${avgOrderValue.toFixed(2)}`,
      change: avgOrderChange,
      icon: <TrendingUp fontSize="large" />,
      color: '#7b1fa2',
    },
  ];

  const exportData = () => {
    // В реальном приложении здесь будет экспорт данных
    console.log('Exporting analytics data...');
  };

  return (
    <AdminLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Analytics & Reports
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track your store performance and customer behavior
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Time Range</InputLabel>
              <Select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                label="Time Range"
              >
                <MenuItem value="7">Last 7 days</MenuItem>
                <MenuItem value="30">Last 30 days</MenuItem>
                <MenuItem value="90">Last 90 days</MenuItem>
                <MenuItem value="365">Last year</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={exportData}
            >
              Export
            </Button>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statsCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="text.secondary" gutterBottom fontSize="0.875rem">
                        {card.title}
                      </Typography>
                      <Typography variant="h4" component="div" sx={{ fontWeight: 600, mb: 1 }}>
                        {card.value}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {card.change >= 0 ? (
                          <TrendingUp fontSize="small" color="success" />
                        ) : (
                          <TrendingDown fontSize="small" color="error" />
                        )}
                        <Typography 
                          variant="body2" 
                          color={card.change >= 0 ? 'success.main' : 'error.main'}
                          fontWeight={600}
                        >
                          {card.change >= 0 ? '+' : ''}{card.change}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          vs last period
                        </Typography>
                      </Box>
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

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Revenue Trend
              </Typography>
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">
                  Chart component will be implemented here
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Sales Distribution
              </Typography>
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">
                  Pie chart will be implemented here
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Top Products and Categories */}
        <Grid container spacing={3}>
          <Grid item xs={12} lg={6}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Top Selling Products</Typography>
                <Button 
                  size="small" 
                  onClick={() => navigate('/admin/products')}
                >
                  View All
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="right">Sales</TableCell>
                      <TableCell align="right">Revenue</TableCell>
                      <TableCell align="right">Stock</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topProducts?.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {product.name}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Chip 
                            label={product.sales} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={600}>
                            ${product.revenue.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2">
                              {product.stock}
                            </Typography>
                            <LinearProgress 
                              variant="determinate" 
                              value={Math.min((product.stock / 50) * 100, 100)}
                              sx={{ width: 40, height: 6, borderRadius: 3 }}
                            />
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} lg={6}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Top Categories</Typography>
                <Button 
                  size="small" 
                  onClick={() => navigate('/admin/categories')}
                >
                  View All
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Category</TableCell>
                      <TableCell align="right">Sales</TableCell>
                      <TableCell align="right">Revenue</TableCell>
                      <TableCell align="right">Products</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topCategories?.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {category.name}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Chip 
                            label={category.sales} 
                            size="small" 
                            color="secondary" 
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" fontWeight={600}>
                            ${category.revenue.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="body2">
                            {category.products}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* Recent Activity */}
        <Paper sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Recent Activity
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                <ShoppingCart color="primary" />
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    New order received
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Order #1234 - $299.99 - 2 minutes ago
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                <People color="success" />
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    New customer registered
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    john@example.com - 15 minutes ago
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                <Inventory color="warning" />
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    Low stock alert
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    iPhone 15 Pro - Only 3 units left - 1 hour ago
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, bgcolor: '#f8f9fa', borderRadius: 1 }}>
                <AttachMoney color="success" />
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    Payment received
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Order #1233 - $149.50 - 2 hours ago
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default AnalyticsPage; 