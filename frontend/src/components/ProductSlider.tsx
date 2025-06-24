import React from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import ProductCard from './ProductCard';
import { Product } from '../lib/api';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface ProductSliderProps {
  products: Product[];
  title: string;
  onAddToCart: (product: Product) => void;
  maxProducts?: number;
}

const ProductSlider: React.FC<ProductSliderProps> = ({ 
  products, 
  title, 
  onAddToCart, 
  maxProducts = 12 
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isLaptop = useMediaQuery(theme.breakpoints.down('lg'));

  // Safe array handling - ensure products is an array before using slice
  const safeProducts = Array.isArray(products) ? products : [];
  const displayProducts = safeProducts.slice(0, maxProducts);

  // Responsive breakpoints for slides per view
  const getSlidesPerView = () => {
    if (isMobile) return 1.2;
    if (isTablet) return 2.5;
    if (isLaptop) return 3.5;
    return 4.5;
  };

  const getSpaceBetween = () => {
    if (isMobile) return 16;
    if (isTablet) return 20;
    return 24;
  };

  if (displayProducts.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: { xs: 4, sm: 6 } }}>
      <Typography 
        variant={isMobile ? "h5" : "h4"} 
        component="h2" 
        gutterBottom 
        align="center" 
        sx={{ 
          mb: { xs: 2, sm: 3 },
          fontSize: { xs: '1.5rem', sm: '2.125rem' }
        }}
      >
        {title}
      </Typography>
      
      <Box sx={{ position: 'relative' }}>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={getSpaceBetween()}
          slidesPerView={getSlidesPerView()}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={displayProducts.length > 4}
          grabCursor={true}
          style={{
            paddingBottom: '40px',
            '--swiper-navigation-color': theme.palette.primary.main,
            '--swiper-pagination-color': theme.palette.primary.main,
          } as React.CSSProperties}
        >
          {displayProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <Box sx={{ height: '100%' }}>
                <ProductCard product={product} onAddToCart={onAddToCart} />
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <Box
          className="swiper-button-prev-custom"
          sx={{
            position: 'absolute',
            left: -20,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: 'white',
            boxShadow: 2,
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              transform: 'translateY(-50%) scale(1.1)',
            },
            '&::after': {
              content: '"←"',
              fontSize: '16px',
              fontWeight: 'bold',
            },
          }}
        />
        
        <Box
          className="swiper-button-next-custom"
          sx={{
            position: 'absolute',
            right: -20,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: 'white',
            boxShadow: 2,
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: theme.palette.primary.main,
              color: 'white',
              transform: 'translateY(-50%) scale(1.1)',
            },
            '&::after': {
              content: '"→"',
              fontSize: '16px',
              fontWeight: 'bold',
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default ProductSlider; 