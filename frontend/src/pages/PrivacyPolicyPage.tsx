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
  Security as SecurityIcon,
  Visibility as VisibilityIcon,
  DataUsage as DataUsageIcon,
  Share as ShareIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicyPage: React.FC = () => {
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
            <Typography color="text.primary">Privacy Policy</Typography>
          </Breadcrumbs>
          
          <Typography variant={isMobile ? "h4" : "h3"} component="h1" fontWeight="bold" gutterBottom>
            🔒 Privacy Policy
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Your privacy is important to us. Learn how we protect and handle your information.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                Information We Collect
              </Typography>
              <Typography variant="body1" paragraph>
                We collect information you provide directly to us, such as when you create an account, 
                make a purchase, or contact our customer service team.
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <VisibilityIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Personal Information"
                    secondary="Name, email address, phone number, shipping and billing addresses"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <DataUsageIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Usage Information"
                    secondary="How you interact with our website, products, and services"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <SettingsIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Device Information"
                    secondary="IP address, browser type, operating system, and device identifiers"
                  />
                </ListItem>
              </List>
            </Paper>

            <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                How We Use Your Information
              </Typography>
              <Typography variant="body1" paragraph>
                We use the information we collect to provide, maintain, and improve our services, 
                process transactions, and communicate with you.
              </Typography>
              
              <Box sx={{ display: 'grid', gap: 2 }}>
                <Card sx={{ bgcolor: 'grey.50' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      🛒 Order Processing
                    </Typography>
                    <Typography variant="body2">
                      Process and fulfill your orders, send order confirmations, and provide customer support.
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card sx={{ bgcolor: 'grey.50' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      📧 Communication
                    </Typography>
                    <Typography variant="body2">
                      Send you updates about your orders, promotional offers, and important service announcements.
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card sx={{ bgcolor: 'grey.50' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      🔧 Service Improvement
                    </Typography>
                    <Typography variant="body2">
                      Analyze usage patterns to improve our website, products, and customer experience.
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Paper>

            <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                Information Sharing
              </Typography>
              <Typography variant="body1" paragraph>
                We do not sell, trade, or otherwise transfer your personal information to third parties 
                without your consent, except as described in this policy.
              </Typography>
              
              <List>
                <ListItem>
                  <ListItemIcon>
                    <ShareIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Service Providers"
                    secondary="We may share information with trusted third-party service providers who assist us in operating our website and serving you"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <SecurityIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Legal Requirements"
                    secondary="We may disclose information when required by law or to protect our rights and safety"
                  />
                </ListItem>
              </List>
            </Paper>

            <Paper sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                Your Rights
              </Typography>
              <Typography variant="body1" paragraph>
                You have the right to access, update, or delete your personal information. 
                You can also opt out of marketing communications at any time.
              </Typography>
              
              <Box sx={{ display: 'grid', gap: 2 }}>
                <Card sx={{ bgcolor: 'success.50', border: '1px solid', borderColor: 'success.200' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom color="success.main">
                      👁️ Access Your Data
                    </Typography>
                    <Typography variant="body2">
                      Request a copy of the personal information we hold about you.
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card sx={{ bgcolor: 'info.50', border: '1px solid', borderColor: 'info.200' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom color="info.main">
                      ✏️ Update Information
                    </Typography>
                    <Typography variant="body2">
                      Correct or update your personal information through your account settings.
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card sx={{ bgcolor: 'warning.50', border: '1px solid', borderColor: 'warning.200' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom color="warning.main">
                      🗑️ Delete Account
                    </Typography>
                    <Typography variant="body2">
                      Request deletion of your account and associated personal information.
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3, position: 'sticky', top: 20 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                📞 Contact Us
              </Typography>
              <Typography variant="body2" paragraph>
                If you have any questions about this Privacy Policy, please contact us:
              </Typography>
              
              <Box sx={{ display: 'grid', gap: 2 }}>
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    Email:
                  </Typography>
                  <Typography variant="body2" color="primary">
                    privacy@ecommerce.com
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

export default PrivacyPolicyPage; 