import React from 'react';
import { Container, Typography } from '@mui/material';

const AuthPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Login / Register
      </Typography>
      <Typography variant="body1">
        Authentication forms will be implemented here.
      </Typography>
    </Container>
  );
};

export default AuthPage; 