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
  Avatar,
} from '@mui/material';
import {
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
  Business as BusinessIcon,
  People as PeopleIcon,
  EmojiEvents as EmojiEventsIcon,
  Favorite as FavoriteIcon,
  Security as SecurityIcon,
  LocalShipping as LocalShippingIcon,
  Support as SupportIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AboutUsPage: React.FC = () => {
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
            <Typography color="text.primary">About Us</Typography>
          </Breadcrumbs>
          
          <Typography variant={isMobile ? "h4" : "h3"} component="h1" fontWeight="bold" gutterBottom>
            🏢 About Us
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Discover our story, mission, and commitment to providing exceptional shopping experiences.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                Our Story
              </Typography>
              <Typography variant="body1" paragraph>
                Founded in 2020, our e-commerce platform was born from a simple vision: to create 
                a seamless, enjoyable shopping experience that puts customers first. What started 
                as a small online store has grown into a trusted destination for quality products 
                and exceptional service.
              </Typography>
              
              <Typography variant="body1" paragraph>
                We believe that shopping should be more than just a transaction—it should be an 
                experience that brings joy and satisfaction. That's why we've built our platform 
                around the principles of quality, convenience, and customer care.
              </Typography>
              
              <Card sx={{ bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200', mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom color="primary.main">
                    🎯 Our Mission
                  </Typography>
                  <Typography variant="body2">
                    To provide our customers with the highest quality products, exceptional service, 
                    and a shopping experience that exceeds expectations while building lasting relationships 
                    based on trust and satisfaction.
                  </Typography>
                </CardContent>
              </Card>
            </Paper>

            <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                Our Values
              </Typography>
              <Typography variant="body1" paragraph>
                These core values guide everything we do and shape our relationships with customers, 
                partners, and our community.
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: 'success.50', border: '1px solid', borderColor: 'success.200', height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <FavoriteIcon color="success" sx={{ mr: 1 }} />
                        <Typography variant="h6" fontWeight="bold" color="success.main">
                          Customer First
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        Every decision we make is guided by what's best for our customers. 
                        Their satisfaction and happiness are our top priorities.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: 'info.50', border: '1px solid', borderColor: 'info.200', height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <SecurityIcon color="info" sx={{ mr: 1 }} />
                        <Typography variant="h6" fontWeight="bold" color="info.main">
                          Quality & Trust
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        We maintain the highest standards of quality in our products and services, 
                        building trust through transparency and reliability.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: 'warning.50', border: '1px solid', borderColor: 'warning.200', height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <PeopleIcon color="warning" sx={{ mr: 1 }} />
                        <Typography variant="h6" fontWeight="bold" color="warning.main">
                          Community
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        We believe in giving back to our community and supporting causes that 
                        make a positive impact on society.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: 'error.50', border: '1px solid', borderColor: 'error.200', height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <EmojiEventsIcon color="error" sx={{ mr: 1 }} />
                        <Typography variant="h6" fontWeight="bold" color="error.main">
                          Innovation
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        We continuously innovate and improve our platform to provide the best 
                        possible shopping experience for our customers.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>

            <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                Why Choose Us?
              </Typography>
              <Typography variant="body1" paragraph>
                Here's what sets us apart from the competition and makes us the preferred choice 
                for online shopping.
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
                        Quality Products
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      We carefully curate our product selection to ensure every item meets our 
                      high standards for quality, durability, and value.
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
                        Fast & Reliable Shipping
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      We partner with trusted shipping carriers to ensure your orders arrive 
                      quickly and in perfect condition.
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
                        Exceptional Customer Service
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      Our dedicated support team is here to help you with any questions or concerns, 
                      ensuring your shopping experience is always positive.
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
                        Secure Shopping
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      Your security is our priority. We use industry-standard encryption and 
                      security measures to protect your personal and payment information.
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </Paper>

            <Paper sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                Our Team
              </Typography>
              <Typography variant="body1" paragraph>
                Meet the passionate individuals behind our success who work tirelessly to bring 
                you the best shopping experience possible.
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Avatar 
                        sx={{ 
                          width: 80, 
                          height: 80, 
                          mx: 'auto', 
                          mb: 2,
                          bgcolor: 'primary.main',
                          fontSize: '2rem'
                        }}
                      >
                        👨‍💼
                      </Avatar>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        John Smith
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        CEO & Founder
                      </Typography>
                      <Typography variant="body2">
                        Passionate about creating exceptional customer experiences and building 
                        a company that makes a difference.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Avatar 
                        sx={{ 
                          width: 80, 
                          height: 80, 
                          mx: 'auto', 
                          mb: 2,
                          bgcolor: 'secondary.main',
                          fontSize: '2rem'
                        }}
                      >
                        👩‍💼
                      </Avatar>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Sarah Johnson
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Head of Customer Experience
                      </Typography>
                      <Typography variant="body2">
                        Dedicated to ensuring every customer interaction is positive and memorable, 
                        with over 10 years of experience in customer service.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Avatar 
                        sx={{ 
                          width: 80, 
                          height: 80, 
                          mx: 'auto', 
                          mb: 2,
                          bgcolor: 'success.main',
                          fontSize: '2rem'
                        }}
                      >
                        👨‍💻
                      </Avatar>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Mike Chen
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Chief Technology Officer
                      </Typography>
                      <Typography variant="body2">
                        Leading our technology initiatives to create innovative solutions that 
                        enhance the shopping experience for our customers.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Avatar 
                        sx={{ 
                          width: 80, 
                          height: 80, 
                          mx: 'auto', 
                          mb: 2,
                          bgcolor: 'warning.main',
                          fontSize: '2rem'
                        }}
                      >
                        👩‍🎨
                      </Avatar>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Emily Davis
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Creative Director
                      </Typography>
                      <Typography variant="body2">
                        Bringing creativity and innovation to our brand, ensuring our visual 
                        identity reflects our values and resonates with our customers.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 3, position: 'sticky', top: 20 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                📊 Our Numbers
              </Typography>
              <Typography variant="body2" paragraph>
                Some impressive statistics about our growth and impact:
              </Typography>
              
              <Box sx={{ display: 'grid', gap: 2, mb: 3 }}>
                <Card sx={{ bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold" color="primary.main">
                      50K+
                    </Typography>
                    <Typography variant="body2">
                      Happy Customers
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card sx={{ bgcolor: 'success.50', border: '1px solid', borderColor: 'success.200' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold" color="success.main">
                      1000+
                    </Typography>
                    <Typography variant="body2">
                      Products Available
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card sx={{ bgcolor: 'info.50', border: '1px solid', borderColor: 'info.200' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold" color="info.main">
                      24/7
                    </Typography>
                    <Typography variant="body2">
                      Customer Support
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card sx={{ bgcolor: 'warning.50', border: '1px solid', borderColor: 'warning.200' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" fontWeight="bold" color="warning.main">
                      4.9⭐
                    </Typography>
                    <Typography variant="body2">
                      Customer Rating
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                🏆 Awards & Recognition
              </Typography>
              <Box sx={{ display: 'grid', gap: 1 }}>
                <Chip 
                  label="Best E-commerce Platform 2024" 
                  color="primary" 
                  variant="outlined"
                  icon={<StarIcon />}
                />
                <Chip 
                  label="Customer Service Excellence" 
                  color="success" 
                  variant="outlined"
                  icon={<SupportIcon />}
                />
                <Chip 
                  label="Innovation in Retail" 
                  color="info" 
                  variant="outlined"
                  icon={<EmojiEventsIcon />}
                />
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                📞 Get in Touch
              </Typography>
              <Typography variant="body2" paragraph>
                Want to learn more about us? We'd love to hear from you:
              </Typography>
              
              <Box sx={{ display: 'grid', gap: 2 }}>
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    Email:
                  </Typography>
                  <Typography variant="body2" color="primary">
                    hello@ecommerce.com
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
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutUsPage; 