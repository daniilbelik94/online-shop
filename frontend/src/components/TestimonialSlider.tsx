import React from 'react';
import {
  Box,
  Typography,
  Card,
  Avatar,
  Rating,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Verified as VerifiedIcon } from '@mui/icons-material';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface Testimonial {
  id: string;
  name: string;
  rating: number;
  comment: string;
  avatar?: string;
  verified: boolean;
}

interface TestimonialSliderProps {
  testimonials: Testimonial[];
}

const TestimonialSlider: React.FC<TestimonialSliderProps> = ({ testimonials }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography 
          variant={isMobile ? "h4" : "h3"} 
          fontWeight="bold" 
          gutterBottom
          sx={{ mb: 2 }}
        >
          What Our Customers Say
        </Typography>
        <Typography 
          variant="subtitle1" 
          color="text.secondary"
          sx={{ maxWidth: 600, mx: 'auto' }}
        >
          Read reviews from satisfied customers who love shopping with us
        </Typography>
      </Box>
      
      <Box sx={{ position: 'relative' }}>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={isMobile ? 1 : 3}
          navigation={{
            nextEl: '.testimonial-button-next',
            prevEl: '.testimonial-button-prev',
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={testimonials.length > 3}
          grabCursor={true}
          style={{
            paddingBottom: '40px',
            '--swiper-navigation-color': theme.palette.primary.main,
            '--swiper-pagination-color': theme.palette.primary.main,
          } as React.CSSProperties}
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <Card sx={{ 
                p: 3, 
                borderRadius: 3, 
                height: '100%',
                minHeight: 200,
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                },
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Rating 
                    value={testimonial.rating} 
                    readOnly 
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  {testimonial.verified && (
                    <VerifiedIcon 
                      sx={{ 
                        color: 'success.main', 
                        fontSize: 16,
                        ml: 0.5 
                      }} 
                    />
                  )}
                </Box>
                
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 3, 
                    fontStyle: 'italic',
                    flex: 1,
                    lineHeight: 1.6,
                    color: 'text.secondary',
                  }}
                >
                  "{testimonial.comment}"
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    src={testimonial.avatar}
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      mr: 2,
                      bgcolor: 'primary.main',
                    }}
                  >
                    {testimonial.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography 
                      variant="body2" 
                      fontWeight="bold"
                      sx={{ lineHeight: 1.2 }}
                    >
                      {testimonial.name}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                    >
                      Verified Customer
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Buttons */}
        <Box
          className="testimonial-button-prev"
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
          className="testimonial-button-next"
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

export default TestimonialSlider; 