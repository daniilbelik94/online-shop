import React, { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  useTheme,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Email as EmailIcon,
  Send as SendIcon,
} from '@mui/icons-material';

const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const theme = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setSnackbar({ open: true, message: 'Please enter your email address', severity: 'error' });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSnackbar({ open: true, message: 'Please enter a valid email address', severity: 'error' });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // TODO: Implement actual newsletter signup API call
      // await newsletterAPI.subscribe(email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSnackbar({ 
        open: true, 
        message: 'Successfully subscribed to our newsletter!', 
        severity: 'success' 
      });
      setEmail('');
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: 'Failed to subscribe. Please try again.', 
        severity: 'error' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Paper sx={{ 
        p: { xs: 4, sm: 6 }, 
        borderRadius: 4, 
        textAlign: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: 'inherit',
        }
      }}>
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <EmailIcon sx={{ fontSize: 60, mb: 2, opacity: 0.9 }} />
          
          <Typography 
            variant="h4" 
            fontWeight="bold" 
            gutterBottom
            sx={{ mb: 2 }}
          >
            Stay Updated
          </Typography>
          
          <Typography 
            variant="subtitle1" 
            sx={{ 
              mb: 4, 
              maxWidth: 500, 
              mx: 'auto', 
              opacity: 0.9,
              lineHeight: 1.6,
            }}
          >
            Subscribe to our newsletter and be the first to know about new products, 
            exclusive offers, and special promotions.
          </Typography>
          
          <Box 
            component="form" 
            onSubmit={handleSubmit}
            sx={{ 
              display: 'flex', 
              gap: 2, 
              justifyContent: 'center', 
              flexWrap: 'wrap',
              maxWidth: 500,
              mx: 'auto',
            }}
          >
            <TextField
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                flex: 1,
                minWidth: 250,
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'rgba(255,255,255,0.9)',
                  borderRadius: 3,
                  '& fieldset': {
                    borderColor: 'transparent',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255,255,255,0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                  },
                },
                '& .MuiInputBase-input': {
                  color: 'text.primary',
                  '&::placeholder': {
                    color: 'text.secondary',
                    opacity: 0.7,
                  },
                },
              }}
              disabled={isSubmitting}
            />
            
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<SendIcon />}
              disabled={isSubmitting}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 'bold',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                '&:hover': {
                  bgcolor: 'grey.100',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 25px rgba(0,0,0,0.3)',
                },
                '&:disabled': {
                  bgcolor: 'rgba(255,255,255,0.7)',
                  color: 'text.secondary',
                },
                transition: 'all 0.3s ease'
              }}
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </Box>
          
          <Typography 
            variant="caption" 
            sx={{ 
              display: 'block', 
              mt: 2, 
              opacity: 0.7,
              fontSize: '0.75rem',
            }}
          >
            We respect your privacy. Unsubscribe at any time.
          </Typography>
        </Box>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default NewsletterSignup; 