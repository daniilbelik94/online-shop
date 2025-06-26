import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Button,
  Divider,
  CircularProgress,
  Paper,
  Stack,
  Tooltip,
} from '@mui/material';
import {
  Close as CloseIcon,
  Favorite as FavoriteIcon,
  Delete as DeleteIcon,
  ShoppingCart as ShoppingCartIcon,
  Visibility as ViewListIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectWishlistItems,
  selectWishlistLoading,
  removeFromWishlist,
} from '../store/slices/wishlistSlice';
import { addToCart } from '../store/slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../store';
import { Product } from '../lib/api';

interface WishlistDrawerProps {
  open: boolean;
  onClose: () => void;
}

const WishlistDrawer: React.FC<WishlistDrawerProps> = ({ open, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const items = useSelector((state: RootState) => state.wishlist.items);
  const loading = useSelector((state: RootState) => state.wishlist.loading);

  const handleRemove = (productId: string | number) => {
    dispatch(removeFromWishlist(productId));
  };

  const handleAddToCart = (item: Product) => {
    dispatch(addToCart({ productId: item.id.toString(), quantity: 1 }));
    dispatch(removeFromWishlist(item.id));
    // Optional: add a toast notification "Moved to cart"
  };

  const handleNavigate = (path: string) => {
    onClose();
    navigate(path);
  }

  const formatPrice = (price: number): string =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

  const getProductImage = (product: Product): string => {
    if (product.images && product.images.length > 0) {
      const firstImage = product.images[0];
      if (typeof firstImage === 'string') return firstImage;
      if (firstImage && 'image_url' in firstImage) return firstImage.image_url;
    }
    return product.image_url || '/placeholder-product.jpg';
  }
  
  const renderEmptyState = () => (
    <Box sx={{
      textAlign: 'center',
      p: 4,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      height: '100%'
    }}>
      <FavoriteIcon sx={{ fontSize: 60, color: 'grey.300', mb: 2, mx: 'auto' }} />
      <Typography variant="h6" gutterBottom>Your Wishlist is Empty</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Looks like you haven't added anything yet.
      </Typography>
      <Button variant="contained" onClick={() => handleNavigate('/products')}>
        Explore Products
      </Button>
    </Box>
  );

  const renderItem = (product: Product) => (
    <Paper 
      key={product.id}
      elevation={2}
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        p: 1.5,
        mb: 1.5,
        borderRadius: 3,
        transition: 'box-shadow 0.3s',
        '&:hover': { boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }
      }}
    >
      <Avatar 
        src={getProductImage(product)} 
        variant="rounded" 
        sx={{ width: 70, height: 70, mr: 2, borderRadius: 2 }} 
      />
      <ListItemText
        primary={product.name}
        secondary={formatPrice(product.price)}
        primaryTypographyProps={{ fontWeight: 'bold', noWrap: true, mb: 0.5 }}
        secondaryTypographyProps={{ color: 'primary.main', fontWeight: 'medium' }}
        sx={{ flexGrow: 1 }}
      />
      <Stack direction="row" spacing={0.5}>
        <Tooltip title="Move to Cart">
          <IconButton edge="end" color="primary" onClick={() => handleAddToCart(product)}>
            <ShoppingCartIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Remove from Wishlist">
          <IconButton edge="end" color="error" onClick={() => handleRemove(product.id)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Stack>
    </Paper>
  );

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: { xs: '100%', sm: 480 }, bgcolor: '#f4f6f8' } }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <FavoriteIcon color="error" />
            <Typography variant="h6" fontWeight="bold">
              Wishlist ({items.length})
            </Typography>
          </Stack>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Content */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <CircularProgress />
            </Box>
          ) : items.length === 0 ? (
            renderEmptyState()
          ) : (
            <List disablePadding>
              {items.map((raw: any) => {
                const product = raw.product ?? raw;
                return renderItem(product);
              })}
            </List>
          )}
        </Box>

        {/* Footer */}
        {items.length > 0 && (
          <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<ViewListIcon />}
              onClick={() => handleNavigate('/profile?tab=wishlist')}
              sx={{ py: 1.5, fontWeight: 'bold' }}
            >
              View Full Wishlist
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default WishlistDrawer; 