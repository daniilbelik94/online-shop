import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Breadcrumbs,
  Link,
  Divider,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Grid,
  TextField,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Button,
} from '@mui/material';
import {
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  ShoppingCart as ShoppingCartIcon,
  LocalShipping as LocalShippingIcon,
  Payment as PaymentIcon,
  AccountCircle as AccountCircleIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
  CheckCircle as CheckCircleIcon,
  Help as HelpIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const HelpCenterPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchQuery, setSearchQuery] = useState('');

  const helpCategories = [
    {
      title: 'Shopping & Orders',
      icon: <ShoppingCartIcon />,
      color: 'primary',
      articles: [
        {
          question: 'How do I place an order?',
          answer: 'To place an order, simply browse our products, add items to your cart, and proceed to checkout. You can pay using credit cards, PayPal, or Apple Pay.'
        },
        {
          question: 'Can I modify or cancel my order?',
          answer: 'You can modify or cancel your order within 1 hour of placing it. After that, please contact our customer service team for assistance.'
        },
        {
          question: 'How do I track my order?',
          answer: 'You can track your order by logging into your account and visiting the "My Orders" section, or by using the tracking number sent to your email.'
        }
      ]
    },
    {
      title: 'Shipping & Delivery',
      icon: <LocalShippingIcon />,
      color: 'success',
      articles: [
        {
          question: 'How long does shipping take?',
          answer: 'Shipping times vary by location and service chosen. Standard shipping takes 3-5 business days, while express shipping takes 1-2 business days.'
        },
        {
          question: 'Do you offer free shipping?',
          answer: 'Yes! We offer free shipping on all orders over $50. For orders under $50, shipping costs start at $5.99.'
        },
        {
          question: 'Can I change my shipping address?',
          answer: 'You can change your shipping address within 1 hour of placing your order. After that, please contact customer service immediately.'
        }
      ]
    },
    {
      title: 'Payment & Billing',
      icon: <PaymentIcon />,
      color: 'info',
      articles: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept Visa, Mastercard, PayPal, and Apple Pay. All payments are processed securely using industry-standard encryption.'
        },
        {
          question: 'Is my payment information secure?',
          answer: 'Yes, we use SSL encryption and never store your full credit card information. All payments are processed through secure payment gateways.'
        },
        {
          question: 'Can I get a refund?',
          answer: 'Yes, we offer a 30-day return policy for most items. Refunds are processed to your original payment method within 3-5 business days.'
        }
      ]
    },
    {
      title: 'Account & Profile',
      icon: <AccountCircleIcon />,
      color: 'warning',
      articles: [
        {
          question: 'How do I create an account?',
          answer: 'Click the "Sign Up" button in the top right corner, fill in your information, and verify your email address to create your account.'
        },
        {
          question: 'I forgot my password. What should I do?',
          answer: 'Click "Forgot Password" on the login page, enter your email address, and follow the instructions sent to your email to reset your password.'
        },
        {
          question: 'How do I update my profile information?',
          answer: 'Log into your account, go to "My Profile", and click "Edit" to update your personal information, shipping addresses, and preferences.'
        }
      ]
    },
    {
      title: 'Security & Privacy',
      icon: <SecurityIcon />,
      color: 'error',
      articles: [
        {
          question: 'How do you protect my personal information?',
          answer: 'We use industry-standard security measures including SSL encryption, secure servers, and strict data protection policies to keep your information safe.'
        },
        {
          question: 'Do you share my information with third parties?',
          answer: 'We never sell your personal information. We only share information with trusted service providers who help us operate our website and serve you.'
        },
        {
          question: 'How can I delete my account?',
          answer: 'To delete your account, please contact our customer service team. We\'ll process your request within 30 days and delete all your personal data.'
        }
      ]
    }
  ];

  const popularArticles = [
    'How to track your order',
    'Return and refund policy',
    'Payment methods accepted',
    'Shipping information',
    'Creating an account',
    'Password reset guide',
    'Contact customer service',
    'Security and privacy'
  ];

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
            <Typography color="text.primary">Help Center</Typography>
          </Breadcrumbs>
          
          <Typography variant={isMobile ? "h4" : "h3"} component="h1" fontWeight="bold" gutterBottom>
            ❓ Help Center
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Find answers to your questions and get the support you need.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {/* Search Section */}
            <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                🔍 Search for Help
              </Typography>
              <Typography variant="body1" paragraph>
                Can't find what you're looking for? Search our help articles below.
              </Typography>
              
              <TextField
                fullWidth
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                size="large"
                sx={{ mb: 2 }}
              />
              
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {popularArticles.map((article, index) => (
                  <Chip
                    key={index}
                    label={article}
                    variant="outlined"
                    onClick={() => setSearchQuery(article)}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>
            </Paper>

            {/* Help Categories */}
            <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                📚 Help Categories
              </Typography>
              <Typography variant="body1" paragraph>
                Browse our help articles by category to find the information you need.
              </Typography>
              
              <Box sx={{ display: 'grid', gap: 3 }}>
                {helpCategories.map((category, categoryIndex) => (
                  <Accordion key={categoryIndex}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ 
                          color: `${category.color}.main`, 
                          mr: 2,
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          {category.icon}
                        </Box>
                        <Typography variant="h6" fontWeight="bold">
                          {category.title}
                        </Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box sx={{ display: 'grid', gap: 2 }}>
                        {category.articles.map((article, articleIndex) => (
                          <Accordion key={articleIndex} sx={{ boxShadow: 'none', border: '1px solid', borderColor: 'grey.200' }}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {article.question}
                              </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              <Typography variant="body2" color="text.secondary">
                                {article.answer}
                              </Typography>
                            </AccordionDetails>
                          </Accordion>
                        ))}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            </Paper>

            {/* Quick Actions */}
            <Paper sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                ⚡ Quick Actions
              </Typography>
              <Typography variant="body1" paragraph>
                Need immediate assistance? Try these quick actions:
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200', height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <EmailIcon color="primary" sx={{ mr: 1 }} />
                        <Typography variant="h6" fontWeight="bold" color="primary.main">
                          Email Support
                        </Typography>
                      </Box>
                      <Typography variant="body2" paragraph>
                        Send us an email and we'll get back to you within 24 hours.
                      </Typography>
                      <Button 
                        variant="outlined" 
                        color="primary"
                        onClick={() => navigate('/contact')}
                      >
                        Send Email
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: 'success.50', border: '1px solid', borderColor: 'success.200', height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <PhoneIcon color="success" sx={{ mr: 1 }} />
                        <Typography variant="h6" fontWeight="bold" color="success.main">
                          Phone Support
                        </Typography>
                      </Box>
                      <Typography variant="body2" paragraph>
                        Call us directly for immediate assistance during business hours.
                      </Typography>
                      <Button 
                        variant="outlined" 
                        color="success"
                        onClick={() => window.open('tel:+15551234567')}
                      >
                        Call Now
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: 'info.50', border: '1px solid', borderColor: 'info.200', height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <SupportIcon color="info" sx={{ mr: 1 }} />
                        <Typography variant="h6" fontWeight="bold" color="info.main">
                          Live Chat
                        </Typography>
                      </Box>
                      <Typography variant="body2" paragraph>
                        Chat with our support team in real-time for instant help.
                      </Typography>
                      <Button 
                        variant="outlined" 
                        color="info"
                        onClick={() => alert('Live chat feature coming soon!')}
                      >
                        Start Chat
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: 'warning.50', border: '1px solid', borderColor: 'warning.200', height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <HelpIcon color="warning" sx={{ mr: 1 }} />
                        <Typography variant="h6" fontWeight="bold" color="warning.main">
                          Contact Form
                        </Typography>
                      </Box>
                      <Typography variant="body2" paragraph>
                        Fill out our contact form for detailed assistance.
                      </Typography>
                      <Button 
                        variant="outlined" 
                        color="warning"
                        onClick={() => navigate('/contact')}
                      >
                        Contact Us
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3, position: 'sticky', top: 20 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                📋 Popular Topics
              </Typography>
              <Typography variant="body2" paragraph>
                Most frequently asked questions:
              </Typography>
              
              <List dense>
                {popularArticles.map((article, index) => (
                  <ListItem key={index} sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 30 }}>
                      <CheckCircleIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={article}
                      primaryTypographyProps={{ 
                        variant: 'body2',
                        sx: { cursor: 'pointer', '&:hover': { color: 'primary.main' } }
                      }}
                      onClick={() => setSearchQuery(article)}
                    />
                  </ListItem>
                ))}
              </List>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                📞 Need More Help?
              </Typography>
              <Typography variant="body2" paragraph>
                Can't find what you're looking for? Our support team is here to help:
              </Typography>
              
              <Box sx={{ display: 'grid', gap: 2 }}>
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    Email:
                  </Typography>
                  <Typography variant="body2" color="primary">
                    support@ecommerce.com
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
                    Hours:
                  </Typography>
                  <Typography variant="body2">
                    Mon-Fri: 9AM-6PM<br />
                    Sat: 10AM-4PM<br />
                    Sun: Closed
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Card sx={{ bgcolor: 'info.50', border: '1px solid', borderColor: 'info.200' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom color="info.main">
                    💡 Pro Tip
                  </Typography>
                  <Typography variant="body2">
                    Before contacting support, try searching for your question above. 
                    You might find the answer faster!
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

export default HelpCenterPage; 