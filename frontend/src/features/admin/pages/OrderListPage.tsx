import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
  Skeleton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Tooltip,
  Badge,
  LinearProgress,
  useTheme,
  useMediaQuery,
  Fade,
  Zoom,
  Divider,
  Stack,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Payment as PaymentIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as CheckIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  KeyboardReturn as ReturnIcon,
  TrendingUp as TrendingIcon,
  AttachMoney as MoneyIcon,
  Receipt as ReceiptIcon,
  Schedule as ScheduleIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  ExpandMore as ExpandMoreIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  LocalOffer as OfferIcon,
  Discount as DiscountIcon,
} from '@mui/icons-material';
import { api } from '../../../lib/api';

interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_image?: string;
  quantity: number;
  price: number;
  total: number;
}

interface Order {
  id: string;
  user_id: string;
  user_name?: string;
  user_email?: string;
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
  payment_method: string;
  shipping_method: string;
  tracking_number?: string;
  transaction_id?: string;
  subtotal: number;
  tax_amount: number;
  shipping_cost: number;
  discount_amount: number;
  total_amount: number;
  shipping_address: string;
  billing_address: string;
  customer_notes?: string;
  payment_notes?: string;
  created_at: string;
  updated_at: string;
  shipped_at?: string;
  delivered_at?: string;
  cancelled_at?: string;
  return_requested_at?: string;
  return_completed_at?: string;
  items: OrderItem[];
}

const OrderListPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState('');
  const [editingPaymentStatus, setEditingPaymentStatus] = useState('');
  const [editingTrackingNumber, setEditingTrackingNumber] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders');
      console.log('Orders API response:', response.data);
      if (response.data.success) {
        // The API returns { data: { data: [...], pagination: {...} } }
        const ordersData = response.data.data.data || [];
        console.log('Orders data:', ordersData);
        setOrders(ordersData);
      } else {
        setError('Failed to load orders');
        setOrders([]);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setDetailDialogOpen(true);
  };

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setEditingStatus(order.status);
    setEditingPaymentStatus(order.payment_status);
    setEditingTrackingNumber(order.tracking_number || '');
    setEditDialogOpen(true);
  };

  const handleSaveOrder = async () => {
    if (!selectedOrder) return;

    try {
      await api.put(`/orders/${selectedOrder.id}`, {
        status: editingStatus,
        payment_status: editingPaymentStatus,
        tracking_number: editingTrackingNumber,
      });
      
      setEditDialogOpen(false);
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      console.error('Error updating order:', err);
      setError('Failed to update order');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <PendingIcon sx={{ color: 'warning.main' }} />;
      case 'processing':
        return <ScheduleIcon sx={{ color: 'info.main' }} />;
      case 'shipped':
        return <ShippingIcon sx={{ color: 'primary.main' }} />;
      case 'delivered':
        return <CheckIcon sx={{ color: 'success.main' }} />;
      case 'cancelled':
        return <CancelIcon sx={{ color: 'error.main' }} />;
      case 'returned':
        return <ReturnIcon sx={{ color: 'error.main' }} />;
      default:
        return <PendingIcon sx={{ color: 'grey.500' }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'shipped':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'returned':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'paid':
        return 'success';
      case 'failed':
        return 'error';
      case 'refunded':
        return 'info';
      case 'partially_refunded':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      case 'returned':
        return 'Returned';
      default:
        return status;
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'paid':
        return 'Paid';
      case 'failed':
        return 'Failed';
      case 'refunded':
        return 'Refunded';
      case 'partially_refunded':
        return 'Partially Refunded';
      default:
        return status;
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const filteredOrders = (orders || []).filter(order => {
    if (!order || typeof order !== 'object') return false;
    
    const matchesSearch = 
      (order.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (order.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (order.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPaymentStatus = paymentStatusFilter === 'all' || order.payment_status === paymentStatusFilter;
    
    return matchesSearch && matchesStatus && matchesPaymentStatus;
  });

  const paginatedOrders = filteredOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getOrderStats = () => {
    const ordersArray = orders || [];
    const total = ordersArray.length;
    const pending = ordersArray.filter(o => o?.status === 'pending').length;
    const processing = ordersArray.filter(o => o?.status === 'processing').length;
    const shipped = ordersArray.filter(o => o?.status === 'shipped').length;
    const delivered = ordersArray.filter(o => o?.status === 'delivered').length;
    const cancelled = ordersArray.filter(o => o?.status === 'cancelled').length;
    const totalRevenue = ordersArray
      .filter(o => o?.payment_status === 'paid')
      .reduce((sum, o) => sum + (o?.total_amount || 0), 0);

    return { total, pending, processing, shipped, delivered, cancelled, totalRevenue };
  };

  const stats = getOrderStats();

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
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Manage Orders
        </Typography>
        <Typography variant="h6" color="text.secondary">
          View, track, and manage customer orders
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" color="primary.main" fontWeight="bold">
              {stats.total}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Orders
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" color="success.main" fontWeight="bold">
              {formatCurrency(stats.totalRevenue)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Revenue
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" color="warning.main" fontWeight="bold">
              {stats.pending + stats.processing}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pending Orders
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" color="info.main" fontWeight="bold">
              {stats.delivered}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Delivered Orders
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Controls */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search orders, customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="processing">Processing</MenuItem>
                <MenuItem value="shipped">Shipped</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
                <MenuItem value="returned">Returned</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Payment</InputLabel>
              <Select
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
                label="Payment"
              >
                <MenuItem value="all">All Payments</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
                <MenuItem value="refunded">Refunded</MenuItem>
                <MenuItem value="partially_refunded">Partially Refunded</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={fetchOrders}
              >
                Refresh
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Orders Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'grey.50' }}>
                <TableCell>Order</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedOrders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        #{order.order_number}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {order.items.length} items
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {order.user_name || `User ${order.user_id}`}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {order.user_email || 'Email not available'}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(order.status)}
                      label={getStatusLabel(order.status)}
                      color={getStatusColor(order.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getPaymentStatusLabel(order.payment_status)}
                      color={getPaymentStatusColor(order.payment_status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {formatCurrency(order.total_amount)}
                    </Typography>
                    {order.discount_amount > 0 && (
                      <Typography variant="caption" color="success.main">
                        -{formatCurrency(order.discount_amount)} discount
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(order.created_at)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleViewOrder(order)}
                          color="primary"
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit Order">
                        <IconButton
                          size="small"
                          onClick={() => handleEditOrder(order)}
                          color="secondary"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* Order Detail Dialog */}
      <Dialog 
        open={detailDialogOpen} 
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ReceiptIcon />
            Order Details - #{selectedOrder?.order_number}
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedOrder && (
            <Box sx={{ mt: 2 }}>
              {/* Order Status */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Order Status
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Chip
                        icon={getStatusIcon(selectedOrder.status)}
                        label={getStatusLabel(selectedOrder.status)}
                        color={getStatusColor(selectedOrder.status) as any}
                        sx={{ mb: 1 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Chip
                        label={getPaymentStatusLabel(selectedOrder.payment_status)}
                        color={getPaymentStatusColor(selectedOrder.payment_status) as any}
                        sx={{ mb: 1 }}
                      />
                    </Grid>
                  </Grid>
                  {selectedOrder.tracking_number && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Tracking: {selectedOrder.tracking_number}
                    </Typography>
                  )}
                </CardContent>
              </Card>

              {/* Customer Information */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Customer Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <PersonIcon sx={{ color: 'text.secondary' }} />
                        <Typography variant="body2" fontWeight="medium">
                          {selectedOrder.user_name || `User ${selectedOrder.user_id}`}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <EmailIcon sx={{ color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {selectedOrder.user_email || 'Email not available'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" fontWeight="medium" gutterBottom>
                        Shipping Address:
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedOrder.shipping_address}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Order Items ({selectedOrder.items.length})
                  </Typography>
                  <List>
                    {selectedOrder.items.map((item) => (
                      <ListItem key={item.id} divider>
                        <ListItemAvatar>
                          <Avatar src={item.product_image} alt={item.product_name}>
                            <CartIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={item.product_name}
                          secondary={`Qty: ${item.quantity} × ${formatCurrency(item.price)}`}
                        />
                        <Typography variant="body2" fontWeight="bold">
                          {formatCurrency(item.total)}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Order Summary
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Subtotal:</Typography>
                        <Typography variant="body2">{formatCurrency(selectedOrder.subtotal)}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Tax:</Typography>
                        <Typography variant="body2">{formatCurrency(selectedOrder.tax_amount)}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Shipping:</Typography>
                        <Typography variant="body2">{formatCurrency(selectedOrder.shipping_cost)}</Typography>
                      </Box>
                      {selectedOrder.discount_amount > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="success.main">
                            Discount:
                          </Typography>
                          <Typography variant="body2" color="success.main">
                            -{formatCurrency(selectedOrder.discount_amount)}
                          </Typography>
                        </Box>
                      )}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="h6" fontWeight="bold">
                          Total:
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                          {formatCurrency(selectedOrder.total_amount)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Payment Method:</Typography>
                        <Typography variant="body2">{selectedOrder.payment_method}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Shipping Method:</Typography>
                        <Typography variant="body2">{selectedOrder.shipping_method}</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDetailDialogOpen(false)} startIcon={<CloseIcon />}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Order Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EditIcon />
            Edit Order - #{selectedOrder?.order_number}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Order Status</InputLabel>
                <Select
                  value={editingStatus}
                  onChange={(e) => setEditingStatus(e.target.value)}
                  label="Order Status"
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="processing">Processing</MenuItem>
                  <MenuItem value="shipped">Shipped</MenuItem>
                  <MenuItem value="delivered">Delivered</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                  <MenuItem value="returned">Returned</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Payment Status</InputLabel>
                <Select
                  value={editingPaymentStatus}
                  onChange={(e) => setEditingPaymentStatus(e.target.value)}
                  label="Payment Status"
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="failed">Failed</MenuItem>
                  <MenuItem value="refunded">Refunded</MenuItem>
                  <MenuItem value="partially_refunded">Partially Refunded</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tracking Number"
                value={editingTrackingNumber}
                onChange={(e) => setEditingTrackingNumber(e.target.value)}
                placeholder="Enter tracking number"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setEditDialogOpen(false)} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveOrder}
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              }
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OrderListPage; 