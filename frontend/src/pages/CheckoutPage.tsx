import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  StepIcon,
  ListItemIcon,
  Chip,
  Badge,
  Tooltip,
  Fade,
  Slide,
  IconButton,
  useTheme,
  useMediaQuery,
  StepConnector,
  styled,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../store';
import { clearCart, selectCart, selectCartTotal } from '../store/slices/cartSlice';
import { api } from '../lib/api';
import {
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  RateReview as ReviewIcon,
  CreditCard as CreditCardIcon,
  AccountBalanceWallet as PayPalIcon,
  Apple as ApplePayIcon,
  Google as GooglePayIcon,
  LocalShipping as StandardIcon,
  FlightTakeoff as ExpressIcon,
  Bolt as OvernightIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon,
  Lock as LockIcon,
  Verified as VerifiedIcon,
  Home as HomeIcon,
  Edit as EditIcon,
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import OrderSuccessModal from '../components/OrderSuccessModal';
import { userProfileApi } from '../services/api';

// Styled Components for better UI
const StyledStepConnector = styled(StepConnector)(({ theme }) => ({
  '&.Mui-active': {
    '& .MuiStepConnector-line': {
      background: 'linear-gradient(95deg, #667eea 0%, #764ba2 100%)',
    },
  },
  '&.Mui-completed': {
    '& .MuiStepConnector-line': {
      background: 'linear-gradient(95deg, #4caf50 0%, #2e7d32 100%)',
    },
  },
}));

const StyledStepIcon = styled('div')<{ ownerState: { completed?: boolean; active?: boolean } }>(
  ({ theme, ownerState }) => ({
    backgroundColor: ownerState.completed ? '#4caf50' : ownerState.active ? '#667eea' : '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'scale(1.1)',
    },
  }),
);

const CustomStepIcon = (props: any) => {
  const { active, completed, className, icon } = props;

  return (
    <StyledStepIcon ownerState={{ completed, active }} className={className}>
      {completed ? <CheckCircleIcon /> : icon}
    </StyledStepIcon>
  );
};

interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
}

interface BillingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

const steps = [
  { label: 'Shipping Information', icon: ShippingIcon },
  { label: 'Payment Method', icon: PaymentIcon },
  { label: 'Review Order', icon: ReviewIcon },
];

const CheckoutPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const cart = useSelector(selectCart);
  const total = useSelector(selectCartTotal);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [orderSuccessOpen, setOrderSuccessOpen] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [userAddresses, setUserAddresses] = useState<any[]>([]);
  const [userPaymentMethods, setUserPaymentMethods] = useState<any[]>([]);

  // Shipping form state
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    name: '',
    street: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'US',
    phone: '',
  });

  // Billing form state
  const [billingAddress, setBillingAddress] = useState<BillingAddress>({
    name: '',
    street: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'US',
  });

  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [customerNotes, setCustomerNotes] = useState('');

  const shippingOptions = [
    { id: 'standard', label: 'Standard Shipping (5-7 days)', cost: 0, icon: StandardIcon },
    { id: 'express', label: 'Express Shipping (2-3 days)', cost: 15.99, icon: ExpressIcon },
    { id: 'overnight', label: 'Overnight Shipping (1 day)', cost: 29.99, icon: OvernightIcon },
  ];

  const paymentOptions = [
    { id: 'card', label: 'Credit/Debit Card', icon: CreditCardIcon },
    { id: 'paypal', label: 'PayPal', icon: PayPalIcon },
    { id: 'apple_pay', label: 'Apple Pay', icon: ApplePayIcon },
    { id: 'google_pay', label: 'Google Pay', icon: GooglePayIcon },
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!cart || cart.items.length === 0) {
      navigate('/cart');
      return;
    }

    // Load user addresses and payment methods
    loadUserData();

    // Test modal on page load (for debugging)
    console.log('CheckoutPage loaded, testing modal state:', {
      orderSuccessOpen,
      orderData
    });

    // Restore form data from localStorage after loading user data
    setTimeout(() => {
      const savedShippingAddress = localStorage.getItem('checkout_shipping_address');
      const savedPaymentMethod = localStorage.getItem('checkout_payment_method');
      const savedShippingMethod = localStorage.getItem('checkout_shipping_method');
      const savedCustomerNotes = localStorage.getItem('checkout_customer_notes');

      if (savedShippingAddress) {
        try {
          const parsedAddress = JSON.parse(savedShippingAddress);
          // Only restore if the address has meaningful data
          if (parsedAddress.name && parsedAddress.street) {
            setShippingAddress(parsedAddress);
          }
        } catch (error) {
          console.warn('Failed to parse saved shipping address');
        }
      }

      if (savedPaymentMethod) {
        setPaymentMethod(savedPaymentMethod);
      }

      if (savedShippingMethod) {
        setShippingMethod(savedShippingMethod);
      }

      if (savedCustomerNotes) {
        setCustomerNotes(savedCustomerNotes);
      }
    }, 100); // Small delay to ensure user data is loaded first
  }, [isAuthenticated, cart, navigate]);

  // Debug effect for modal state changes
  useEffect(() => {
    console.log('Modal state changed:', { orderSuccessOpen, orderData });
  }, [orderSuccessOpen, orderData]);

  // Save form data to localStorage when it changes
  useEffect(() => {
    if (shippingAddress.name || shippingAddress.street) {
      localStorage.setItem('checkout_shipping_address', JSON.stringify(shippingAddress));
    }
  }, [shippingAddress]);

  useEffect(() => {
    if (paymentMethod) {
      localStorage.setItem('checkout_payment_method', paymentMethod);
    }
  }, [paymentMethod]);

  useEffect(() => {
    if (shippingMethod) {
      localStorage.setItem('checkout_shipping_method', shippingMethod);
    }
  }, [shippingMethod]);

  useEffect(() => {
    if (customerNotes) {
      localStorage.setItem('checkout_customer_notes', customerNotes);
    }
  }, [customerNotes]);

  useEffect(() => {
    if (sameAsShipping) {
      setBillingAddress({
        name: shippingAddress.name,
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postal_code: shippingAddress.postal_code,
        country: shippingAddress.country,
      });
    }
  }, [sameAsShipping, shippingAddress]);

  const handleNext = () => {
    if (activeStep === 0 && !validateShippingForm()) {
      return;
    }
    if (activeStep === 1 && !validatePaymentForm()) {
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const validateShippingForm = (): boolean => {
    const requiredFields = ['name', 'street', 'city', 'state', 'postal_code'];
    for (const field of requiredFields) {
      if (!shippingAddress[field as keyof ShippingAddress]) {
        setError(`Please fill in the ${field.replace('_', ' ')} field`);
        return false;
      }
    }
    
    if (!sameAsShipping) {
      for (const field of requiredFields) {
        if (!billingAddress[field as keyof BillingAddress]) {
          setError(`Please fill in the billing ${field.replace('_', ' ')} field`);
          return false;
        }
      }
    }
    
    setError('');
    return true;
  };

  const validatePaymentForm = (): boolean => {
    if (!paymentMethod) {
      setError('Please select a payment method');
      return false;
    }
    setError('');
    return true;
  };

  const calculateShippingCost = (): number => {
    const option = shippingOptions.find(opt => opt.id === shippingMethod);
    return option ? option.cost : 0;
  };

  const calculateTax = (): number => {
    return Math.round(total * 0.085 * 100) / 100; // 8.5% tax
  };

  const calculateTotal = (): number => {
    return total + calculateShippingCost() + calculateTax();
  };

  const loadUserData = async () => {
    try {
      const [addresses, paymentMethods] = await Promise.all([
        userProfileApi.getAddresses(),
        userProfileApi.getPaymentMethods()
      ]);
      
      setUserAddresses(addresses);
      setUserPaymentMethods(paymentMethods);

      // Auto-fill with default address if available
      const defaultAddress = addresses.find(addr => addr.is_default);
      if (defaultAddress) {
        setShippingAddress({
          name: defaultAddress.name,
          street: defaultAddress.street,
          city: defaultAddress.city,
          state: defaultAddress.state,
          postal_code: defaultAddress.postal_code,
          country: defaultAddress.country,
          phone: defaultAddress.phone || '',
        });
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      setError('');

      const orderRequestData = {
        shipping_address: shippingAddress,
        billing_address: sameAsShipping ? shippingAddress : billingAddress,
        payment_method: paymentMethod,
        shipping_method: shippingMethod,
        shipping_cost: calculateShippingCost(),
        customer_notes: customerNotes || null,
      };

      console.log('Placing order with data:', orderRequestData);

      const response = await api.post('/orders', orderRequestData);
      console.log('Order response:', response);

      // Check if the response is successful (status 200-299)
      if (response.status >= 200 && response.status < 300) {
        // Clear cart first
        dispatch(clearCart());
        
        // Clear checkout form data from localStorage
        localStorage.removeItem('checkout_shipping_address');
        localStorage.removeItem('checkout_payment_method');
        localStorage.removeItem('checkout_shipping_method');
        localStorage.removeItem('checkout_customer_notes');
        
        // Set order data for the modal
        setOrderData({
          orderNumber: response.data?.order?.order_number || response.data?.data?.order?.order_number || `ORD-${Date.now()}`,
          total: calculateTotal(),
          email: response.data?.order?.customer_email || response.data?.data?.order?.customer_email || user?.email || 'your email',
        });
        
        // Show success modal
        console.log('Opening success modal with data:', {
          orderNumber: response.data?.order?.order_number || response.data?.data?.order?.order_number || `ORD-${Date.now()}`,
          total: calculateTotal(),
          email: response.data?.order?.customer_email || response.data?.data?.order?.customer_email || user?.email || 'your email',
        });
        setOrderSuccessOpen(true);
        setSuccess('Order placed successfully!');
      } else {
        throw new Error(response.data?.error || response.data?.message || 'Failed to place order');
      }
    } catch (err: any) {
      console.error('Order error:', err);
      setError(err.response?.data?.error || err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number | string | null | undefined) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (numPrice == null || isNaN(numPrice)) {
      return '$0.00';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numPrice);
  };

  // Don't redirect if we're showing the success modal
  if (!isAuthenticated || ((!cart || cart.items.length === 0) && !orderSuccessOpen)) {
    return null;
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      py: 4
    }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <IconButton onClick={() => navigate('/cart')} sx={{ color: 'primary.main' }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant={isMobile ? "h4" : "h3"} component="h1" fontWeight="bold">
              🛒 Secure Checkout
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Complete your order securely and safely
          </Typography>
        </Box>

        {/* Enhanced Stepper */}
        <Paper sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <Stepper 
            activeStep={activeStep} 
            connector={<StyledStepConnector />}
            sx={{ 
              '& .MuiStepLabel-label': { 
                color: 'rgba(255,255,255,0.8)',
                fontWeight: 'bold',
                '&.Mui-active': { color: 'white' },
                '&.Mui-completed': { color: 'white' }
              }
            }}
          >
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel 
                  StepIconComponent={(props) => (
                    <CustomStepIcon 
                      {...props} 
                      icon={<step.icon />}
                    />
                  )}
                >
                  {!isMobile && step.label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            {activeStep === 0 && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Shipping Information
                </Typography>

                {/* Quick Address Selection */}
                {userAddresses.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Use saved address:
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {userAddresses.map((address) => (
                        <Button
                          key={address.id}
                          variant="outlined"
                          size="small"
                          onClick={() => setShippingAddress({
                            name: address.name,
                            street: address.street,
                            city: address.city,
                            state: address.state,
                            postal_code: address.postal_code,
                            country: address.country,
                            phone: address.phone || '',
                          })}
                          sx={{ textTransform: 'none' }}
                        >
                          {address.name}
                        </Button>
                      ))}
                    </Box>
                  </Box>
                )}
                
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={shippingAddress.name}
                      onChange={(e) => setShippingAddress({...shippingAddress, name: e.target.value})}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Street Address"
                      value={shippingAddress.street}
                      onChange={(e) => setShippingAddress({...shippingAddress, street: e.target.value})}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="City"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="State/Province"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Postal Code"
                      value={shippingAddress.postal_code}
                      onChange={(e) => setShippingAddress({...shippingAddress, postal_code: e.target.value})}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Country"
                      value={shippingAddress.country}
                      onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phone Number (Optional)"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3 }}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Shipping Method</FormLabel>
                    <RadioGroup
                      value={shippingMethod}
                      onChange={(e) => setShippingMethod(e.target.value)}
                    >
                      {shippingOptions.map((option) => (
                        <FormControlLabel
                          key={option.id}
                          value={option.id}
                          control={<Radio />}
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <option.icon />
                              <span>{option.label} - {option.cost === 0 ? 'Free' : formatPrice(option.cost)}</span>
                            </Box>
                          }
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Box>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Billing Address
                  </Typography>
                  <FormControlLabel
                    control={
                      <Radio
                        checked={sameAsShipping}
                        onChange={(e) => setSameAsShipping(e.target.checked)}
                      />
                    }
                    label="Same as shipping address"
                  />
                  
                  {!sameAsShipping && (
                    <Grid container spacing={3} sx={{ mt: 2 }}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          value={billingAddress.name}
                          onChange={(e) => setBillingAddress({...billingAddress, name: e.target.value})}
                          required
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Street Address"
                          value={billingAddress.street}
                          onChange={(e) => setBillingAddress({...billingAddress, street: e.target.value})}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="City"
                          value={billingAddress.city}
                          onChange={(e) => setBillingAddress({...billingAddress, city: e.target.value})}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="State/Province"
                          value={billingAddress.state}
                          onChange={(e) => setBillingAddress({...billingAddress, state: e.target.value})}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Postal Code"
                          value={billingAddress.postal_code}
                          onChange={(e) => setBillingAddress({...billingAddress, postal_code: e.target.value})}
                          required
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Country"
                          value={billingAddress.country}
                          onChange={(e) => setBillingAddress({...billingAddress, country: e.target.value})}
                          required
                        />
                      </Grid>
                    </Grid>
                  )}
                </Box>
              </Box>
            )}

            {activeStep === 1 && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Payment Method
                </Typography>
                
                <FormControl component="fieldset" fullWidth>
                  <RadioGroup
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    {paymentOptions.map((option) => (
                      <FormControlLabel
                        key={option.id}
                        value={option.id}
                        control={<Radio />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <option.icon />
                            <span>{option.label}</span>
                          </Box>
                        }
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>

                <Box sx={{ mt: 3 }}>
                  <TextField
                    fullWidth
                    label="Order Notes (Optional)"
                    multiline
                    rows={4}
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                    placeholder="Special instructions for your order..."
                  />
                </Box>
              </Box>
            )}

            {activeStep === 2 && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Review Your Order
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Shipping Address
                    </Typography>
                    <Typography variant="body2">
                      {shippingAddress.name}<br />
                      {shippingAddress.street}<br />
                      {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal_code}<br />
                      {shippingAddress.country}
                      {shippingAddress.phone && <><br />Phone: {shippingAddress.phone}</>}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Payment Method
                    </Typography>
                    <Typography variant="body2">
                      {paymentOptions.find(opt => opt.id === paymentMethod)?.label}
                    </Typography>
                    
                    <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                      Shipping Method
                    </Typography>
                    <Typography variant="body2">
                      {shippingOptions.find(opt => opt.id === shippingMethod)?.label}
                    </Typography>
                  </Grid>
                </Grid>

                {customerNotes && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Order Notes
                    </Typography>
                    <Typography variant="body2">
                      {customerNotes}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Back
              </Button>
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                  >
                    {loading ? 'Placing Order...' : 'Place Order'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              
              <List>
                {cart?.items.map((item, index) => (
                  <ListItem key={`${item.id}-${index}`} sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar
                        src={item.image_url || '/placeholder-product.jpg'}
                        alt={item.name}
                        variant="rounded"
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.name}
                      secondary={`Qty: ${item.quantity}`}
                    />
                    <Typography variant="body2">
                      {formatPrice(item.cart_price * item.quantity)}
                    </Typography>
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal:</Typography>
                <Typography>{formatPrice(total)}</Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Shipping:</Typography>
                <Typography>
                  {calculateShippingCost() === 0 ? 'Free' : formatPrice(calculateShippingCost())}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Tax:</Typography>
                <Typography>{formatPrice(calculateTax())}</Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6">
                  {formatPrice(calculateTotal())}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Order Success Modal */}
      <OrderSuccessModal
        open={orderSuccessOpen}
        onClose={() => {
          console.log('Modal close called');
          setOrderSuccessOpen(false);
        }}
        orderData={orderData}
      />
    </Container>
  </Box>
  );
};

export default CheckoutPage; 