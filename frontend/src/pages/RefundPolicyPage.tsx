import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Breadcrumbs,
  Link,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Grid,
  Chip,
} from '@mui/material';
import {
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
  MoneyOff as MoneyOffIcon,
  Schedule as ScheduleIcon,
  LocalShipping as LocalShippingIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const RefundPolicyPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      py: 4
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Breadcrumbs 
            separator={<NavigateNextIcon fontSize="small" />}
            sx={{ mb: 2 }}
          >
            <Link
              color="inherit"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
            >
              <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
              Home
            </Link>
            <Typography color="text.primary">Refund Policy</Typography>
          </Breadcrumbs>
          
          <Typography variant={isMobile ? "h4" : "h3"} component="h1" fontWeight="bold" gutterBottom>
            💰 Refund Policy
          </Typography>
          <Typography variant="h6" color="text.secondary">
            We want you to be completely satisfied with your purchase. Learn about our refund process.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                Return Window
              </Typography>
              <Typography variant="body1" paragraph>
                We offer a 30-day return window for most items. This means you have 30 days from the date 
                of delivery to initiate a return.
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 3 }}>
                <Chip 
                  icon={<ScheduleIcon />} 
                  label="30 Days" 
                  color="primary" 
                  variant="outlined"
                />
                <Chip 
                  icon={<CheckCircleIcon />} 
                  label="Free Returns" 
                  color="success" 
                  variant="outlined"
                />
                <Chip 
                  icon={<RefreshIcon />} 
                  label="Easy Process" 
                  color="info" 
                  variant="outlined"
                />
              </Box>
              
              <Card sx={{ bgcolor: 'info.50', border: '1px solid', borderColor: 'info.200' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom color="info.main">
                    📅 Return Timeline
                  </Typography>
                  <Typography variant="body2">
                    • Day 1-30: Full refund available<br />
                    • Day 31-60: Store credit only<br />
                    • After 60 days: No returns accepted
                  </Typography>
                </CardContent>
              </Card>
            </Paper>

            <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                Eligible Items
              </Typography>
              <Typography variant="body1" paragraph>
                Most items are eligible for return, but some restrictions apply based on product type and condition.
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: 'success.50', border: '1px solid', borderColor: 'success.200', height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom color="success.main">
                        ✅ Eligible for Return
                      </Typography>
                      <List dense>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckCircleIcon color="success" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Unused items in original packaging" />
                        </ListItem>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckCircleIcon color="success" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Defective products" />
                        </ListItem>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckCircleIcon color="success" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Wrong items received" />
                        </ListItem>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckCircleIcon color="success" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Damaged during shipping" />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: 'error.50', border: '1px solid', borderColor: 'error.200', height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom color="error.main">
                        ❌ Not Eligible
                      </Typography>
                      <List dense>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CancelIcon color="error" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Used or damaged items" />
                        </ListItem>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CancelIcon color="error" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Personal care items" />
                        </ListItem>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CancelIcon color="error" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Digital downloads" />
                        </ListItem>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CancelIcon color="error" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Gift cards" />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                Return Process
              </Typography>
              <Typography variant="body1" paragraph>
                Follow these simple steps to return your item and get your refund.
              </Typography>
              
              <Box sx={{ display: 'grid', gap: 3 }}>
                <Card sx={{ bgcolor: 'grey.50' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: '50%', 
                        bgcolor: 'primary.main', 
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        fontWeight: 'bold'
                      }}>
                        1
                      </Box>
                      <Typography variant="h6" fontWeight="bold">
                        Initiate Return
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      Log into your account and go to "My Orders". Find the order you want to return 
                      and click "Return Item". Select the reason for return and submit your request.
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card sx={{ bgcolor: 'grey.50' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: '50%', 
                        bgcolor: 'primary.main', 
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        fontWeight: 'bold'
                      }}>
                        2
                      </Box>
                      <Typography variant="h6" fontWeight="bold">
                        Print Label
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      Once approved, you'll receive a prepaid shipping label via email. 
                      Print the label and attach it to your package.
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card sx={{ bgcolor: 'grey.50' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: '50%', 
                        bgcolor: 'primary.main', 
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        fontWeight: 'bold'
                      }}>
                        3
                      </Box>
                      <Typography variant="h6" fontWeight="bold">
                        Ship Package
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      Package your item securely in its original packaging and drop it off at any 
                      authorized shipping location or schedule a pickup.
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card sx={{ bgcolor: 'grey.50' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: '50%', 
                        bgcolor: 'success.main', 
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        fontWeight: 'bold'
                      }}>
                        4
                      </Box>
                      <Typography variant="h6" fontWeight="bold">
                        Receive Refund
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      Once we receive and inspect your return, we'll process your refund within 3-5 business days. 
                      You'll receive an email confirmation when the refund is issued.
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Paper>

            <Paper sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                Refund Methods
              </Typography>
              <Typography variant="body1" paragraph>
                Refunds are processed to the original payment method used for the purchase.
              </Typography>
              
              <Box sx={{ display: 'grid', gap: 2 }}>
                <Card sx={{ bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom color="primary.main">
                      💳 Credit/Debit Cards
                    </Typography>
                    <Typography variant="body2">
                      Refunds typically appear on your statement within 3-5 business days, 
                      depending on your bank's processing time.
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card sx={{ bgcolor: 'success.50', border: '1px solid', borderColor: 'success.200' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom color="success.main">
                      💰 PayPal
                    </Typography>
                    <Typography variant="body2">
                      PayPal refunds are usually processed within 24 hours and appear in your PayPal balance.
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card sx={{ bgcolor: 'info.50', border: '1px solid', borderColor: 'info.200' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom color="info.main">
                      🎁 Store Credit
                    </Typography>
                    <Typography variant="body2">
                      If you choose store credit, it will be added to your account immediately 
                      and can be used for future purchases.
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3, position: 'sticky', top: 20 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                📞 Need Help?
              </Typography>
              <Typography variant="body2" paragraph>
                Questions about returns or refunds? Contact our customer service:
              </Typography>
              
              <Box sx={{ display: 'grid', gap: 2 }}>
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    Email:
                  </Typography>
                  <Typography variant="body2" color="primary">
                    returns@ecommerce.com
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    Phone:
                  </Typography>
                  <Typography variant="body2">
                    +1 (555) 123-4567
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    Live Chat:
                  </Typography>
                  <Typography variant="body2" color="primary">
                    Available 24/7
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Card sx={{ bgcolor: 'warning.50', border: '1px solid', borderColor: 'warning.200' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom color="warning.main">
                    ⚠️ Important Notes
                  </Typography>
                  <Typography variant="body2">
                    • Return shipping is free for eligible items<br />
                    • Keep your tracking number for reference<br />
                    • Damaged items must be reported within 48 hours
                  </Typography>
                </CardContent>
              </Card>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="body2" color="text.secondary">
                <strong>Last updated:</strong> June 30, 2025
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default RefundPolicyPage; 