import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Tabs,
  Tab,
  Card,
  CardContent,
  Button,
  IconButton,
  Avatar,
  Chip,
  TextField,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Breadcrumbs,
  Link,
  CircularProgress,
  Badge,
  Tooltip,
  Rating,
  useTheme,
  useMediaQuery,
  Skeleton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from '@mui/material';
import {
  Person as ProfileIcon,
  ShoppingBag as OrdersIcon,
  LocationOn as LocationOnIcon,
  Security as SecurityIcon,
  Favorite as FavoriteIcon,
  Visibility as VisibilityIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  ShoppingCart as ShoppingCartIcon,
  LocalShipping as ShippingIcon,
  Receipt as ReceiptIcon,
  History as HistoryIcon,
  Payment as PaymentIcon,
  Home as HomeIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  LocalOffer as LocalOfferIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as AccountBalanceIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Loyalty as LoyaltyIcon,
  EmojiEvents as RewardsIcon,
  Grade as GradeIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../store';
import { selectUser, selectIsAuthenticated } from '../store/slices/authSlice';
import { 
  selectWishlistItems, 
  selectWishlistLoading, 
  fetchWishlist, 
  addToWishlist, 
  removeFromWishlist 
} from '../store/slices/wishlistSlice';
import { addToCart } from '../store/slices/cartSlice';
import { userProfileApi } from '../services/api';
import type { Order } from '../types';
import OrderDetailsModal from '../components/OrderDetailsModal';
import SettingsTab from '../components/SettingsTab';

interface UpdateProfileData {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
}

interface ChangePasswordData {
  current_password: string;
  new_password: string;
  confirm_password?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// Helper functions
const formatPrice = (price: number | string | null | undefined): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return numPrice != null && !isNaN(numPrice) ? `$${numPrice.toFixed(2)}` : '$0.00';
};

const getOrderTotal = (order: Order): number => {
  return order.total || order.total_amount || 0;
};

const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return 'Unknown date';
  }
};

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const wishlistItems = useSelector(selectWishlistItems);
  const wishlistLoading = useSelector(selectWishlistLoading);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // State
  const [tabValue, setTabValue] = useState(0);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Profile form state
  const [profileForm, setProfileForm] = useState<UpdateProfileData>({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: (user as any)?.phone || '',
    date_of_birth: (user as any)?.date_of_birth || '',
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState<ChangePasswordData>({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  // Orders data
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);

  // Filters and search
  const [orderFilter, setOrderFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderPage, setOrderPage] = useState(0);
  const [ordersPerPage] = useState(5);

  // Statistics
  const [statistics, setStatistics] = useState({
    totalOrders: 0,
    totalSpent: 0,
    averageOrderValue: 0,
    loyaltyPoints: 0,
    membershipLevel: 'Bronze',
    nextLevelProgress: 45,
  });
  const [statisticsLoading, setStatisticsLoading] = useState(true);

  // Addresses
  const [addresses, setAddresses] = useState<any[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any | null>(null);
  const [addressForm, setAddressForm] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    postal_code: '',
    country: '',
    phone: '',
    is_default: false,
  });

  // Wishlist handlers
  const handleAddToWishlist = (productId: string | number) => {
    dispatch(addToWishlist(productId));
  };

  const handleRemoveFromWishlist = (productId: string | number) => {
    dispatch(removeFromWishlist(productId));
  };

  const handleAddToCartFromWishlist = (product: any) => {
    dispatch(addToCart({ productId: product.id.toString(), quantity: 1 }));
    setSuccess('Item added to cart!');
  };

  // Address handlers
  const loadAddresses = async () => {
    try {
      setAddressesLoading(true);
      const response = await userProfileApi.getAddresses();
      setAddresses(response || []);
    } catch (error) {
      console.error('Failed to load addresses:', error);
      setError('Failed to load addresses');
    } finally {
      setAddressesLoading(false);
    }
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setAddressForm({
      name: '',
      street: '',
      city: '',
      state: '',
      postal_code: '',
      country: '',
      phone: '',
      is_default: false,
    });
    setAddressDialogOpen(true);
  };

  const handleEditAddress = (address: any) => {
    setEditingAddress(address);
    setAddressForm({
      name: address.name || '',
      street: address.street || '',
      city: address.city || '',
      state: address.state || '',
      postal_code: address.postal_code || '',
      country: address.country || '',
      phone: address.phone || '',
      is_default: address.is_default || false,
    });
    setAddressDialogOpen(true);
  };

  const handleSaveAddress = async () => {
    try {
      setLoading(true);
      setError('');
      
      const addressData = {
        ...addressForm,
        id: editingAddress?.id,
      };
      
      await userProfileApi.saveAddress(addressData);
      setSuccess(editingAddress ? 'Address updated successfully!' : 'Address added successfully!');
      setAddressDialogOpen(false);
      loadAddresses(); // Reload addresses
    } catch (error: any) {
      setError(error.message || 'Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      setLoading(true);
      await userProfileApi.deleteAddress(addressId);
      setSuccess('Address deleted successfully!');
      loadAddresses(); // Reload addresses
    } catch (error: any) {
      setError(error.message || 'Failed to delete address');
    } finally {
      setLoading(false);
    }
  };

  const mockRecentlyViewed = [
    {
      id: '3',
      name: 'Laptop Stand Adjustable',
      price: 39.99,
      image: '/placeholder-product.jpg',
      viewedAt: '2024-01-15T10:30:00Z',
    },
    {
      id: '4',
      name: 'Bluetooth Keyboard',
      price: 79.99,
      image: '/placeholder-product.jpg',
      viewedAt: '2024-01-14T15:45:00Z',
    },
  ];

  // Effects
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, user, navigate]);

  // Handle URL tab parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'orders') {
      setTabValue(1);
    } else if (tabParam === 'addresses') {
      setTabValue(2);
    } else if (tabParam === 'security') {
      setTabValue(3);
    } else if (tabParam === 'wishlist') {
      setTabValue(4);
    } else if (tabParam === 'settings') {
      setTabValue(5);
    }
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      setProfileForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: (user as any)?.phone || '',
        date_of_birth: (user as any)?.date_of_birth || '',
      });
    }
  }, [user]);

  // Load orders when orders tab is selected
  useEffect(() => {
    if (tabValue === 1 && isAuthenticated) {
      loadOrders();
    }
  }, [tabValue, isAuthenticated]);

  // Load statistics after orders are loaded
  useEffect(() => {
    if (isAuthenticated && orders.length >= 0) {
      loadStatistics();
    }
  }, [isAuthenticated, orders]);

  // Load wishlist when wishlist tab is selected
  useEffect(() => {
    if (tabValue === 4 && isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [tabValue, isAuthenticated, dispatch]);

  // Load addresses when addresses tab is selected
  useEffect(() => {
    if (tabValue === 2 && isAuthenticated) {
      loadAddresses();
    }
  }, [tabValue, isAuthenticated]);

  // Load initial data when component mounts
  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
      loadAddresses();
      dispatch(fetchWishlist());
    }
  }, [isAuthenticated, dispatch]);

  // Handlers
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleProfileFormChange = (field: keyof UpdateProfileData, value: string) => {
    setProfileForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordFormChange = (field: keyof ChangePasswordData, value: string) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      setError('');
      
      await userProfileApi.updateProfile(profileForm);
      setSuccess('Profile updated successfully!');
      setEditing(false);
    } catch (error: any) {
      setError(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (passwordForm.new_password !== passwordForm.confirm_password) {
        setError('New passwords do not match');
        return;
      }

      await userProfileApi.changePassword({
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      });
      
      setSuccess('Password changed successfully!');
      setPasswordForm({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
    } catch (error: any) {
      setError(error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await userProfileApi.getOrders();
      setOrders(response || []);
    } catch (error) {
      console.error('Failed to load orders:', error);
      setError('Failed to load orders');
    } finally {
      setOrdersLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      setStatisticsLoading(true);
      
      // Calculate statistics from orders
      const totalOrders = orders.length;
      const totalSpent = orders.reduce((sum, order) => sum + (order.total || order.total_amount || 0), 0);
      const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
      
      // Calculate loyalty points (1 point per dollar spent)
      const loyaltyPoints = Math.floor(totalSpent);
      
      // Determine membership level based on total spent
      let membershipLevel = 'Bronze';
      let nextLevelProgress = 0;
      
      if (totalSpent >= 5000) {
        membershipLevel = 'Platinum';
        nextLevelProgress = 100;
      } else if (totalSpent >= 2000) {
        membershipLevel = 'Gold';
        nextLevelProgress = Math.min(100, ((totalSpent - 2000) / 3000) * 100);
      } else if (totalSpent >= 500) {
        membershipLevel = 'Silver';
        nextLevelProgress = Math.min(100, ((totalSpent - 500) / 1500) * 100);
      } else {
        membershipLevel = 'Bronze';
        nextLevelProgress = Math.min(100, (totalSpent / 500) * 100);
      }
      
      setStatistics({
        totalOrders,
        totalSpent,
        averageOrderValue,
        loyaltyPoints,
        membershipLevel,
        nextLevelProgress,
      });
    } catch (error) {
      console.error('Failed to load statistics:', error);
    } finally {
      setStatisticsLoading(false);
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
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
      default:
        return 'default';
    }
  };

  const getOrderStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <ScheduleIcon />;
      case 'processing':
        return <RefreshIcon />;
      case 'shipped':
        return <ShippingIcon />;
      case 'delivered':
        return <CheckCircleIcon />;
      case 'cancelled':
        return <CloseIcon />;
      default:
        return <InfoIcon />;
    }
  };

  const handleViewOrderDetails = async (orderId: string | number) => {
    try {
      setLoading(true);
      const response = await userProfileApi.getOrderDetails(String(orderId));
      setSelectedOrder(response);
      setOrderDetailsOpen(true);
    } catch (error) {
      console.error('Failed to load order details:', error);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleReorderItems = (order: Order) => {
    if (order.items && order.items.length > 0) {
      order.items.forEach(item => {
        dispatch(addToCart({ productId: item.product_id.toString(), quantity: item.quantity }));
      });
      setSuccess('Items added to cart!');
      navigate('/cart');
    }
  };

  const handleTrackShipment = (order: Order) => {
    if (order.tracking_number) {
      window.open(`https://tracking.example.com/${order.tracking_number}`, '_blank');
    } else {
      setError('No tracking information available');
    }
  };

  const handleCancelOrder = async (order: Order) => {
    try {
      setLoading(true);
      await userProfileApi.cancelOrder(order.id);
      setSuccess('Order cancelled successfully');
      setOrderDetailsOpen(false);
      loadOrders(); // Reload orders
    } catch (error: any) {
      setError(error.message || 'Failed to cancel order');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnOrder = async (order: Order) => {
    try {
      setLoading(true);
      await userProfileApi.initiateReturn(order.id);
      setSuccess('Return request submitted successfully');
      setOrderDetailsOpen(false);
    } catch (error: any) {
      setError(error.message || 'Failed to initiate return');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = orderFilter === 'all' || order.status?.toLowerCase() === orderFilter;
    const matchesSearch = order.order_number?.toLowerCase().includes(orderSearch.toLowerCase()) ||
                         (order.total || order.total_amount || 0).toString().includes(orderSearch);
    return matchesFilter && matchesSearch;
  });

  const paginatedOrders = filteredOrders.slice(
    orderPage * ordersPerPage,
    orderPage * ordersPerPage + ordersPerPage
  );

  if (!isAuthenticated || !user) {
    return (
      <Container maxWidth="sm" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Loading...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 4 } }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate('/')}
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          <HomeIcon fontSize="small" />
          Home
        </Link>
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <ProfileIcon fontSize="small" />
          My Account
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant={isMobile ? "h4" : "h3"} component="h1" gutterBottom fontWeight="bold">
          👤 My Account
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage your profile, orders, and preferences
        </Typography>
      </Box>

      {/* Success/Error Messages */}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* User Info Card */}
        <Grid item xs={12} lg={3}>
          <Paper sx={{ 
            p: 3, 
            borderRadius: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            textAlign: 'center',
            position: 'sticky',
            top: 20,
          }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                mx: 'auto',
                mb: 2,
                fontSize: '2.5rem',
                backgroundColor: 'rgba(255,255,255,0.2)',
                border: '4px solid rgba(255,255,255,0.3)',
              }}
            >
              {user.first_name?.[0]?.toUpperCase() || 'U'}
            </Avatar>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {user.first_name} {user.last_name}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
              {user.email}
            </Typography>
            
            {/* Membership Level */}
            <Chip
              label={`${statistics.membershipLevel} Member`}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 'bold',
                mb: 2,
              }}
              icon={
                statistics.membershipLevel === 'Platinum' ? (
                  <Box component="span" sx={{ fontSize: '1.2rem' }}>⭐</Box>
                ) : statistics.membershipLevel === 'Gold' ? (
                  <Box component="span" sx={{ fontSize: '1.2rem' }}>🥇</Box>
                ) : statistics.membershipLevel === 'Silver' ? (
                  <Box component="span" sx={{ fontSize: '1.2rem' }}>🥈</Box>
                ) : (
                  <Box component="span" sx={{ fontSize: '1.2rem' }}>🥉</Box>
                )
              }
            />

            {/* Loyalty Points */}
            <Box sx={{ 
              p: 2, 
              borderRadius: 2,
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              mb: 2,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
                <LoyaltyIcon />
                <Typography variant="h6" fontWeight="bold">
                  {statistics.loyaltyPoints.toLocaleString()}
                </Typography>
              </Box>
              <Typography variant="caption">
                Loyalty Points
              </Typography>
            </Box>

            {/* Member Since */}
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Member since {(user as any)?.created_at ? formatDate((user as any).created_at) : 'Unknown'}
            </Typography>
          </Paper>

          {/* Quick Stats */}
          <Paper sx={{ p: 3, borderRadius: 3, mt: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              📊 Quick Stats
            </Typography>
            
            {statisticsLoading ? (
              <Box>
                <Skeleton variant="text" height={32} />
                <Skeleton variant="text" height={32} />
                <Skeleton variant="text" height={32} />
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Total Orders:</Typography>
                  <Typography variant="body2" fontWeight="bold">{statistics.totalOrders}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Total Spent:</Typography>
                  <Typography variant="body2" fontWeight="bold">{formatPrice(statistics.totalSpent)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Average Order:</Typography>
                  <Typography variant="body2" fontWeight="bold">{formatPrice(statistics.averageOrderValue)}</Typography>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} lg={9}>
          <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant={isMobile ? "scrollable" : "fullWidth"}
                scrollButtons="auto"
                sx={{
                  '& .MuiTab-root': {
                    minHeight: 64,
                    fontWeight: 'bold',
                  },
                  '& .Mui-selected': {
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                  }
                }}
              >
                <Tab
                  icon={<ProfileIcon />}
                  label="Profile"
                  iconPosition="start"
                />
                <Tab
                  icon={<OrdersIcon />}
                  label="Orders"
                  iconPosition="start"
                />
                <Tab
                  icon={<LocationOnIcon />}
                  label="Addresses"
                  iconPosition="start"
                />
                <Tab
                  icon={<SecurityIcon />}
                  label="Security"
                  iconPosition="start"
                />
                <Tab
                  icon={<FavoriteIcon />}
                  label="Wishlist"
                  iconPosition="start"
                />
                <Tab
                  icon={<SettingsIcon />}
                  label="Settings"
                  iconPosition="start"
                />
              </Tabs>
            </Box>

            {/* Profile Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ px: { xs: 2, sm: 4 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                  <Typography variant="h5" fontWeight="bold">
                    Personal Information
                  </Typography>
                  {!editing ? (
                    <Button
                      startIcon={<EditIcon />}
                      onClick={() => setEditing(true)}
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        startIcon={<SaveIcon />}
                        onClick={handleSaveProfile}
                        variant="contained"
                        disabled={loading}
                        sx={{ borderRadius: 2 }}
                      >
                        Save
                      </Button>
                      <Button
                        startIcon={<CancelIcon />}
                        onClick={() => {
                          setEditing(false);
                          setError('');
                          if (user) {
                            setProfileForm({
                              first_name: user.first_name || '',
                              last_name: user.last_name || '',
                              email: user.email || '',
                              phone: (user as any)?.phone || '',
                              date_of_birth: (user as any)?.date_of_birth || '',
                            });
                          }
                        }}
                        variant="outlined"
                        disabled={loading}
                        sx={{ borderRadius: 2 }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  )}
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      value={profileForm.first_name}
                      onChange={(e) => handleProfileFormChange('first_name', e.target.value)}
                      disabled={!editing || loading}
                      sx={{ borderRadius: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={profileForm.last_name}
                      onChange={(e) => handleProfileFormChange('last_name', e.target.value)}
                      disabled={!editing || loading}
                      sx={{ borderRadius: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => handleProfileFormChange('email', e.target.value)}
                      disabled={!editing || loading}
                      sx={{ borderRadius: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      value={profileForm.phone}
                      onChange={(e) => handleProfileFormChange('phone', e.target.value)}
                      disabled={!editing || loading}
                      sx={{ borderRadius: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Date of Birth"
                      type="date"
                      value={profileForm.date_of_birth}
                      onChange={(e) => handleProfileFormChange('date_of_birth', e.target.value)}
                      disabled={!editing || loading}
                      InputLabelProps={{ shrink: true }}
                      sx={{ borderRadius: 2 }}
                    />
                  </Grid>
                </Grid>

                {/* Account Summary */}
                <Paper sx={{ p: 3, mt: 4, borderRadius: 3, background: 'linear-gradient(135deg, #f8f9ff 0%, #e8f2ff 100%)' }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    📈 Account Summary
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <RewardsIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                        <Typography variant="h4" fontWeight="bold" color="primary">
                          {statistics.totalOrders}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Orders
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <TrendingUpIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                        <Typography variant="h4" fontWeight="bold" color="success.main">
                          {formatPrice(statistics.totalSpent)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Spent
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <LoyaltyIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                        <Typography variant="h4" fontWeight="bold" color="warning.main">
                          {statistics.loyaltyPoints.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Loyalty Points
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <GradeIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                        <Typography variant="h4" fontWeight="bold" color="info.main">
                          {statistics.membershipLevel}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Membership Level
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            </TabPanel>

            {/* Orders Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ px: { xs: 2, sm: 4 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                  <Typography variant="h5" fontWeight="bold">
                    Order History
                  </Typography>
                  <Button
                    startIcon={<RefreshIcon />}
                    onClick={loadOrders}
                    variant="outlined"
                    disabled={ordersLoading}
                    sx={{ borderRadius: 2 }}
                  >
                    Refresh
                  </Button>
                </Box>

                {/* Filters */}
                <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Search orders..."
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        InputProps={{
                          startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                        }}
                        sx={{ borderRadius: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        size="small"
                        select
                        label="Filter by Status"
                        value={orderFilter}
                        onChange={(e) => setOrderFilter(e.target.value)}
                        sx={{ borderRadius: 2 }}
                      >
                        <MenuItem value="all">All Orders</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="processing">Processing</MenuItem>
                        <MenuItem value="shipped">Shipped</MenuItem>
                        <MenuItem value="delivered">Delivered</MenuItem>
                        <MenuItem value="cancelled">Cancelled</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="text.secondary">
                        Showing {filteredOrders.length} of {orders.length} orders
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Orders Loading */}
                {ordersLoading ? (
                  <Box>
                    {[...Array(3)].map((_, index) => (
                      <Card key={index} sx={{ mb: 2, borderRadius: 3 }}>
                        <CardContent>
                          <Skeleton variant="text" height={32} width="40%" />
                          <Skeleton variant="text" height={24} width="60%" />
                          <Skeleton variant="text" height={24} width="30%" />
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                ) : filteredOrders.length === 0 ? (
                  <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
                    <ReceiptIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      No orders found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      {orderSearch || orderFilter !== 'all' 
                        ? 'Try adjusting your search or filter criteria'
                        : "You haven't placed any orders yet. Start shopping to see your orders here!"
                      }
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => navigate('/products')}
                      sx={{ borderRadius: 3 }}
                    >
                      Start Shopping
                    </Button>
                  </Paper>
                ) : (
                  <>
                    {/* Orders List */}
                    {paginatedOrders.map((order) => (
                      <Box key={order.id} sx={{ mb: 2 }}>
                        <Card sx={{ 
                          borderRadius: 3,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                          }
                        }}>
                          <CardContent sx={{ p: 3 }}>
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={12} sm={3}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                  {order.order_number || `Order #${order.id}`}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Unknown date'}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={2}>
                                <Chip
                                  icon={getOrderStatusIcon(order.status)}
                                  label={order.status || 'Unknown'}
                                  color={getOrderStatusColor(order.status) as any}
                                  sx={{ fontWeight: 'bold' }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={2}>
                                <Typography variant="body2" color="text.secondary">
                                  Total
                                </Typography>
                                <Typography variant="h6" fontWeight="bold" color="primary">
                                  {formatPrice(getOrderTotal(order))}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={2}>
                                <Typography variant="body2" color="text.secondary">
                                  Items
                                </Typography>
                                <Typography variant="body1" fontWeight="bold">
                                  {(order.items || []).length}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={3}>
                                <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    onClick={() => handleViewOrderDetails(order.id)}
                                    sx={{ borderRadius: 2 }}
                                  >
                                    View Details
                                  </Button>
                                  {order.status === 'delivered' && (
                                    <Button
                                      variant="contained"
                                      size="small"
                                      onClick={() => navigate(`/products`)}
                                      sx={{ borderRadius: 2 }}
                                    >
                                      Buy Again
                                    </Button>
                                  )}
                                </Box>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Box>
                    ))}

                    {/* Pagination */}
                    {filteredOrders.length > ordersPerPage && (
                      <TablePagination
                        component="div"
                        count={filteredOrders.length}
                        page={orderPage}
                        onPageChange={(_, newPage) => setOrderPage(newPage)}
                        rowsPerPage={ordersPerPage}
                        rowsPerPageOptions={[5, 10, 25]}
                        onRowsPerPageChange={() => {}} // Fixed rows per page for now
                      />
                    )}
                  </>
                )}
              </Box>
            </TabPanel>

            {/* Address Management Tab */}
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ px: { xs: 2, sm: 4 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5" fontWeight="bold">
                    Address Management
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddAddress}
                    sx={{ borderRadius: 2 }}
                  >
                    Add Address
                  </Button>
                </Box>

                {addressesLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : addresses.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <LocationOnIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      No addresses saved
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Add your shipping and billing addresses for faster checkout
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleAddAddress}
                      sx={{ borderRadius: 2 }}
                    >
                      Add Your First Address
                    </Button>
                  </Box>
                ) : (
                  <Grid container spacing={3}>
                    {addresses.map((address) => (
                      <Grid item xs={12} md={6} key={address.id}>
                        <Card sx={{ 
                          borderRadius: 3,
                          border: address.is_default ? '2px solid' : '1px solid',
                          borderColor: address.is_default ? 'primary.main' : 'divider',
                          position: 'relative'
                        }}>
                          {address.is_default && (
                            <Chip
                              label="Default"
                              color="primary"
                              size="small"
                              sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                zIndex: 1
                              }}
                            />
                          )}
                          <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                              {address.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              {address.street}<br />
                              {address.city}, {address.state} {address.postal_code}<br />
                              {address.country}
                              {address.phone && (
                                <>
                                  <br />
                                  Phone: {address.phone}
                                </>
                              )}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<EditIcon />}
                                onClick={() => handleEditAddress(address)}
                                sx={{ borderRadius: 2 }}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                startIcon={<DeleteIcon />}
                                onClick={() => handleDeleteAddress(address.id)}
                                disabled={address.is_default}
                                sx={{ borderRadius: 2 }}
                              >
                                Delete
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={3}>
              <Box sx={{ px: { xs: 2, sm: 4 } }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  Change Password
                </Typography>
                
                <Grid container spacing={3} sx={{ maxWidth: 500 }}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Current Password"
                      type="password"
                      value={passwordForm.current_password}
                      onChange={(e) => handlePasswordFormChange('current_password', e.target.value)}
                      sx={{ borderRadius: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="New Password"
                      type="password"
                      value={passwordForm.new_password}
                      onChange={(e) => handlePasswordFormChange('new_password', e.target.value)}
                      sx={{ borderRadius: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      type="password"
                      value={passwordForm.confirm_password}
                      onChange={(e) => handlePasswordFormChange('confirm_password', e.target.value)}
                      sx={{ borderRadius: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      onClick={handleChangePassword}
                      disabled={loading || !passwordForm.current_password || !passwordForm.new_password}
                      sx={{ borderRadius: 2 }}
                    >
                      Change Password
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={4}>
              <Box sx={{ px: { xs: 2, sm: 4 } }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                  My Wishlist ({wishlistItems.length})
                </Typography>
                
                {wishlistLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : wishlistItems.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <FavoriteIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Your wishlist is empty
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      Save items you love for later by clicking the heart icon
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => navigate('/products')}
                      sx={{ borderRadius: 2 }}
                    >
                      Browse Products
                    </Button>
                  </Box>
                ) : (
                  <Grid container spacing={3}>
                    {wishlistItems.map((item: any) => {
                      const product = item.product ?? item; // Handle nested product structure returned by API
                      return (
                      <Grid item xs={12} sm={6} md={4} key={product.id}>
                        <Card sx={{ borderRadius: 3 }}>
                          <Box sx={{ position: 'relative' }}>
                            <img
                              src={(() => {
                                // Check if product has images array
                                if (product.images && Array.isArray(product.images) && product.images.length > 0) {
                                  const firstImage = product.images[0];
                                  if (typeof firstImage === 'string') {
                                    return firstImage.startsWith('http') ? firstImage : `/backend/public/uploads/${firstImage}`;
                                  }
                                  if (firstImage && typeof firstImage === 'object' && 'image_url' in firstImage) {
                                    return firstImage.image_url;
                                  }
                                }
                                
                                // Fallback to image_url field
                                if (product.image_url) {
                                  return product.image_url.startsWith('http') ? product.image_url : `/backend/public/uploads/${product.image_url}`;
                                }
                                
                                return '/placeholder-product.jpg';
                              })()}
                              alt={product.name}
                              style={{
                                width: '100%',
                                height: 200,
                                objectFit: 'cover',
                              }}
                            />
                            {product.compare_price && product.compare_price > product.price && (
                              <Chip
                                label={`${Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}% OFF`}
                                size="small"
                                color="secondary"
                                sx={{
                                  position: 'absolute',
                                  top: 12,
                                  right: 12,
                                  fontWeight: 'bold',
                                }}
                              />
                            )}
                            {!product.is_in_stock && (
                              <Chip
                                label="Out of Stock"
                                size="small"
                                color="error"
                                sx={{
                                  position: 'absolute',
                                  top: 12,
                                  left: 12,
                                  fontWeight: 'bold',
                                }}
                              />
                            )}
                          </Box>
                          <CardContent>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                              {product.name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Typography variant="h6" fontWeight="bold" color="primary">
                                {formatPrice(product.price)}
                              </Typography>
                              {product.compare_price && product.compare_price > product.price && (
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    textDecoration: 'line-through',
                                    color: 'text.secondary',
                                  }}
                                >
                                  {formatPrice(product.compare_price)}
                                </Typography>
                              )}
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button 
                                variant="contained" 
                                fullWidth 
                                disabled={!product.is_in_stock}
                                onClick={() => handleAddToCartFromWishlist(product)}
                                sx={{ borderRadius: 2 }}
                              >
                                {product.is_in_stock ? 'Add to Cart' : 'Notify Me'}
                              </Button>
                              <IconButton 
                                color="error"
                                onClick={() => handleRemoveFromWishlist(product.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                      );
                    })}
                  </Grid>
                )}
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={5}>
              <SettingsTab />
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>

      {/* Address Dialog */}
      <Dialog 
        open={addressDialogOpen} 
        onClose={() => setAddressDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingAddress ? 'Edit Address' : 'Add New Address'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={addressForm.name}
                onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Street Address"
                value={addressForm.street}
                onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                value={addressForm.city}
                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="State/Province"
                value={addressForm.state}
                onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Postal Code"
                value={addressForm.postal_code}
                onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Country"
                value={addressForm.country}
                onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number (Optional)"
                value={addressForm.phone}
                onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={addressForm.is_default}
                    onChange={(e) => setAddressForm({ ...addressForm, is_default: e.target.checked })}
                  />
                }
                label="Set as default address"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setAddressDialogOpen(false)}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSaveAddress}
            disabled={loading || !addressForm.name || !addressForm.street || !addressForm.city}
            sx={{ borderRadius: 2 }}
          >
            {loading ? 'Saving...' : (editingAddress ? 'Update Address' : 'Add Address')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Order Details Modal */}
      <OrderDetailsModal
        open={orderDetailsOpen}
        onClose={() => setOrderDetailsOpen(false)}
        order={selectedOrder}
        onReorder={handleReorderItems}
        onTrackShipment={handleTrackShipment}
        onCancelOrder={handleCancelOrder}
        onReturnOrder={handleReturnOrder}
      />
    </Container>
  );
};

export default ProfilePage; 