import React from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  Alert,
  Button,
  Paper,
  Skeleton,
  Grid,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Error as ErrorIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size = 40 
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        gap: 2,
      }}
    >
      <CircularProgress size={size} />
      <Typography variant="body2" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};

interface ErrorStateProps {
  error: Error | string;
  onRetry?: () => void;
  title?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  error, 
  onRetry, 
  title = 'Something went wrong' 
}) => {
  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
        gap: 2,
      }}
    >
      <ErrorIcon sx={{ fontSize: 64, color: 'error.main', opacity: 0.7 }} />
      <Typography variant="h6" fontWeight="bold" color="error.main">
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center" maxWidth={400}>
        {errorMessage}
      </Typography>
      {onRetry && (
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={onRetry}
          sx={{ mt: 2 }}
        >
          Try Again
        </Button>
      )}
    </Box>
  );
};

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  title, 
  message, 
  icon = <SearchIcon sx={{ fontSize: 64, opacity: 0.5 }} />,
  action 
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
        gap: 2,
      }}
    >
      {icon}
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" textAlign="center" maxWidth={400}>
        {message}
      </Typography>
      {action && (
        <Box sx={{ mt: 2 }}>
          {action}
        </Box>
      )}
    </Box>
  );
};

interface ProductSkeletonProps {
  count?: number;
  viewMode?: 'grid' | 'list';
}

export const ProductSkeleton: React.FC<ProductSkeletonProps> = ({ 
  count = 8, 
  viewMode = 'grid' 
}) => {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid 
          item 
          xs={12} 
          sm={6} 
          md={viewMode === 'grid' ? 4 : 12} 
          key={index}
        >
          <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Skeleton variant="rectangular" height={viewMode === 'grid' ? 240 : 200} />
            <Box sx={{ p: 2 }}>
              <Skeleton variant="text" width="60%" height={20} />
              <Skeleton variant="text" width="80%" height={16} />
              <Skeleton variant="text" width="40%" height={24} sx={{ mt: 1 }} />
              {viewMode === 'grid' && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Skeleton variant="rectangular" width={80} height={12} />
                  <Skeleton variant="text" width="30%" height={12} />
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

interface LoadingOverlayProps {
  loading: boolean;
  children: React.ReactNode;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  loading, 
  children, 
  message = 'Loading...' 
}) => {
  if (!loading) return <>{children}</>;

  return (
    <Box sx={{ position: 'relative' }}>
      {children}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}
      >
        <LoadingSpinner message={message} />
      </Box>
    </Box>
  );
}; 