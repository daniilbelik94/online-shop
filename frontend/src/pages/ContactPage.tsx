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
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Alert,
} from '@mui/material';
import {
  Home as HomeIcon,
  NavigateNext as NavigateNextIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
  AccessTime as AccessTimeIcon,
  Send as SendIcon,
  Support as SupportIcon,
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ContactPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

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
            <Typography color="text.primary">Contact</Typography>
          </Breadcrumbs>
          
          <Typography variant={isMobile ? "h4" : "h3"} component="h1" fontWeight="bold" gutterBottom>
            📞 Contact Us
          </Typography>
          <Typography variant="h6" color="text.secondary">
            We'd love to hear from you. Get in touch with us for any questions or support.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 4, borderRadius: 3, mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                Send us a Message
              </Typography>
              <Typography variant="body1" paragraph>
                Have a question, feedback, or need assistance? Fill out the form below and we'll 
                get back to you as soon as possible.
              </Typography>
              
              {submitted && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  Thank you for your message! We'll get back to you within 24 hours.
                </Alert>
              )}
              
              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Your Name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
                
                <TextField
                  fullWidth
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  variant="outlined"
                />
                
                <TextField
                  fullWidth
                  label="Message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  multiline
                  rows={6}
                  variant="outlined"
                  placeholder="Tell us how we can help you..."
                />
                
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<SendIcon />}
                  sx={{ 
                    py: 1.5, 
                    px: 4, 
                    alignSelf: 'flex-start',
                    bgcolor: 'primary.main',
                    '&:hover': {
                      bgcolor: 'primary.dark'
                    }
                  }}
                >
                  Send Message
                </Button>
              </Box>
            </Paper>

            <Paper sx={{ p: 4, borderRadius: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom color="primary">
                Frequently Asked Questions
              </Typography>
              <Typography variant="body1" paragraph>
                Find quick answers to common questions below. If you don't see what you're looking for, 
                feel free to contact us directly.
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200', height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom color="primary.main">
                        🛒 Order Questions
                      </Typography>
                      <List dense>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemText primary="• How do I track my order?" />
                        </ListItem>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemText primary="• Can I cancel my order?" />
                        </ListItem>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemText primary="• How do I return an item?" />
                        </ListItem>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemText primary="• What payment methods do you accept?" />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: 'success.50', border: '1px solid', borderColor: 'success.200', height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom color="success.main">
                        🚚 Shipping & Delivery
                      </Typography>
                      <List dense>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemText primary="• How long does shipping take?" />
                        </ListItem>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemText primary="• Do you ship internationally?" />
                        </ListItem>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemText primary="• Is shipping free?" />
                        </ListItem>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemText primary="• Can I change my shipping address?" />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: 'info.50', border: '1px solid', borderColor: 'info.200', height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom color="info.main">
                        💳 Payment & Billing
                      </Typography>
                      <List dense>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemText primary="• Is my payment information secure?" />
                        </ListItem>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemText primary="• Do you offer payment plans?" />
                        </ListItem>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemText primary="• Can I get a refund?" />
                        </ListItem>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemText primary="• How do I update my billing info?" />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: 'warning.50', border: '1px solid', borderColor: 'warning.200', height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom color="warning.main">
                        🆘 Technical Support
                      </Typography>
                      <List dense>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemText primary="• I can't log into my account" />
                        </ListItem>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemText primary="• The website isn't working" />
                        </ListItem>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemText primary="• I forgot my password" />
                        </ListItem>
                        <ListItem sx={{ py: 0.5 }}>
                          <ListItemText primary="• How do I update my profile?" />
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
                📍 Contact Information
              </Typography>
              <Typography variant="body2" paragraph>
                Here's how you can reach us:
              </Typography>
              
              <Box sx={{ display: 'grid', gap: 3, mb: 3 }}>
                <Card sx={{ bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.200' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <EmailIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6" fontWeight="bold" color="primary.main">
                        Email
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                      hello@ecommerce.com
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      General inquiries
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card sx={{ bgcolor: 'success.50', border: '1px solid', borderColor: 'success.200' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PhoneIcon color="success" sx={{ mr: 1 }} />
                      <Typography variant="h6" fontWeight="bold" color="success.main">
                        Phone
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      +1 (555) 123-4567
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Customer support
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card sx={{ bgcolor: 'info.50', border: '1px solid', borderColor: 'info.200' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOnIcon color="info" sx={{ mr: 1 }} />
                      <Typography variant="h6" fontWeight="bold" color="info.main">
                        Address
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      123 Commerce St<br />
                      Business City, BC 12345<br />
                      United States
                    </Typography>
                  </CardContent>
                </Card>
                
                <Card sx={{ bgcolor: 'warning.50', border: '1px solid', borderColor: 'warning.200' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <AccessTimeIcon color="warning" sx={{ mr: 1 }} />
                      <Typography variant="h6" fontWeight="bold" color="warning.main">
                        Business Hours
                      </Typography>
                    </Box>
                    <Typography variant="body2">
                      Monday - Friday: 9AM - 6PM<br />
                      Saturday: 10AM - 4PM<br />
                      Sunday: Closed
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                🚀 Quick Support
              </Typography>
              <Typography variant="body2" paragraph>
                Need immediate help? Try these options:
              </Typography>
              
              <Box sx={{ display: 'grid', gap: 2 }}>
                <Chip 
                  label="Live Chat Available" 
                  color="success" 
                  variant="outlined"
                  icon={<SupportIcon />}
                />
                <Chip 
                  label="24/7 Email Support" 
                  color="info" 
                  variant="outlined"
                  icon={<EmailIcon />}
                />
                <Chip 
                  label="FAQ Section" 
                  color="primary" 
                  variant="outlined"
                  icon={<CheckCircleIcon />}
                />
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Card sx={{ bgcolor: 'info.50', border: '1px solid', borderColor: 'info.200' }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom color="info.main">
                    💡 Pro Tip
                  </Typography>
                  <Typography variant="body2">
                    For faster response times, please include your order number (if applicable) 
                    and be as specific as possible about your inquiry.
                  </Typography>
                </CardContent>
              </Card>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ContactPage; 