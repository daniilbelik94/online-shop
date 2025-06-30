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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
  Cookie as CookieIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  Analytics as AnalyticsIcon,
  ShoppingCart as ShoppingCartIcon,
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const CookiePolicyPage: React.FC = () => {
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
            <Typography color="text.primary">Cookie Policy</Typography>
          </Breadcrumbs>
          
          <Typography variant={isMobile ? "h4" : "h3"} component="h1" fontWeight="bold" gutterBottom>
            🍪 Cookie Policy
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Learn how we use cookies to enhance your browsing experience and improve our services.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                What Are Cookies?
              </Typography>
              <Typography variant="body1" paragraph>
                Cookies are small text files that are stored on your device when you visit our website. 
                They help us provide you with a better experience by remembering your preferences and 
                analyzing how you use our site.
              </Typography>
              
              <Card sx={{ bgcolor: 'info.50', border: '1px solid', borderColor: 'info.200', mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom color="info.main">
                    ℹ️ Cookie Information
                  </Typography>
                  <Typography variant="body2">
                    Cookies are essential for the proper functioning of our website and help us 
                    provide you with personalized content and services. By continuing to use our site, 
                    you consent to our use of cookies as described in this policy.
                  </Typography>
                </CardContent>
              </Card>
            </Paper>

            <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                Types of Cookies We Use
              </Typography>
              <Typography variant="body1" paragraph>
                We use different types of cookies for various purposes to enhance your experience.
              </Typography>
              
              <Box sx={{ display: 'grid', gap: 3 }}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <SecurityIcon color="primary" sx={{ mr: 2 }} />
                      <Typography variant="h6" fontWeight="bold">
                        Essential Cookies
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" paragraph>
                      These cookies are necessary for the website to function properly. They enable basic 
                      functions like page navigation, access to secure areas, and form submissions.
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Authentication and security" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Shopping cart functionality" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CheckCircleIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Language preferences" />
                      </ListItem>
                    </List>
                    <Chip label="Cannot be disabled" color="error" size="small" />
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <AnalyticsIcon color="primary" sx={{ mr: 2 }} />
                      <Typography variant="h6" fontWeight="bold">
                        Analytics Cookies
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" paragraph>
                      These cookies help us understand how visitors interact with our website by 
                      collecting and reporting information anonymously.
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <InfoIcon color="info" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Page views and navigation patterns" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <InfoIcon color="info" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Popular products and categories" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <InfoIcon color="info" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Error tracking and performance monitoring" />
                      </ListItem>
                    </List>
                    <Chip label="Can be disabled" color="warning" size="small" />
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <ShoppingCartIcon color="primary" sx={{ mr: 2 }} />
                      <Typography variant="h6" fontWeight="bold">
                        Functional Cookies
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" paragraph>
                      These cookies enable enhanced functionality and personalization, such as 
                      remembering your preferences and providing personalized content.
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <InfoIcon color="info" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="User preferences and settings" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <InfoIcon color="info" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Personalized recommendations" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <InfoIcon color="info" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Wishlist and recently viewed items" />
                      </ListItem>
                    </List>
                    <Chip label="Can be disabled" color="warning" size="small" />
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <SettingsIcon color="primary" sx={{ mr: 2 }} />
                      <Typography variant="h6" fontWeight="bold">
                        Marketing Cookies
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" paragraph>
                      These cookies are used to track visitors across websites to display relevant 
                      advertisements and measure the effectiveness of marketing campaigns.
                    </Typography>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <InfoIcon color="info" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Targeted advertising" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <InfoIcon color="info" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Social media integration" />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <InfoIcon color="info" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Campaign effectiveness tracking" />
                      </ListItem>
                    </List>
                    <Chip label="Can be disabled" color="warning" size="small" />
                  </AccordionDetails>
                </Accordion>
              </Box>
            </Paper>

            <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                Managing Your Cookie Preferences
              </Typography>
              <Typography variant="body1" paragraph>
                You have control over which cookies you accept. Here's how you can manage your preferences.
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: 'success.50', border: '1px solid', borderColor: 'success.200', height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom color="success.main">
                        🌐 Browser Settings
                      </Typography>
                      <Typography variant="body2" paragraph>
                        Most web browsers allow you to control cookies through their settings. 
                        You can usually find these settings in the "Privacy" or "Security" section.
                      </Typography>
                      <List dense>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemText primary="• Chrome: Settings > Privacy and security" />
                        </ListItem>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemText primary="• Firefox: Options > Privacy & Security" />
                        </ListItem>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemText primary="• Safari: Preferences > Privacy" />
                        </ListItem>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemText primary="• Edge: Settings > Cookies and permissions" />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: 'info.50', border: '1px solid', borderColor: 'info.200', height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom color="info.main">
                        ⚙️ Cookie Consent
                      </Typography>
                      <Typography variant="body2" paragraph>
                        When you first visit our website, you'll see a cookie consent banner 
                        where you can choose which types of cookies to accept.
                      </Typography>
                      <List dense>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemText primary="• Accept all cookies" />
                        </ListItem>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemText primary="• Accept essential cookies only" />
                        </ListItem>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemText primary="• Customize preferences" />
                        </ListItem>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemText primary="• Reject non-essential cookies" />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                Third-Party Cookies
              </Typography>
              <Typography variant="body1" paragraph>
                Some cookies on our website are set by third-party services that we use to 
                enhance functionality and provide better services.
              </Typography>
              
              <Box sx={{ display: 'grid', gap: 2 }}>
                <Card sx={{ bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom color="primary.main">
                      📊 Google Analytics
                    </Typography>
                    <Typography variant="body2">
                      We use Google Analytics to understand how visitors use our website. 
                      This helps us improve our services and user experience.
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card sx={{ bgcolor: 'success.50', border: '1px solid', borderColor: 'success.200' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom color="success.main">
                      💳 Payment Processors
                    </Typography>
                    <Typography variant="body2">
                      Payment processors like PayPal and Stripe may set cookies to ensure 
                      secure and smooth payment processing.
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card sx={{ bgcolor: 'warning.50', border: '1px solid', borderColor: 'warning.200' }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom color="warning.main">
                      📱 Social Media
                    </Typography>
                    <Typography variant="body2">
                      Social media platforms may set cookies when you interact with social 
                      sharing buttons or embedded content on our website.
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3, position: 'sticky', top: 20 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                🍪 Cookie Settings
              </Typography>
              <Typography variant="body2" paragraph>
                Manage your cookie preferences here:
              </Typography>
              
              <Box sx={{ display: 'grid', gap: 2, mb: 3 }}>
                <Chip 
                  label="Essential Cookies" 
                  color="success" 
                  variant="outlined"
                  icon={<CheckCircleIcon />}
                />
                <Chip 
                  label="Analytics Cookies" 
                  color="warning" 
                  variant="outlined"
                  icon={<AnalyticsIcon />}
                />
                <Chip 
                  label="Functional Cookies" 
                  color="warning" 
                  variant="outlined"
                  icon={<SettingsIcon />}
                />
                <Chip 
                  label="Marketing Cookies" 
                  color="warning" 
                  variant="outlined"
                  icon={<ShoppingCartIcon />}
                />
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                📞 Questions?
              </Typography>
              <Typography variant="body2" paragraph>
                If you have questions about our cookie policy, contact us:
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
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Card sx={{ bgcolor: 'info.50', border: '1px solid', borderColor: 'info.200' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom color="info.main">
                    💡 Did You Know?
                  </Typography>
                  <Typography variant="body2">
                    • Cookies help us remember your preferences<br />
                    • They make your shopping experience faster<br />
                    • You can disable non-essential cookies anytime<br />
                    • Essential cookies are required for basic functionality
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

export default CookiePolicyPage; 