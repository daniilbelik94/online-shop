import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Modal,
  Paper,
  useMediaQuery,
  useTheme,
  Fade,
  Backdrop,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Close as CloseIcon,
  ZoomIn as ZoomInIcon,
} from '@mui/icons-material';

interface ImageGalleryProps {
  images: string[];
  alt: string;
  productName?: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, alt, productName }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  // If no images provided, use placeholder
  const displayImages = images.length > 0 ? images : ['/api/placeholder/500/500'];

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === 0 ? displayImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentImageIndex((prev) => 
      prev === displayImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleImageClick = (index?: number) => {
    setModalImageIndex(index ?? currentImageIndex);
    setModalOpen(true);
  };

  const handleModalPrev = () => {
    setModalImageIndex((prev) => 
      prev === 0 ? displayImages.length - 1 : prev - 1
    );
  };

  const handleModalNext = () => {
    setModalImageIndex((prev) => 
      prev === displayImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <>
      <Box sx={{ position: 'relative', width: '100%' }}>
        {/* Main Image */}
        <Paper 
          sx={{ 
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: '#f8f9fa',
            cursor: 'zoom-in',
            '&:hover .zoom-overlay': {
              opacity: 1,
            }
          }}
          onClick={() => handleImageClick()}
        >
          <img
            src={displayImages[currentImageIndex]}
            alt={`${alt} - Image ${currentImageIndex + 1}`}
            style={{
              width: '100%',
              height: isMobile ? '300px' : '400px',
              objectFit: 'cover',
              display: 'block',
            }}
          />
          
          {/* Zoom Overlay */}
          <Box
            className="zoom-overlay"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0,
              transition: 'opacity 0.3s ease',
            }}
          >
            <ZoomInIcon sx={{ color: 'white', fontSize: 48 }} />
          </Box>

          {/* Navigation Arrows - only show if multiple images */}
          {displayImages.length > 1 && (
            <>
              <IconButton
                onClick={handlePrevImage}
                sx={{
                  position: 'absolute',
                  left: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  },
                  zIndex: 2,
                }}
              >
                <ChevronLeftIcon />
              </IconButton>
              
              <IconButton
                onClick={handleNextImage}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  },
                  zIndex: 2,
                }}
              >
                <ChevronRightIcon />
              </IconButton>
            </>
          )}

          {/* Image Counter */}
          {displayImages.length > 1 && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontSize: '0.75rem',
              }}
            >
              {currentImageIndex + 1} / {displayImages.length}
            </Box>
          )}
        </Paper>

        {/* Thumbnail Navigation - only show if multiple images */}
        {displayImages.length > 1 && (
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              mt: 2,
              overflowX: 'auto',
              pb: 1,
              '&::-webkit-scrollbar': {
                height: 4,
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#f1f1f1',
                borderRadius: 2,
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#c1c1c1',
                borderRadius: 2,
              },
            }}
          >
            {displayImages.map((image, index) => (
              <Box
                key={index}
                onClick={() => {
                  setCurrentImageIndex(index);
                }}
                sx={{
                  minWidth: { xs: 60, sm: 80 },
                  height: { xs: 60, sm: 80 },
                  cursor: 'pointer',
                  border: currentImageIndex === index ? 2 : 1,
                  borderColor: currentImageIndex === index ? 'primary.main' : 'divider',
                  borderRadius: 1,
                  overflow: 'hidden',
                  backgroundColor: '#f8f9fa',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: 'primary.main',
                    transform: 'scale(1.05)',
                  }
                }}
              >
                <img
                  src={image}
                  alt={`${alt} thumbnail ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Modal for Full-Screen View */}
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          sx: { backgroundColor: 'rgba(0, 0, 0, 0.9)' }
        }}
      >
        <Fade in={modalOpen}>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              outline: 'none',
              p: { xs: 1, sm: 2 },
            }}
          >
            {/* Close Button */}
            <IconButton
              onClick={handleModalClose}
              sx={{
                position: 'absolute',
                top: { xs: 8, sm: 16 },
                right: { xs: 8, sm: 16 },
                color: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
                zIndex: 3,
              }}
            >
              <CloseIcon />
            </IconButton>

            {/* Modal Image */}
            <img
              src={displayImages[modalImageIndex]}
              alt={`${alt} - Full size ${modalImageIndex + 1}`}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                borderRadius: 8,
              }}
            />

            {/* Modal Navigation - only show if multiple images */}
            {displayImages.length > 1 && (
              <>
                <IconButton
                  onClick={handleModalPrev}
                  sx={{
                    position: 'absolute',
                    left: { xs: 8, sm: 16 },
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'white',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    },
                    zIndex: 3,
                  }}
                >
                  <ChevronLeftIcon />
                </IconButton>
                
                <IconButton
                  onClick={handleModalNext}
                  sx={{
                    position: 'absolute',
                    right: { xs: 8, sm: 16 },
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'white',
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    },
                    zIndex: 3,
                  }}
                >
                  <ChevronRightIcon />
                </IconButton>

                {/* Modal Image Counter */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: { xs: 16, sm: 24 },
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    color: 'white',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    fontSize: '0.875rem',
                    zIndex: 3,
                  }}
                >
                  {modalImageIndex + 1} / {displayImages.length}
                </Box>
              </>
            )}
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default ImageGallery; 