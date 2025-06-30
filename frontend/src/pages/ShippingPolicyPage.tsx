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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
  LocalShipping as LocalShippingIcon,
  Schedule as ScheduleIcon,
  LocationOn as LocationOnIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ShippingPolicyPage: React.FC = () => {
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
            <Typography color="text.primary">Shipping Policy</Typography>
          </Breadcrumbs>
          
          <Typography variant={isMobile ? "h4" : "h3"} component="h1" fontWeight="bold" gutterBottom>
            🚚 Shipping Policy
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Fast, reliable shipping to get your orders to you quickly and safely.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                Shipping Options
              </Typography>
              <Typography variant="body1" paragraph>
                We offer multiple shipping options to meet your needs and budget. 
                Choose the option that works best for you.
              </Typography>
              
              <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'primary.main' }}>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Service</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Delivery Time</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cost</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Features</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <SpeedIcon color="primary" sx={{ mr: 1 }} />
                          <Typography fontWeight="bold">Express</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>1-2 business days</TableCell>
                      <TableCell>$15.99</TableCell>
                      <TableCell>
                        <Chip label="Priority" size="small" color="primary" />
                        <Chip label="Tracking" size="small" color="success" sx={{ ml: 0.5 }} />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocalShippingIcon color="primary" sx={{ mr: 1 }} />
                          <Typography fontWeight="bold">Standard</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>3-5 business days</TableCell>
                      <TableCell>$9.99</TableCell>
                      <TableCell>
                        <Chip label="Tracking" size="small" color="success" />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <ScheduleIcon color="primary" sx={{ mr: 1 }} />
                          <Typography fontWeight="bold">Economy</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>5-8 business days</TableCell>
                      <TableCell>$5.99</TableCell>
                      <TableCell>
                        <Chip label="Basic" size="small" color="default" />
                      </TableCell>
                    </TableRow>
                    <TableRow sx={{ bgcolor: 'success.50' }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                          <Typography fontWeight="bold">Free Shipping</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>5-8 business days</TableCell>
                      <TableCell>FREE</TableCell>
                      <TableCell>
                        <Chip label="Orders $50+" size="small" color="success" />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                Shipping Destinations
              </Typography>
              <Typography variant="body1" paragraph>
                We ship to most countries worldwide. Shipping times and costs vary by location.
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200', height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom color="primary.main">
                        🇺🇸 Domestic (USA)
                      </Typography>
                      <List dense>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckCircleIcon color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="All 50 states" />
                        </ListItem>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckCircleIcon color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Puerto Rico" />
                        </ListItem>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckCircleIcon color="primary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="US Territories" />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: 'info.50', border: '1px solid', borderColor: 'info.200', height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom color="info.main">
                        🌍 International
                      </Typography>
                      <List dense>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckCircleIcon color="info" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Canada & Mexico" />
                        </ListItem>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckCircleIcon color="info" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="European Union" />
                        </ListItem>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckCircleIcon color="info" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Most Countries" />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                Order Processing
              </Typography>
              <Typography variant="body1" paragraph>
                Here's what happens after you place your order.
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
                        Order Confirmation
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      You'll receive an email confirmation immediately after placing your order 
                      with your order number and estimated delivery date.
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
                        Processing
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      We process orders within 1-2 business days. You'll receive a shipping 
                      confirmation email with tracking information once your order ships.
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
                        3
                      </Box>
                      <Typography variant="h6" fontWeight="bold">
                        Delivery
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      Your package will be delivered to your specified address. 
                      Most deliveries require a signature for orders over $100.
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Paper>

            <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                Tracking Your Order
              </Typography>
              <Typography variant="body1" paragraph>
                Stay updated on your order's progress with our comprehensive tracking system.
              </Typography>
              
              <Box sx={{ display: 'grid', gap: 2 }}>
                <Card sx={{ bgcolor: 'success.50', border: '1px solid', borderColor: 'success.200' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom color="success.main">
                      📧 Email Updates
                    </Typography>
                    <Typography variant="body2">
                      Receive automatic email updates at each stage of your order's journey.
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card sx={{ bgcolor: 'info.50', border: '1px solid', borderColor: 'info.200' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom color="info.main">
                      📱 Mobile App
                    </Typography>
                    <Typography variant="body2">
                      Track your orders in real-time through our mobile app with push notifications.
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card sx={{ bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom color="primary.main">
                      🌐 Online Tracking
                    </Typography>
                    <Typography variant="body2">
                      Use your order number to track your package on our website or the carrier's website.
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Paper>

            <Paper sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                Shipping Restrictions
              </Typography>
              <Typography variant="body1" paragraph>
                Some items have shipping restrictions due to size, weight, or destination regulations.
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: 'warning.50', border: '1px solid', borderColor: 'warning.200', height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom color="warning.main">
                        ⚠️ Restricted Items
                      </Typography>
                      <List dense>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <WarningIcon color="warning" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Hazardous materials" />
                        </ListItem>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <WarningIcon color="warning" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Perishable goods" />
                        </ListItem>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <WarningIcon color="warning" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Oversized items" />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: 'error.50', border: '1px solid', borderColor: 'error.200', height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom color="error.main">
                        🚫 Prohibited Destinations
                      </Typography>
                      <List dense>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <InfoIcon color="error" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="PO Boxes (some items)" />
                        </ListItem>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <InfoIcon color="error" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="International restrictions" />
                        </ListItem>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <InfoIcon color="error" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Military addresses" />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3, position: 'sticky', top: 20 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                📞 Shipping Support
              </Typography>
              <Typography variant="body2" paragraph>
                Need help with shipping? Contact our shipping team:
              </Typography>
              
              <Box sx={{ display: 'grid', gap: 2 }}>
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    Email:
                  </Typography>
                  <Typography variant="body2" color="primary">
                    shipping@ecommerce.com
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
              
              <Card sx={{ bgcolor: 'info.50', border: '1px solid', borderColor: 'info.200' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom color="info.main">
                    💡 Pro Tips
                  </Typography>
                  <Typography variant="body2">
                    • Orders placed before 2 PM ship same day<br />
                    • Free shipping on orders over $50<br />
                    • Track your package in real-time<br />
                    • Contact us for expedited shipping
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

export default ShippingPolicyPage; 