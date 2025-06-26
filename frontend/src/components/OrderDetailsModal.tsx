import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Divider,
  Chip,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  StepIcon,
  useTheme,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Link,
} from '@mui/material';
import {
  Close as CloseIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  LocalShipping as ShippingIcon,
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Cancel as CancelIcon,
  LocalOffer as OfferIcon,
  Star as StarIcon,
  Favorite as FavoriteIcon,
  ExpandMore as ExpandMoreIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  CreditCard as CreditCardIcon,
  AccountBalance as BankIcon,
  ShoppingCart as CartIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
  Security as SecurityIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';
import { Order } from '../types';

interface OrderDetailsModalProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
  onReorder?: (order: Order) => void;
  onTrackShipment?: (order: Order) => void;
  onCancelOrder?: (order: Order) => void;
  onReturnOrder?: (order: Order) => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  open,
  onClose,
  order,
  onReorder,
  onTrackShipment,
  onCancelOrder,
  onReturnOrder,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (!order) return null;

  const formatPrice = (price: number | string | null | undefined): string => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numPrice != null && !isNaN(numPrice) ? `$${numPrice.toFixed(2)}` : '$0.00';
  };

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Unknown date';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <CheckCircleIcon />;
      case 'cancelled':
        return <CancelIcon />;
      case 'pending':
        return <PendingIcon />;
      case 'processing':
      case 'shipped':
        return <ShippingIcon />;
      default:
        return <ScheduleIcon />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'pending':
        return 'warning';
      case 'processing':
      case 'shipped':
        return 'info';
      default:
        return 'default';
    }
  };

  const orderSteps = [
    { label: 'Order Placed', date: order.created_at, completed: true },
    { label: 'Payment Confirmed', date: order.created_at, completed: order.payment_status === 'paid' },
    { label: 'Processing', date: order.updated_at, completed: ['processing', 'shipped', 'delivered'].includes(order.status || '') },
    { label: 'Shipped', date: order.shipped_at, completed: ['shipped', 'delivered'].includes(order.status || '') },
    { label: 'Delivered', date: order.delivered_at, completed: order.status === 'delivered' },
  ];

  const paymentMethodIcon = (method: string) => {
    switch (method?.toLowerCase()) {
      case 'paypal':
        return '💰';
      case 'credit_card':
      case 'card':
        return '💳';
      case 'bank_transfer':
        return '🏦';
      case 'apple_pay':
        return '🍎';
      case 'google_pay':
        return '📱';
      default:
        return '💳';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a downloadable invoice/receipt
    const content = `
      Order Receipt - ${order.order_number}
      
      Order Date: ${formatDate(order.created_at)}
      Status: ${order.status}
      Total: ${formatPrice(order.total)}
      
      Items:
      ${order.items?.map(item => `- ${item.product_name} (Qty: ${item.quantity}) - ${formatPrice(item.price)}`).join('\n')}
      
      Shipping Address:
      ${order.shipping_address}
      
      Thank you for your order!
    `;
    
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `order-${order.order_number}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 3,
          maxHeight: '95vh',
          height: isMobile ? '100vh' : 'auto',
        }
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ 
        p: 3, 
        pb: 2,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Order Details
            </Typography>
            <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
              {order.order_number}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton onClick={handlePrint} sx={{ color: 'white' }}>
              <PrintIcon />
            </IconButton>
            <IconButton onClick={handleDownload} sx={{ color: 'white' }}>
              <DownloadIcon />
            </IconButton>
            <IconButton onClick={onClose} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          {/* Order Status & Progress */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 3, bgcolor: 'grey.50' }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ 
                    bgcolor: `${getStatusColor(order.status || '')}.main`,
                    width: 56,
                    height: 56
                  }}>
                    {getStatusIcon(order.status || '')}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Unknown'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Order Status
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {formatPrice(order.total)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Order Total
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body1" fontWeight="bold">
                    {formatDate(order.created_at)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Order Date
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Order Timeline */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                📋 Order Timeline
              </Typography>
              <Stepper 
                activeStep={orderSteps.findIndex(step => !step.completed)} 
                orientation={isMobile ? 'vertical' : 'horizontal'}
                sx={{ mt: 2 }}
              >
                {orderSteps.map((step, index) => (
                  <Step key={step.label} completed={step.completed}>
                    <StepLabel>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {step.label}
                        </Typography>
                        {step.date && step.completed && (
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(step.date)}
                          </Typography>
                        )}
                      </Box>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
          </Paper>

          {/* Order Items */}
          <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              🛍️ Order Items ({order.items?.length || 0})
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar
                            src={item.product_image || '/placeholder-product.jpg'}
                            alt={item.product_name}
                            sx={{ width: 60, height: 60 }}
                            variant="rounded"
                          />
                          <Box>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {item.product_name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              SKU: {item.product_id}
                            </Typography>
                            {item.product_attributes && (
                              <Typography variant="caption" color="text.secondary">
                                {item.product_attributes}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Chip label={item.quantity} size="small" />
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="bold">
                          {formatPrice(item.price)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="bold" color="primary">
                          {formatPrice(Number(item.price) * Number(item.quantity))}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Order Summary */}
            <Box sx={{ mt: 3, maxWidth: 400, ml: 'auto' }}>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal:</Typography>
                <Typography>{formatPrice(order.subtotal || order.total)}</Typography>
              </Box>
              {order.tax_amount && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Tax:</Typography>
                  <Typography>{formatPrice(order.tax_amount)}</Typography>
                </Box>
              )}
              {order.shipping_cost && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Shipping:</Typography>
                  <Typography>{formatPrice(order.shipping_cost)}</Typography>
                </Box>
              )}
              {order.discount_amount && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography color="success.main">Discount:</Typography>
                  <Typography color="success.main">-{formatPrice(order.discount_amount)}</Typography>
                </Box>
              )}
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" fontWeight="bold">Total:</Typography>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  {formatPrice(order.total)}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Payment & Shipping Info */}
          <Grid container spacing={3}>
            {/* Payment Information */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  💳 Payment Information
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Typography variant="h4">
                    {paymentMethodIcon(order.payment_method || '')}
                  </Typography>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {order.payment_method?.replace('_', ' ').toUpperCase() || 'Unknown'}
                    </Typography>
                    <Chip
                      label={order.payment_status === 'paid' ? 'Paid' : 'Pending'}
                      color={order.payment_status === 'paid' ? 'success' : 'warning'}
                      size="small"
                    />
                  </Box>
                </Box>
                
                <List dense>
                  <ListItem>
                    <ListItemIcon><ReceiptIcon /></ListItemIcon>
                    <ListItemText
                      primary="Transaction ID"
                      secondary={order.transaction_id || 'N/A'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><ScheduleIcon /></ListItemIcon>
                    <ListItemText
                      primary="Payment Date"
                      secondary={formatDate(order.created_at)}
                    />
                  </ListItem>
                  {order.payment_notes && (
                    <ListItem>
                      <ListItemIcon><InfoIcon /></ListItemIcon>
                      <ListItemText
                        primary="Notes"
                        secondary={order.payment_notes}
                      />
                    </ListItem>
                  )}
                </List>
              </Paper>
            </Grid>

            {/* Shipping Information */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  🚚 Shipping Information
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    Shipping Method
                  </Typography>
                  <Chip
                    label={order.shipping_method?.replace('_', ' ').toUpperCase() || 'Standard'}
                    color="info"
                    size="small"
                  />
                </Box>

                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Shipping Address
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
                  {order.shipping_address}
                </Typography>

                {order.billing_address && order.billing_address !== order.shipping_address && (
                  <>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Billing Address
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, whiteSpace: 'pre-line' }}>
                      {order.billing_address}
                    </Typography>
                  </>
                )}

                {order.tracking_number && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Tracking Number
                    </Typography>
                    <Link href="#" underline="hover" sx={{ fontFamily: 'monospace' }}>
                      {order.tracking_number}
                    </Link>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>

          {/* Customer Notes */}
          {order.customer_notes && (
            <Paper sx={{ p: 3, mt: 3, borderRadius: 3, bgcolor: 'grey.50' }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                📝 Order Notes
              </Typography>
              <Typography variant="body2">
                {order.customer_notes}
              </Typography>
            </Paper>
          )}

          {/* Order Actions */}
          <Paper sx={{ p: 3, mt: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              🎯 Order Actions
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              {order.can_be_cancelled && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<CancelIcon />}
                  onClick={() => onCancelOrder?.(order)}
                >
                  Cancel Order
                </Button>
              )}
              {order.status === 'delivered' && (
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={() => onReturnOrder?.(order)}
                >
                  Return Items
                </Button>
              )}
              {(order.status === 'shipped' || order.status === 'processing') && (
                <Button
                  variant="outlined"
                  color="info"
                  startIcon={<ShippingIcon />}
                  onClick={() => onTrackShipment?.(order)}
                >
                  Track Shipment
                </Button>
              )}
              <Button
                variant="contained"
                startIcon={<CartIcon />}
                onClick={() => onReorder?.(order)}
              >
                Reorder Items
              </Button>
            </Box>
          </Paper>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
          Close
        </Button>
        <Button 
          onClick={handlePrint} 
          variant="contained" 
          startIcon={<PrintIcon />}
          sx={{ borderRadius: 2 }}
        >
          Print Receipt
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailsModal; 