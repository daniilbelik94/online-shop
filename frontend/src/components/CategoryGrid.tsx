import React from 'react';
import {
  Grid,
  Card,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import {
  Computer as ElectronicsIcon,
  Checkroom as ClothingIcon,
  MenuBook as BooksIcon,
  Home as HomeIcon,
  SportsBasketball as SportsIcon,
  Category as DefaultCategoryIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { Category } from '../lib/api';

interface CategoryGridProps {
  categories: Category[];
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
  const theme = useTheme();

  const getCategoryIcon = (categorySlug: string) => {
    const iconProps = { 
      sx: { 
        fontSize: { xs: 40, sm: 48 }, 
        mb: 1,
        transition: 'all 0.3s ease',
        color: 'primary.main'
      } 
    };
    
    switch (categorySlug) {
      case 'electronics':
        return <ElectronicsIcon {...iconProps} />;
      case 'clothing':
        return <ClothingIcon {...iconProps} />;
      case 'books':
        return <BooksIcon {...iconProps} />;
      case 'home-garden':
        return <HomeIcon {...iconProps} />;
      case 'sports':
        return <SportsIcon {...iconProps} />;
      default:
        return <DefaultCategoryIcon {...iconProps} />;
    }
  };

  return (
    <Grid container spacing={3}>
      {categories.slice(0, 6).map((category) => (
        <Grid item xs={6} sm={4} md={2} key={category.id}>
          <Card
            component={Link}
            to={`/products?category=${category.slug}`}
            sx={{
              textDecoration: 'none',
              borderRadius: 4,
              textAlign: 'center',
              p: 3,
              height: '100%',
              minHeight: 180,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease-in-out',
              cursor: 'pointer',
              border: '1px solid',
              borderColor: 'divider',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                borderColor: 'primary.main',
                '& .MuiSvgIcon-root': {
                  transform: 'scale(1.1)',
                  color: 'primary.main',
                },
                '& .MuiTypography-root': {
                  color: 'primary.main',
                }
              },
            }}
          >
            {getCategoryIcon(category.slug)}
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '1rem', sm: '1.1rem' },
                textAlign: 'center',
                lineHeight: 1.2,
                transition: 'color 0.3s ease'
              }}
            >
              {category.name}
            </Typography>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CategoryGrid; 