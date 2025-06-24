import React from 'react';
import { Container, Typography } from '@mui/material';

const ProductDetailPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Product Detail
      </Typography>
      <Typography variant="body1">
        Product details will be implemented here.
      </Typography>
    </Container>
  );
};

export default ProductDetailPage; 