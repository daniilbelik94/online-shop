import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  Rating,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { Product } from '../lib/api';

interface ProductCardProps {
  product: Product;
  showAddToCart?: boolean;
  onAddToCart?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  showAddToCart = true,
  onAddToCart,
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
    }).format(price);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <Link
        to={`/products/${product.slug}`}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <CardMedia
          component="img"
          height="200"
          image={product.image_url || '/api/placeholder/300/200'}
          alt={product.name}
          sx={{
            objectFit: 'cover',
            backgroundColor: '#f5f5f5',
          }}
        />
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography
            variant="h6"
            component="h3"
            gutterBottom
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: '3rem',
            }}
          >
            {product.name}
          </Typography>
          
          {product.brand && (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {product.brand}
            </Typography>
          )}
          
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              mb: 2,
              flexGrow: 1,
            }}
          >
            {product.description}
          </Typography>
          
          <Box sx={{ mt: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="h5" color="primary" fontWeight="bold">
                {formatPrice(product.price)}
              </Typography>
              {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
                <Chip
                  label={`Only ${product.stock_quantity} left`}
                  size="small"
                  color="warning"
                  sx={{ ml: 1 }}
                />
              )}
              {product.stock_quantity === 0 && (
                <Chip
                  label="Out of Stock"
                  size="small"
                  color="error"
                  sx={{ ml: 1 }}
                />
              )}
            </Box>
            
            {showAddToCart && (
              <Button
                variant="contained"
                fullWidth
                disabled={product.stock_quantity === 0}
                onClick={handleAddToCart}
                sx={{ mt: 1 }}
              >
                {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            )}
          </Box>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ProductCard; 