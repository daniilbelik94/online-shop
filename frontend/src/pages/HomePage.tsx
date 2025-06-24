import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Button, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

const HomePage: React.FC = () => {
  const [apiStatus, setApiStatus] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Test API connection
    const testAPI = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/health`);
        setApiStatus('API Connected Successfully!');
        console.log('API Response:', response.data);
      } catch (err) {
        setError('Failed to connect to API. Please ensure the backend is running.');
        console.error('API Error:', err);
      }
    };

    testAPI();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Our E-Commerce Platform
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          Discover amazing products at unbeatable prices
        </Typography>
        
        {apiStatus && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {apiStatus}
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/products"
            sx={{ mr: 2 }}
          >
            Shop Now
          </Button>
          <Button
            variant="outlined"
            size="large"
            component={Link}
            to="/auth"
          >
            Sign Up
          </Button>
        </Box>
      </Box>

      <Box sx={{ mt: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center">
          Featured Categories
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="outlined" size="large">Electronics</Button>
          <Button variant="outlined" size="large">Clothing</Button>
          <Button variant="outlined" size="large">Home & Garden</Button>
          <Button variant="outlined" size="large">Books</Button>
          <Button variant="outlined" size="large">Sports</Button>
        </Box>
      </Box>
    </Container>
  );
};

export default HomePage;