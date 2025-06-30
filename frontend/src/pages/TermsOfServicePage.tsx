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
} from '@mui/material';
import {
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
  Gavel as GavelIcon,
  Security as SecurityIcon,
  Payment as PaymentIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const TermsOfServicePage: React.FC = () => {
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
            <Typography color="text.primary">Terms of Service</Typography>
          </Breadcrumbs>
          
          <Typography variant={isMobile ? "h4" : "h3"} component="h1" fontWeight="bold" gutterBottom>
            ⚖️ Terms of Service
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Please read these terms carefully before using our services.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                Acceptance of Terms
              </Typography>
              <Typography variant="body1" paragraph>
                By accessing and using our website and services, you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </Typography>
              
              <Card sx={{ bgcolor: 'warning.50', border: '1px solid', borderColor: 'warning.200', mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom color="warning.main">
                    ⚠️ Important Notice
                  </Typography>
                  <Typography variant="body2">
                    These terms constitute a legally binding agreement between you and our company. 
                    Continued use of our services indicates your acceptance of these terms.
                  </Typography>
                </CardContent>
              </Card>
            </Paper>

            <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                Use License
              </Typography>
              <Typography variant="body1" paragraph>
                Permission is granted to temporarily download one copy of the materials on our website 
                for personal, non-commercial transitory viewing only.
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Personal Use"
                    secondary="You may use our services for personal, non-commercial purposes"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Account Creation"
                    secondary="You may create an account to access personalized features"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon color="success" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Order Placement"
                    secondary="You may place orders for products available on our platform"
                  />
                </ListItem>
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" fontWeight="bold" gutterBottom color="error">
                Prohibited Uses
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <CancelIcon color="error" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Commercial Use"
                    secondary="Using our services for commercial purposes without permission"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CancelIcon color="error" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Illegal Activities"
                    secondary="Using our services for any illegal or unauthorized purpose"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CancelIcon color="error" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Security Violations"
                    secondary="Attempting to gain unauthorized access to our systems"
                  />
                </ListItem>
              </List>
            </Paper>

            <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                Payment Terms
              </Typography>
              <Typography variant="body1" paragraph>
                All purchases are subject to our payment terms and conditions. 
                We accept various payment methods and process payments securely.
              </Typography>
              
              <Box sx={{ display: 'grid', gap: 2 }}>
                <Card sx={{ bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom color="primary.main">
                      💳 Payment Methods
                    </Typography>
                    <Typography variant="body2">
                      We accept credit cards, debit cards, PayPal, and other secure payment methods.
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card sx={{ bgcolor: 'success.50', border: '1px solid', borderColor: 'success.200' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom color="success.main">
                      🔒 Secure Processing
                    </Typography>
                    <Typography variant="body2">
                      All payments are processed securely using industry-standard encryption.
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card sx={{ bgcolor: 'info.50', border: '1px solid', borderColor: 'info.200' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom color="info.main">
                      📋 Order Confirmation
                    </Typography>
                    <Typography variant="body2">
                      Orders are confirmed via email once payment is successfully processed.
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Paper>

            <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                Intellectual Property
              </Typography>
              <Typography variant="body1" paragraph>
                The content on this website, including text, graphics, logos, images, and software, 
                is the property of our company and is protected by copyright laws.
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <GavelIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Copyright Protection"
                    secondary="All content is protected by copyright and other intellectual property laws"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <SecurityIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Trademark Rights"
                    secondary="Our trademarks and service marks are protected under applicable law"
                  />
                </ListItem>
              </List>
            </Paper>

            <Paper sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                Limitation of Liability
              </Typography>
              <Typography variant="body1" paragraph>
                In no event shall our company or its suppliers be liable for any damages arising out of 
                the use or inability to use our services.
              </Typography>
              
              <Card sx={{ bgcolor: 'error.50', border: '1px solid', borderColor: 'error.200' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom color="error.main">
                    ⚠️ Disclaimer
                  </Typography>
                  <Typography variant="body2">
                    Our services are provided "as is" without any warranties, express or implied. 
                    We disclaim all warranties including merchantability and fitness for a particular purpose.
                  </Typography>
                </CardContent>
              </Card>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3, position: 'sticky', top: 20 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                📞 Need Help?
              </Typography>
              <Typography variant="body2" paragraph>
                If you have questions about these terms, contact our legal team:
              </Typography>
              
              <Box sx={{ display: 'grid', gap: 2 }}>
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    Legal Email:
                  </Typography>
                  <Typography variant="body2" color="primary">
                    legal@ecommerce.com
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
                    Address:
                  </Typography>
                  <Typography variant="body2">
                    123 Commerce St<br />
                    Business City, BC 12345<br />
                    United States
                  </Typography>
                </Box>
              </Box>
              
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

export default TermsOfServicePage; 