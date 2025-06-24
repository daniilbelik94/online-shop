import React from 'react';
import { Container, Typography } from '@mui/material';

const ProductsPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Products
      </Typography>
      <Typography variant="body1">
        Product listing will be implemented here.
      </Typography>
    </Container>
  );
};

export default ProductsPage; 