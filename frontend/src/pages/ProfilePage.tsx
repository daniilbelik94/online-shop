import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Divider,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  useMediaQuery,
  useTheme,
  Tab,
  Tabs,
  CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ShoppingBag as OrdersIcon,
  Person as ProfileIcon,
  Security as SecurityIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { logout } from '../store/slices/authSlice';
import { userProfileApi, UpdateProfileData, ChangePasswordData, Order } from '../services/api';

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

const ProfilePage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [tabValue, setTabValue] = useState(0);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  // Orders data
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (user) {
      setProfileForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  // Load orders when orders tab is selected
  useEffect(() => {
    if (tabValue === 1 && isAuthenticated) {
      loadOrders();
    }
  }, [tabValue, isAuthenticated]);

  const loadOrders = async () => {
    try {
      setOrdersLoading(true);
      const ordersData = await userProfileApi.getOrders();
      setOrders(ordersData);
    } catch (error) {
      console.error('Failed to load orders:', error);
      setError('Failed to load orders');
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError('');
    setSuccess('');
  };

  const handleProfileFormChange = (field: string, value: string) => {
    setProfileForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordFormChange = (field: string, value: string) => {
    setPasswordForm(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      setError('');
      
      const updateData: UpdateProfileData = {
        first_name: profileForm.first_name,
        last_name: profileForm.last_name,
        email: profileForm.email,
        phone: profileForm.phone || undefined,
      };

      await userProfileApi.updateProfile(updateData);
      
      setSuccess('Profile updated successfully!');
      setEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setLoading(true);
      setError('');

      if (passwordForm.new_password !== passwordForm.confirm_password) {
        setError('New passwords do not match.');
        return;
      }

      if (passwordForm.new_password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }

      const changePasswordData: ChangePasswordData = {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
      };

      await userProfileApi.changePassword(changePasswordData);
      
      setSuccess('Password changed successfully!');
      setPasswordForm({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'success';
      case 'shipped':
        return 'info';
      case 'processing':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

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
      <Typography variant={isMobile ? "h4" : "h3"} component="h1" gutterBottom>
        My Account
      </Typography>

      <Grid container spacing={3}>
        {/* User Info Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                <Typography variant="h4" color="white">
                  {user.first_name?.[0]?.toUpperCase() || 'U'}
                </Typography>
              </Box>
              <Typography variant="h6" gutterBottom>
                {user.first_name} {user.last_name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {user.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Member since {new Date(user.created_at || '').toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant={isMobile ? "scrollable" : "fullWidth"}
                scrollButtons="auto"
              >
                <Tab
                  icon={<ProfileIcon />}
                  label="Profile"
                  iconPosition="start"
                  sx={{ minHeight: 64 }}
                />
                <Tab
                  icon={<OrdersIcon />}
                  label="Orders"
                  iconPosition="start"
                  sx={{ minHeight: 64 }}
                />
                <Tab
                  icon={<SecurityIcon />}
                  label="Security"
                  iconPosition="start"
                  sx={{ minHeight: 64 }}
                />
              </Tabs>
            </Box>

            {/* Success/Error Messages */}
            {success && (
              <Alert severity="success" sx={{ m: 3, mb: 0 }} onClose={() => setSuccess('')}>
                {success}
              </Alert>
            )}
            {error && (
              <Alert severity="error" sx={{ m: 3, mb: 0 }} onClose={() => setError('')}>
                {error}
              </Alert>
            )}

            {/* Profile Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ px: { xs: 2, sm: 3 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6">Personal Information</Typography>
                  {!editing ? (
                    <Button
                      startIcon={<EditIcon />}
                      onClick={() => setEditing(true)}
                      variant="outlined"
                    >
                      Edit
                    </Button>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        startIcon={<SaveIcon />}
                        onClick={handleSaveProfile}
                        variant="contained"
                        disabled={loading}
                      >
                        Save
                      </Button>
                      <Button
                        startIcon={<CancelIcon />}
                        onClick={() => {
                          setEditing(false);
                          setError('');
                          // Reset form
                          if (user) {
                            setProfileForm({
                              first_name: user.first_name || '',
                              last_name: user.last_name || '',
                              email: user.email || '',
                              phone: user.phone || '',
                            });
                          }
                        }}
                        variant="outlined"
                        disabled={loading}
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
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      value={profileForm.last_name}
                      onChange={(e) => handleProfileFormChange('last_name', e.target.value)}
                      disabled={!editing || loading}
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
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phone"
                      value={profileForm.phone}
                      onChange={(e) => handleProfileFormChange('phone', e.target.value)}
                      disabled={!editing || loading}
                    />
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>

            {/* Orders Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ px: { xs: 2, sm: 3 } }}>
                <Typography variant="h6" gutterBottom>
                  Order History
                </Typography>
                {ordersLoading ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <CircularProgress />
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      Loading orders...
                    </Typography>
                  </Box>
                ) : orders.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <ReceiptIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No orders yet
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Start shopping to see your orders here
                    </Typography>
                  </Box>
                ) : (
                  <List>
                    {orders.map((order, index) => (
                      <React.Fragment key={order.id}>
                        <ListItem
                          sx={{
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'flex-start', sm: 'center' },
                            py: 2,
                          }}
                        >
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                  {order.order_number}
                                </Typography>
                                <Chip
                                  label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                  color={getOrderStatusColor(order.status) as any}
                                  size="small"
                                />
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Typography variant="body2" color="text.secondary">
                                  {new Date(order.date).toLocaleDateString()}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {order.items_count} item{order.items_count !== 1 ? 's' : ''}
                                </Typography>
                              </Box>
                            }
                          />
                          <ListItemSecondaryAction sx={{ position: { xs: 'static', sm: 'absolute' } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Typography variant="h6" fontWeight="bold">
                                {formatPrice(order.total)}
                              </Typography>
                              <Button variant="outlined" size="small">
                                View Details
                              </Button>
                            </Box>
                          </ListItemSecondaryAction>
                        </ListItem>
                        {index < orders.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </Box>
            </TabPanel>

            {/* Security Tab */}
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ px: { xs: 2, sm: 3 } }}>
                <Typography variant="h6" gutterBottom>
                  Change Password
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Current Password"
                      type={showPassword ? 'text' : 'password'}
                      value={passwordForm.current_password}
                      onChange={(e) => handlePasswordFormChange('current_password', e.target.value)}
                      disabled={loading}
                      InputProps={{
                        endAdornment: (
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="New Password"
                      type={showPassword ? 'text' : 'password'}
                      value={passwordForm.new_password}
                      onChange={(e) => handlePasswordFormChange('new_password', e.target.value)}
                      disabled={loading}
                      helperText="At least 6 characters"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      type={showPassword ? 'text' : 'password'}
                      value={passwordForm.confirm_password}
                      onChange={(e) => handlePasswordFormChange('confirm_password', e.target.value)}
                      disabled={loading}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      onClick={handleChangePassword}
                      disabled={
                        loading ||
                        !passwordForm.current_password ||
                        !passwordForm.new_password ||
                        !passwordForm.confirm_password
                      }
                      sx={{ mr: 2 }}
                    >
                      {loading ? 'Changing...' : 'Change Password'}
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => dispatch(logout())}
                    >
                      Logout
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage;