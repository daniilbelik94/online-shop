import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import {
  People,
  Inventory,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Visibility,
  Edit,
  Warning,
  CheckCircle,
  Schedule,
  AttachMoney,
  LocalShipping,
  Cancel,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { adminAPI } from '../../../lib/api';
import AdminLayout from '../components/AdminLayout';

interface DashboardStats {
  total_users: number;
  total_products: number;
  total_orders: number;
  total_revenue: number;
  new_users_today: number;
  new_orders_today: number;
  revenue_today: number;
  low_stock_products: number;
}

interface RecentOrder {
  id: string;
  order_number: string;
  customer_name: string;
  total: number;
  status: string;
  created_at: string;
}

interface LowStockProduct {
  id: string;
  name: string;
  stock_quantity: number;
  sku: string;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  // Fetch dashboard data
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-dashboard-stats'],
    queryFn: async () => {
      // В реальном приложении здесь будет API вызов
      // Пока используем мок данные
      return {
        total_users: 1247,
        total_products: 567,
        total_orders: 892,
        total_revenue: 45678.90,
        new_users_today: 23,
        new_orders_today: 45,
        revenue_today: 2345.67,
        low_stock_products: 12,
      } as DashboardStats;
    },
  });

  const { data: recentOrders, isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-recent-orders'],
    queryFn: async () => {
      // Мок данные для последних заказов
      return [
        {
          id: '1',
          order_number: '#ORD-001',
          customer_name: 'John Doe',
          total: 299.99,
          status: 'pending',
          created_at: '2024-01-15T10:30:00Z',
        },
        {
          id: '2',
          order_number: '#ORD-002',
          customer_name: 'Jane Smith',
          total: 149.50,
          status: 'shipped',
          created_at: '2024-01-15T09:15:00Z',
        },
        {
          id: '3',
          order_number: '#ORD-003',
          customer_name: 'Mike Johnson',
          total: 599.99,
          status: 'delivered',
          created_at: '2024-01-15T08:45:00Z',
        },
      ] as RecentOrder[];
    },
  });

  const { data: lowStockProducts, isLoading: stockLoading } = useQuery({
    queryKey: ['admin-low-stock'],
    queryFn: async () => {
      // Мок данные для товаров с низким запасом
      return [
        {
          id: '1',
          name: 'iPhone 15 Pro',
          stock_quantity: 3,
          sku: 'IPH15-PRO-256',
        },
        {
          id: '2',
          name: 'MacBook Air M2',
          stock_quantity: 5,
          sku: 'MBA-M2-512',
        },
        {
          id: '3',
          name: 'AirPods Pro',
          stock_quantity: 2,
          sku: 'APP-2ND-GEN',
        },
      ] as LowStockProduct[];
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'shipped': return 'primary';
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Schedule />;
      case 'processing': return <Edit />;
      case 'shipped': return <LocalShipping />;
      case 'delivered': return <CheckCircle />;
      case 'cancelled': return <Cancel />;
      default: return <Schedule />;
    }
  };

  const statsCards = [
    {
      title: 'Total Users',
      value: stats?.total_users?.toLocaleString() || '0',
      change: `+${stats?.new_users_today || 0} today`,
      icon: <People fontSize="large" />,
      color: '#1976d2',
      action: () => navigate('/admin/users'),
    },
    {
      title: 'Products',
      value: stats?.total_products?.toLocaleString() || '0',
      change: `${stats?.low_stock_products || 0} low stock`,
      icon: <Inventory fontSize="large" />,
      color: '#388e3c',
      action: () => navigate('/admin/products'),
    },
    {
      title: 'Orders',
      value: stats?.total_orders?.toLocaleString() || '0',
      change: `+${stats?.new_orders_today || 0} today`,
      icon: <ShoppingCart fontSize="large" />,
      color: '#f57c00',
      action: () => navigate('/admin/orders'),
    },
    {
      title: 'Revenue',
      value: `$${stats?.total_revenue?.toLocaleString() || '0'}`,
      change: `+$${stats?.revenue_today?.toLocaleString() || '0'} today`,
      icon: <AttachMoney fontSize="large" />,
      color: '#7b1fa2',
      action: () => navigate('/admin/analytics'),
    },
  ];

  if (statsLoading) {
    return (
      <AdminLayout>
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Dashboard Overview
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome back! Here's what's happening with your store today.
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => navigate('/admin/analytics')}
            startIcon={<TrendingUp />}
          >
            View Analytics
          </Button>
        </Box>
        
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statsCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  }
                }}
                onClick={card.action}
              >
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box>
                      <Typography color="text.secondary" gutterBottom fontSize="0.875rem">
                        {card.title}
                      </Typography>
                      <Typography variant="h4" component="div" sx={{ fontWeight: 600, mb: 1 }}>
                        {card.value}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: card.change.includes('+') ? 'success.main' : 'warning.main',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5
                        }}
                      >
                        {card.change.includes('+') ? <TrendingUp fontSize="small" /> : <Warning fontSize="small" />}
                        {card.change}
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

        {/* Alerts */}
        {stats?.low_stock_products && stats.low_stock_products > 0 && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <strong>Low Stock Alert:</strong> {stats.low_stock_products} products are running low on stock. 
            <Button 
              size="small" 
              sx={{ ml: 2 }}
              onClick={() => navigate('/admin/products')}
            >
              View Products
            </Button>
          </Alert>
        )}

        {/* Tabs for different sections */}
        <Paper sx={{ mb: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Recent Orders" />
            <Tab label="Low Stock Products" />
            <Tab label="Quick Actions" />
          </Tabs>
        </Paper>

        {/* Recent Orders Tab */}
        {activeTab === 0 && (
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Recent Orders</Typography>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/admin/orders')}
                size="small"
              >
                View All Orders
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order #</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentOrders?.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.order_number}</TableCell>
                      <TableCell>{order.customer_name}</TableCell>
                      <TableCell>${order.total.toFixed(2)}</TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(order.status)}
                          label={order.status}
                          color={getStatusColor(order.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(order.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Tooltip title="View Order">
                          <IconButton 
                            size="small"
                            onClick={() => navigate(`/admin/orders/${order.id}`)}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* Low Stock Products Tab */}
        {activeTab === 1 && (
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Low Stock Products</Typography>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/admin/products')}
                size="small"
              >
                Manage Products
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product Name</TableCell>
                    <TableCell>SKU</TableCell>
                    <TableCell>Stock Level</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lowStockProducts?.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.sku}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography 
                            color={product.stock_quantity < 5 ? 'error' : 'warning.main'}
                            fontWeight={600}
                          >
                            {product.stock_quantity}
                          </Typography>
                          <LinearProgress 
                            variant="determinate" 
                            value={Math.min((product.stock_quantity / 10) * 100, 100)}
                            sx={{ width: 60, height: 6, borderRadius: 3 }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Edit Product">
                          <IconButton 
                            size="small"
                            onClick={() => navigate(`/admin/products/manage?edit=${product.id}`)}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* Quick Actions Tab */}
        {activeTab === 2 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Quick Actions
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Button 
                    variant="contained" 
                    onClick={() => navigate('/admin/products/manage')}
                    startIcon={<Inventory />}
                    fullWidth
                  >
                    Add New Product
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={() => navigate('/admin/offers')}
                    startIcon={<LocalOffer />}
                    fullWidth
                  >
                    Create Offer
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={() => navigate('/admin/categories')}
                    startIcon={<Inventory />}
                    fullWidth
                  >
                    Manage Categories
                  </Button>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  System Status
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">Database</Typography>
                    <Chip label="Online" color="success" size="small" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">Payment Gateway</Typography>
                    <Chip label="Online" color="success" size="small" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">Email Service</Typography>
                    <Chip label="Online" color="success" size="small" />
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body2">Storage</Typography>
                    <Chip label="85% Used" color="warning" size="small" />
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>
    </AdminLayout>
  );
};

export default AdminDashboard; 