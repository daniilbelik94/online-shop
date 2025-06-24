import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  useMediaQuery,
  useTheme,
  Skeleton,
} from '@mui/material';
import { ShoppingCart as CartIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { Product } from '../lib/api';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const getProductImage = () => {
    if (imageError) {
      return '/placeholder-product.jpg';
    }

    if (product.images && product.images.length > 0) {
      const firstImage = product.images[0];
      
      // Handle both string URLs and object with image_url property
      if (typeof firstImage === 'string') {
        return firstImage;
      } else if (firstImage && typeof firstImage === 'object' && 'image_url' in firstImage) {
        return firstImage.image_url || '/placeholder-product.jpg';
      }
    }
    
    return '/placeholder-product.jpg';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const isOutOfStock = !product.is_in_stock || product.stock_quantity <= 0;

  return (
    <Card
      sx={{
        height: '100%',
        minHeight: { xs: 450, sm: 500 }, // Increased minimum height to accommodate better description
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        cursor: 'pointer',
        position: 'relative',
        '&:hover': {
          transform: { xs: 'translateY(-2px)', sm: 'translateY(-4px)' },
          boxShadow: { xs: 3, sm: 4 },
        },
        '&:active': {
          transform: 'translateY(0px)',
        }
      }}
    >
      <Link
        to={`/products/${product.slug}`}
        style={{ 
          textDecoration: 'none', 
          color: 'inherit', 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column' 
        }}
      >
        {/* Fixed height image container */}
        <Box sx={{ position: 'relative', height: { xs: 200, sm: 240 } }}>
          {imageLoading && (
            <Skeleton 
              variant="rectangular" 
              width="100%" 
              height="100%" 
              sx={{ position: 'absolute', top: 0, left: 0 }}
            />
          )}
          <CardMedia
            component="img"
            image={getProductImage()}
            alt={product.name}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageError(true);
              setImageLoading(false);
            }}
            sx={{
              height: '100%',
              width: '100%',
              objectFit: 'cover', // This ensures consistent sizing
              objectPosition: 'center',
              backgroundColor: '#f5f5f5',
              display: imageLoading ? 'none' : 'block',
            }}
          />
          
          {/* Stock status badge */}
          {isOutOfStock && (
            <Chip
              label="Out of Stock"
              color="error"
              size="small"
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                fontWeight: 'bold',
                fontSize: '0.7rem',
              }}
            />
          )}
          
          {/* Featured badge */}
          {product.is_featured && !isOutOfStock && (
            <Chip
              label="Featured"
              color="primary"
              size="small"
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                fontWeight: 'bold',
                fontSize: '0.7rem',
              }}
            />
          )}
        </Box>

        {/* Content area with flex-grow */}
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: { xs: 1.5, sm: 2 } }}>
          {/* Brand */}
          {product.brand && (
            <Typography 
              variant="caption" 
              color="text.secondary" 
              sx={{ 
                mb: 0.5,
                textTransform: 'uppercase',
                fontWeight: 'medium',
                letterSpacing: '0.05em'
              }}
            >
              {product.brand}
            </Typography>
          )}

          {/* Product name - fixed number of lines */}
          <Typography
            variant={isMobile ? "body2" : "h6"}
            component="h3"
            sx={{
              fontWeight: 'medium',
              lineHeight: 1.3,
              mb: 1,
              height: { xs: '2.6em', sm: '3.12em' }, // Fixed height for 2 lines
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              fontSize: { xs: '0.875rem', sm: '1.1rem' }
            }}
          >
            {product.name}
          </Typography>

          {/* Short description */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1,
              minHeight: '3.6em', // Fixed height for consistent sizing
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 3, // Allow 3 lines
              WebkitBoxOrient: 'vertical',
              fontSize: { xs: '0.8rem', sm: '0.875rem' },
              lineHeight: 1.2
            }}
          >
            {product.short_description || product.description || 'No description available'}
          </Typography>

          {/* Spacer to push price to bottom */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Price section */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
            <Box>
              <Typography
                variant={isMobile ? "h6" : "h5"}
                component="div"
                color="primary"
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '1.1rem', sm: '1.3rem' }
                }}
              >
                {formatPrice(product.price)}
              </Typography>
              {product.compare_price && product.compare_price > product.price && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ 
                    textDecoration: 'line-through',
                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                  }}
                >
                  {formatPrice(product.compare_price)}
                </Typography>
              )}
            </Box>

            {/* Stock indicator */}
            <Box sx={{ textAlign: 'right' }}>
              <Typography
                variant="caption"
                color={isOutOfStock ? 'error' : product.stock_quantity < 10 ? 'warning.main' : 'success.main'}
                sx={{ 
                  fontWeight: 'medium',
                  fontSize: { xs: '0.7rem', sm: '0.75rem' }
                }}
              >
                {isOutOfStock ? 'Out of Stock' : 
                 product.stock_quantity < 10 ? `Only ${product.stock_quantity} left` : 
                 'In Stock'}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Link>

      {/* Action buttons */}
      <CardActions sx={{ p: { xs: 1.5, sm: 2 }, pt: 0 }}>
        <Button
          variant="contained"
          fullWidth
          size={isMobile ? "small" : "medium"}
          startIcon={<CartIcon />}
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          sx={{
            fontWeight: 'medium',
            textTransform: 'none',
            borderRadius: 2,
            py: { xs: 1, sm: 1.2 },
            fontSize: { xs: '0.8rem', sm: '0.9rem' }
          }}
        >
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard; 