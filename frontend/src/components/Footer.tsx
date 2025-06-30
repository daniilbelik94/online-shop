import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Link, 
  IconButton, 
  TextField, 
  Button, 
  Paper,
  Divider,
  Stack,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert,
  Snackbar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  YouTube as YouTubeIcon,
  Pinterest as PinterestIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Send as SendIcon,
  Favorite as FavoriteIcon,
  Shield as ShieldIcon,
  LocalShipping as ShippingIcon,
  Refresh as RefreshIcon,
  CreditCard as CreditCardIcon,
  Security as SecurityIcon,
  Home as HomeIcon,
  Storefront as ProductsIcon,
  Info as InfoIcon,
  Help as HelpIcon,
  Policy as PolicyIcon,
  Gavel as TermsIcon,
  PrivacyTip as PrivacyIcon,
  ContactSupport as ContactIcon,
  TrendingUp as TrendingIcon,
  Star as StarIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import PaymentIcons from './PaymentIcons';

const Footer: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubscribed(true);
      setShowAlert(true);
      setEmail('');
      setTimeout(() => setShowAlert(false), 5000);
    }
  };

  const quickLinks = [
    { label: 'Home', path: '/', icon: <HomeIcon /> },
    { label: 'Products', path: '/products', icon: <ProductsIcon /> },
    { label: 'About Us', path: '/about-us', icon: <InfoIcon /> },
    { label: 'Contact', path: '/contact', icon: <ContactIcon /> },
    { label: 'Help Center', path: '/help-center', icon: <HelpIcon /> },
  ];

  const categories = [
    { label: 'Electronics', path: '/products?category=electronics' },
    { label: 'Clothing', path: '/products?category=clothing' },
    { label: 'Books', path: '/products?category=books' },
    { label: 'Home & Garden', path: '/products?category=home-garden' },
    { label: 'Sports', path: '/products?category=sports' },
  ];

  const legal = [
    { label: 'Privacy Policy', path: '/privacy-policy', icon: <PrivacyIcon /> },
    { label: 'Terms of Service', path: '/terms-of-service', icon: <TermsIcon /> },
    { label: 'Refund Policy', path: '/refund-policy', icon: <RefreshIcon /> },
    { label: 'Shipping Policy', path: '/shipping-policy', icon: <ShippingIcon /> },
    { label: 'Cookie Policy', path: '/cookie-policy', icon: <PolicyIcon /> },
  ];

  const features = [
    { 
      icon: <ShippingIcon />, 
      title: 'Free Shipping', 
      description: 'Orders over $50' 
    },
    { 
      icon: <RefreshIcon />, 
      title: 'Easy Returns', 
      description: '30-day return policy' 
    },
    { 
      icon: <SecurityIcon />, 
      title: 'Secure Payment', 
      description: 'SSL encrypted' 
    },
    { 
      icon: <VerifiedIcon />, 
      title: 'Quality Guarantee', 
      description: 'Authentic products' 
    },
  ];

  const socialMedia = [
    { icon: <FacebookIcon />, url: 'https://facebook.com/shophub', label: 'Facebook' },
    { icon: <TwitterIcon />, url: 'https://twitter.com/shophub', label: 'Twitter' },
    { icon: <InstagramIcon />, url: 'https://instagram.com/shophub', label: 'Instagram' },
    { icon: <LinkedInIcon />, url: 'https://linkedin.com/company/shophub', label: 'LinkedIn' },
    { icon: <YouTubeIcon />, url: 'https://youtube.com/shophub', label: 'YouTube' },
    { icon: <PinterestIcon />, url: 'https://pinterest.com/shophub', label: 'Pinterest' },
  ];

  return (
    <>
      <Snackbar
        open={showAlert}
        autoHideDuration={5000}
        onClose={() => setShowAlert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowAlert(false)} 
          severity="success"
          sx={{ width: '100%' }}
        >
          🎉 Successfully subscribed to our newsletter! Welcome to ShopHub family!
        </Alert>
      </Snackbar>

      {/* Features Section */}
      <Box sx={{ 
        bgcolor: 'grey.50', 
        py: { xs: 3, md: 4 },
        borderTop: '1px solid',
        borderColor: 'grey.200'
      }}>
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Box sx={{ 
                  textAlign: 'center',
                  p: { xs: 2, md: 3 },
                  borderRadius: 3,
                  bgcolor: 'white',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                    transition: 'left 0.5s',
                  },
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                    '&::before': {
                      left: '100%',
                    },
                  },
                  '&:focus-within': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
                  }
                }}>
                  <Box sx={{ 
                    width: 60,
                    height: 60,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    color: 'white',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'rotate(360deg) scale(1.1)',
                    }
                  }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Newsletter Section */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: { xs: 4, md: 6 }
      }}>
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              📬 Stay Updated!
            </Typography>
            <Typography variant="h6" sx={{ mb: 3, opacity: 0.9 }}>
              Subscribe to our newsletter for exclusive deals and latest updates
            </Typography>
            
            <Box 
              component="form" 
              onSubmit={handleNewsletterSubmit}
              sx={{ 
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                maxWidth: 500,
                mx: 'auto',
                mb: 3
              }}
            >
              <TextField
                fullWidth
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: 2,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '& fieldset': {
                      borderColor: 'transparent',
                      transition: 'border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.98)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(255, 255, 255, 0.98)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                      '& fieldset': {
                        borderColor: 'white',
                        borderWidth: '2px',
                      },
                    },
                  }
                }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                endIcon={<SendIcon />}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 'bold',
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  minWidth: 120,
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                    transition: 'left 0.5s',
                  },
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.3)',
                    transform: 'translateY(-2px) scale(1.02)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                    '&::before': {
                      left: '100%',
                    },
                  },
                  '&:focus': {
                    bgcolor: 'rgba(255, 255, 255, 0.3)',
                    transform: 'translateY(-2px) scale(1.02)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                  }
                }}
              >
                Subscribe
              </Button>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                label="📧 Weekly deals"
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.2)', 
                  color: 'white',
                  fontWeight: 'bold',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.3)',
                    transform: 'translateY(-2px) scale(1.05)',
                  }
                }}
              />
              <Chip
                label="🎁 Exclusive offers"
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.2)', 
                  color: 'white',
                  fontWeight: 'bold',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.3)',
                    transform: 'translateY(-2px) scale(1.05)',
                  }
                }}
              />
              <Chip
                label="🔔 New arrivals"
                sx={{ 
                  bgcolor: 'rgba(255, 255, 255, 0.2)', 
                  color: 'white',
                  fontWeight: 'bold',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.3)',
                    transform: 'translateY(-2px) scale(1.05)',
                  }
                }}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: 'grey.900',
          color: 'white',
          py: { xs: 4, md: 6 },
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={4}>
            {/* Company Info */}
            <Grid item xs={12} md={3}>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Box sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'rotate(360deg) scale(1.1)',
                    }
                  }}>
                    🛍️
                  </Box>
                  <Typography variant="h5" fontWeight="bold">
                    ShopHub
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 3, opacity: 0.8, lineHeight: 1.6 }}>
                  Your trusted online shopping destination. We bring you the best products 
                  at unbeatable prices with exceptional customer service.
                </Typography>
                
                {/* Contact Info */}
                <Stack spacing={1}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateX(8px)',
                      '& .MuiSvgIcon-root': {
                        color: 'primary.main',
                      }
                    }
                  }}>
                    <PhoneIcon fontSize="small" />
                    <Typography variant="body2">+1 (555) 123-4567</Typography>
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateX(8px)',
                      '& .MuiSvgIcon-root': {
                        color: 'primary.main',
                      }
                    }
                  }}>
                    <EmailIcon fontSize="small" />
                    <Typography variant="body2">support@shophub.com</Typography>
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateX(8px)',
                      '& .MuiSvgIcon-root': {
                        color: 'primary.main',
                      }
                    }
                  }}>
                    <LocationIcon fontSize="small" />
                    <Typography variant="body2">123 Commerce St, City, State 12345</Typography>
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'translateX(8px)',
                      '& .MuiSvgIcon-root': {
                        color: 'primary.main',
                      }
                    }
                  }}>
                    <ScheduleIcon fontSize="small" />
                    <Typography variant="body2">Mon-Fri: 9AM-6PM EST</Typography>
                  </Box>
                </Stack>
              </Box>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Quick Links
              </Typography>
              <List dense>
                {quickLinks.map((link) => (
                  <ListItem key={link.path} disablePadding>
                    <Link
                      component={RouterLink}
                      to={link.path}
                      color="inherit"
                      underline="none"
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        py: 0.5,
                        px: 1,
                        borderRadius: 1,
                        opacity: 0.8,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        textDecoration: 'none',
                        '&:hover, &:focus': {
                          opacity: 1,
                          transform: 'translateX(8px)',
                          bgcolor: 'rgba(255, 255, 255, 0.1)',
                          '& .MuiSvgIcon-root': {
                            color: 'primary.main',
                            transform: 'scale(1.2)',
                          },
                          textDecoration: 'none',
                        },
                      }}
                    >
                      <Box sx={{
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}>
                        {link.icon}
                      </Box>
                      <Typography variant="body2">{link.label}</Typography>
                    </Link>
                  </ListItem>
                ))}
              </List>
            </Grid>

            {/* Categories */}
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Categories
              </Typography>
              <List dense>
                {categories.map((category) => (
                  <ListItem key={category.path} disablePadding>
                    <Link
                      component={RouterLink}
                      to={category.path}
                      color="inherit"
                      underline="none"
                      sx={{ 
                        py: 0.5,
                        px: 1,
                        borderRadius: 1,
                        opacity: 0.8,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        textDecoration: 'none',
                        '&:hover, &:focus': {
                          opacity: 1,
                          transform: 'translateX(8px)',
                          bgcolor: 'rgba(255, 255, 255, 0.1)',
                          textDecoration: 'none',
                        },
                      }}
                    >
                      <Typography variant="body2">{category.label}</Typography>
                    </Link>
                  </ListItem>
                ))}
              </List>
            </Grid>

            {/* Legal */}
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Legal & Policies
              </Typography>
              <List dense>
                {legal.map((item) => (
                  <ListItem key={item.path} disablePadding>
                    <Link
                      component={RouterLink}
                      to={item.path}
                      color="inherit"
                      underline="none"
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 1,
                        py: 0.5,
                        px: 1,
                        borderRadius: 1,
                        opacity: 0.8,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        textDecoration: 'none',
                        '&:hover, &:focus': {
                          opacity: 1,
                          transform: 'translateX(8px)',
                          bgcolor: 'rgba(255, 255, 255, 0.1)',
                          '& .MuiSvgIcon-root': {
                            color: 'primary.main',
                            transform: 'scale(1.2)',
                          },
                          textDecoration: 'none',
                        },
                      }}
                    >
                      <Box sx={{
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}>
                        {item.icon}
                      </Box>
                      <Typography variant="body2">{item.label}</Typography>
                    </Link>
                  </ListItem>
                ))}
              </List>
            </Grid>

            {/* Social Media & Awards */}
            <Grid item xs={12} md={3}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Connect With Us
              </Typography>
              
              {/* Social Media Icons */}
              <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
                {socialMedia.map((social) => (
                  <IconButton
                    key={social.label}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                        transition: 'left 0.5s',
                      },
                      '&:hover': {
                        bgcolor: 'primary.main',
                        transform: 'translateY(-4px) scale(1.1)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                        '&::before': {
                          left: '100%',
                        },
                      },
                      '&:focus': {
                        bgcolor: 'primary.main',
                        transform: 'translateY(-4px) scale(1.1)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                      }
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Box>

              {/* Awards & Certifications */}
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 3 }}>
                Trusted & Certified
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
                <Chip
                  icon={<StarIcon />}
                  label="4.8/5 Rating"
                  variant="outlined"
                  sx={{ 
                    color: 'white', 
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '& .MuiChip-icon': { color: 'gold' },
                    '&:hover': {
                      transform: 'translateY(-2px) scale(1.05)',
                      borderColor: 'gold',
                      bgcolor: 'rgba(255, 215, 0, 0.1)',
                    }
                  }}
                />
                <Chip
                  icon={<ShieldIcon />}
                  label="SSL Secure"
                  variant="outlined"
                  sx={{ 
                    color: 'white', 
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '& .MuiChip-icon': { color: 'green' },
                    '&:hover': {
                      transform: 'translateY(-2px) scale(1.05)',
                      borderColor: 'green',
                      bgcolor: 'rgba(0, 255, 0, 0.1)',
                    }
                  }}
                />
              </Box>

              {/* Payment Methods */}
              <Typography variant="body2" sx={{ mb: 1, opacity: 0.8 }}>
                We accept:
              </Typography>
              <PaymentIcons />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.2)' }} />

          {/* Bottom Footer */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                © 2024 ShopHub. All rights reserved.
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Made with
                </Typography>
                <FavoriteIcon sx={{ 
                  color: 'red', 
                  fontSize: '1rem',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'scale(1.5) rotate(360deg)',
                  }
                }} />
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  for our customers
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Built with React, TypeScript, PHP & PostgreSQL
              </Typography>
              <Chip
                label="🚀 Fast & Secure"
                size="small"
                sx={{ 
                  bgcolor: 'primary.main', 
                  color: 'white',
                  fontWeight: 'bold',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-2px) scale(1.05)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  }
                }}
              />
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Footer; 