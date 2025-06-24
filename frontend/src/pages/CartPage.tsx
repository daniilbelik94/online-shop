import React from 'react';
import { Container, Typography } from '@mui/material';

const CartPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Shopping Cart
      </Typography>
      <Typography variant="body1">
        Shopping cart functionality will be implemented here.
      </Typography>
    </Container>
  );
};

export default CartPage; 