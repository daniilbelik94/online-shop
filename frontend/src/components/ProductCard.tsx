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
  IconButton,
  Tooltip,
  Rating,
  Fade,
  Zoom,
  Badge,
  LinearProgress,
} from '@mui/material';
import { 
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Visibility as ViewIcon,
  Compare as CompareIcon,
  LocalOffer as OfferIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  FlashOn as FlashIcon,
  Verified as VerifiedIcon,
  TrendingUp as TrendingIcon,
  LocalShipping as ShippingIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { addToWishlist, removeFromWishlist, selectIsInWishlist } from '../store/slices/wishlistSlice';
import { selectIsAuthenticated } from '../store/slices/authSlice';
import { Product } from '../lib/api';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  viewMode?: 'grid' | 'list';
  showCompare?: boolean;
  showQuickView?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  viewMode = 'grid',
  showCompare = true,
  showQuickView = true 
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isInWishlist = useSelector((state: RootState) => selectIsInWishlist(state, product.id));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      // Show login prompt or redirect to login
      return;
    }

    try {
      if (isInWishlist) {
        await dispatch(removeFromWishlist(product.id)).unwrap();
      } else {
        await dispatch(addToWishlist(product.id)).unwrap();
      }
    } catch (error) {
      console.error('Failed to update wishlist:', error);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement quick view modal
    console.log('Quick view:', product.name);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement compare functionality
    console.log('Compare:', product.name);
  };

  const getProductImage = () => {
    if (imageError) {
      return '/placeholder-product.jpg';
    }

    if (product.images && product.images.length > 0) {
      const firstImage = product.images[0];
      
      if (typeof firstImage === 'string') {
        return firstImage;
      } else if (firstImage && typeof firstImage === 'object' && 'image_url' in firstImage) {
        return firstImage.image_url || '/placeholder-product.jpg';
      }
    }
    
    return product.image_url || '/placeholder-product.jpg';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const isOutOfStock = !product.is_in_stock || product.stock_quantity <= 0;
  const isOnSale = product.compare_price && product.compare_price > product.price;
  const discountPercentage = isOnSale ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100) : 0;
  const isLowStock = product.stock_quantity <= 10 && product.stock_quantity > 0;
  const stockPercentage = Math.min(100, (product.stock_quantity / 50) * 100); // Assuming 50 is max display stock

  // Mock rating data - in real app this would come from API
  const rating = 4.2;
  const reviewCount = Math.floor(Math.random() * 200) + 10;

  if (viewMode === 'list') {
    return (
      <Card
        sx={{
          display: 'flex',
          mb: 2,
          borderRadius: 3,
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          border: '1px solid',
          borderColor: 'divider',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
            borderColor: 'primary.main',
          },
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link
          to={`/products/${product.slug}`}
          style={{ 
            textDecoration: 'none', 
            color: 'inherit', 
            display: 'flex',
            width: '100%'
          }}
        >
          {/* Image Section */}
          <Box sx={{ position: 'relative', width: 200, height: 200, flexShrink: 0 }}>
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
                objectFit: 'cover',
                backgroundColor: '#f5f5f5',
                display: imageLoading ? 'none' : 'block',
              }}
            />
            
            {/* Badges */}
            {isOnSale && (
              <Chip
                label={`-${discountPercentage}%`}
                size="small"
                sx={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  bgcolor: 'error.main',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.75rem',
                }}
              />
            )}
            
            {product.is_featured && !isOnSale && (
              <Chip
                icon={<StarIcon sx={{ fontSize: '0.75rem !important' }} />}
                label="Featured"
                size="small"
                sx={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  bgcolor: 'primary.main',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.7rem',
                }}
              />
            )}

            {isOutOfStock && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  bgcolor: 'rgba(0,0,0,0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="h6" color="white" fontWeight="bold">
                  Out of Stock
                </Typography>
              </Box>
            )}
          </Box>

          {/* Content Section */}
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, p: 2 }}>
            {/* Brand and Rating */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              {product.brand && (
                <Typography 
                  variant="caption" 
                  color="text.secondary" 
                  sx={{ 
                    textTransform: 'uppercase',
                    fontWeight: 'medium',
                    letterSpacing: '0.05em'
                  }}
                >
                  {product.brand}
                </Typography>
              )}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Rating value={rating} precision={0.1} size="small" readOnly />
                <Typography variant="caption" color="text.secondary">
                  ({reviewCount})
                </Typography>
              </Box>
            </Box>

            {/* Product Name */}
            <Typography
              variant="h6"
              component="h3"
              sx={{
                fontWeight: 'bold',
                lineHeight: 1.3,
                mb: 1,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {product.name}
            </Typography>

            {/* Description */}
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                lineHeight: 1.4,
              }}
            >
              {product.short_description || product.description || 'No description available'}
            </Typography>

            {/* Stock Indicator */}
            {!isOutOfStock && isLowStock && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="warning.main" fontWeight="bold">
                  Only {product.stock_quantity} left!
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={stockPercentage}
                  sx={{
                    height: 4,
                    borderRadius: 2,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: stockPercentage < 30 ? 'error.main' : stockPercentage < 60 ? 'warning.main' : 'success.main',
                    },
                  }}
                />
              </Box>
            )}

            {/* Price Section */}
            <Box sx={{ mt: 'auto' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography
                  variant="h5"
                  component="div"
                  color="primary.main"
                  sx={{ fontWeight: 'bold' }}
                >
                  {formatPrice(product.price)}
                </Typography>
                {isOnSale && (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      textDecoration: 'line-through',
                      color: 'text.secondary',
                    }}
                  >
                    {formatPrice(product.compare_price!)}
                  </Typography>
                )}
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Button
                  variant="contained"
                  startIcon={<CartIcon />}
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  sx={{
                    flex: 1,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 'bold',
                  }}
                >
                  {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </Button>
                
                {isAuthenticated && (
                  <Tooltip title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}>
                    <IconButton
                      onClick={handleWishlistToggle}
                      sx={{
                        color: isInWishlist ? 'error.main' : 'grey.500',
                        '&:hover': {
                          color: 'error.main',
                          bgcolor: 'error.50',
                        },
                      }}
                    >
                      {isInWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Box>
          </Box>
        </Link>
      </Card>
    );
  }

  // Grid view (default)
  return (
    <Card
      sx={{
        height: '100%',
        minHeight: 420,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: '1px solid',
        borderColor: 'divider',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          borderColor: 'primary.main',
        },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
        {/* Image Container */}
        <Box sx={{ position: 'relative', height: 240 }}>
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
              objectFit: 'cover',
              backgroundColor: '#f5f5f5',
              display: imageLoading ? 'none' : 'block',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          />
          
          {/* Quick Action Buttons */}
          <Fade in={isHovered && !isMobile}>
            <Box
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
              }}
            >
              {isAuthenticated && (
                <Zoom in={isHovered} style={{ transitionDelay: '0ms' }}>
                  <Tooltip title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"} placement="left">
                    <IconButton
                      onClick={handleWishlistToggle}
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.95)',
                        color: isInWishlist ? 'error.main' : 'grey.600',
                        '&:hover': {
                          bgcolor: 'white',
                          color: 'error.main',
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.2s ease',
                        boxShadow: 2,
                      }}
                      size="small"
                    >
                      {isInWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
                  </Tooltip>
                </Zoom>
              )}
              
              {showQuickView && (
                <Zoom in={isHovered} style={{ transitionDelay: '50ms' }}>
                  <Tooltip title="Quick view" placement="left">
                    <IconButton
                      onClick={handleQuickView}
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.95)',
                        color: 'grey.600',
                        '&:hover': {
                          bgcolor: 'white',
                          color: 'primary.main',
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.2s ease',
                        boxShadow: 2,
                      }}
                      size="small"
                    >
                      <ViewIcon />
                    </IconButton>
                  </Tooltip>
                </Zoom>
              )}
              
              {showCompare && (
                <Zoom in={isHovered} style={{ transitionDelay: '100ms' }}>
                  <Tooltip title="Compare" placement="left">
                    <IconButton
                      onClick={handleCompare}
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.95)',
                        color: 'grey.600',
                        '&:hover': {
                          bgcolor: 'white',
                          color: 'info.main',
                          transform: 'scale(1.1)',
                        },
                        transition: 'all 0.2s ease',
                        boxShadow: 2,
                      }}
                      size="small"
                    >
                      <CompareIcon />
                    </IconButton>
                  </Tooltip>
                </Zoom>
              )}
            </Box>
          </Fade>

          {/* Badges */}
          <Box sx={{ position: 'absolute', top: 12, left: 12 }}>
            {isOnSale && (
              <Chip
                icon={<OfferIcon sx={{ fontSize: '0.75rem !important' }} />}
                label={`-${discountPercentage}%`}
                size="small"
                sx={{
                  bgcolor: 'error.main',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.75rem',
                  mb: 0.5,
                  boxShadow: 2,
                }}
              />
            )}
            
            {product.is_featured && !isOnSale && (
              <Chip
                icon={<StarIcon sx={{ fontSize: '0.75rem !important' }} />}
                label="Featured"
                size="small"
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.7rem',
                  mb: 0.5,
                  boxShadow: 2,
                }}
              />
            )}

            {isLowStock && !isOutOfStock && (
              <Chip
                icon={<FlashIcon sx={{ fontSize: '0.75rem !important' }} />}
                label="Low Stock"
                size="small"
                sx={{
                  bgcolor: 'warning.main',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.7rem',
                  boxShadow: 2,
                }}
              />
            )}
          </Box>

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: 'rgba(0,0,0,0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h6" color="white" fontWeight="bold">
                Out of Stock
              </Typography>
            </Box>
          )}

          {/* Free Shipping Badge */}
          {product.price >= 50 && (
            <Chip
              icon={<ShippingIcon sx={{ fontSize: '0.75rem !important' }} />}
              label="Free Shipping"
              size="small"
              sx={{
                position: 'absolute',
                bottom: 12,
                left: 12,
                bgcolor: 'success.main',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.7rem',
                boxShadow: 2,
              }}
            />
          )}
        </Box>

        {/* Content Area */}
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
          {/* Brand and Rating */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            {product.brand && (
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ 
                  textTransform: 'uppercase',
                  fontWeight: 'medium',
                  letterSpacing: '0.05em'
                }}
              >
                {product.brand}
              </Typography>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Rating value={rating} precision={0.1} size="small" readOnly />
              <Typography variant="caption" color="text.secondary">
                ({reviewCount})
              </Typography>
            </Box>
          </Box>

          {/* Product Name */}
          <Typography
            variant="subtitle1"
            component="h3"
            sx={{
              fontWeight: 'bold',
              lineHeight: 1.3,
              mb: 1,
              height: '2.6em',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {product.name}
          </Typography>

          {/* Short Description */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              height: '3.6em',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.2,
            }}
          >
            {product.short_description || product.description || 'No description available'}
          </Typography>

          {/* Stock Indicator */}
          {!isOutOfStock && isLowStock && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" color="warning.main" fontWeight="bold">
                Only {product.stock_quantity} left!
              </Typography>
              <LinearProgress
                variant="determinate"
                value={stockPercentage}
                sx={{
                  height: 4,
                  borderRadius: 2,
                  bgcolor: 'grey.200',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: stockPercentage < 30 ? 'error.main' : stockPercentage < 60 ? 'warning.main' : 'success.main',
                  },
                }}
              />
            </Box>
          )}

          {/* Price Section */}
          <Box sx={{ mt: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Typography
                variant="h6"
                component="div"
                color="primary.main"
                sx={{ fontWeight: 'bold' }}
              >
                {formatPrice(product.price)}
              </Typography>
              {isOnSale && (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    textDecoration: 'line-through',
                    color: 'text.secondary',
                  }}
                >
                  {formatPrice(product.compare_price!)}
                </Typography>
              )}
              {isOnSale && (
                <Chip
                  label={`Save ${formatPrice(product.compare_price! - product.price)}`}
                  size="small"
                  color="success"
                  sx={{ fontSize: '0.7rem' }}
                />
              )}
            </Box>
          </Box>
        </CardContent>
      </Link>

      {/* Action Buttons */}
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          variant="contained"
          startIcon={<CartIcon />}
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          fullWidth
          sx={{
            py: 1.2,
            fontSize: '0.875rem',
            fontWeight: 'bold',
            borderRadius: 2,
            textTransform: 'none',
            background: isOutOfStock ? 'grey.300' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: isOutOfStock ? 'grey.300' : 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              transform: 'translateY(-1px)',
              boxShadow: 4,
            },
            '&:disabled': {
              bgcolor: 'grey.300',
              color: 'grey.500',
            }
          }}
        >
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardActions>

      {/* Mobile Wishlist Button */}
      {isMobile && isAuthenticated && (
        <IconButton
          onClick={handleWishlistToggle}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            color: isInWishlist ? 'error.main' : 'grey.600',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 1)',
              color: 'error.main',
            },
            transition: 'all 0.2s ease',
            boxShadow: 2,
          }}
          size="small"
        >
          {isInWishlist ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      )}
    </Card>
  );
};

export default ProductCard; 