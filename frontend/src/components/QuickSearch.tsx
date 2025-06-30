import React, { useState } from 'react';
import {
  Paper,
  InputBase,
  IconButton,
  Box,
  Typography,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Search as SearchIcon,
  TrendingUp as TrendingIcon,
  LocalOffer as OfferIcon,
  Star as StarIcon,
  FlashOn as FlashIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const QuickSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleQuickSearch = (term: string, type: 'search' | 'category' = 'search') => {
    console.log('QuickSearch handleQuickSearch called:', { term, type });
    
    if (type === 'category') {
      const url = `/products?category=${encodeURIComponent(term.toLowerCase())}`;
      console.log('Navigating to category URL:', url);
      navigate(url);
    } else {
      const url = `/products?search=${encodeURIComponent(term)}`;
      console.log('Navigating to search URL:', url);
      navigate(url);
    }
  };

  const popularSearches = [
    { label: 'Electronics', icon: <TrendingIcon />, type: 'category' as const },
    { label: 'Clothing', icon: <OfferIcon />, type: 'category' as const },
    { label: 'Books', icon: <StarIcon />, type: 'category' as const },
    { label: 'Deals', icon: <FlashIcon />, type: 'search' as const },
  ];

  return (
    <Paper
      elevation={2}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 3,
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ 
          textAlign: 'center', 
          mb: 2,
          fontWeight: 'bold',
          color: 'text.primary'
        }}
      >
        What are you looking for?
      </Typography>
      
      <Box component="form" onSubmit={handleSearch} sx={{ mb: 2 }}>
        <Paper
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            maxWidth: 600,
            mx: 'auto',
            borderRadius: 3,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1, fontSize: '1.1rem' }}
            placeholder="Search for products, categories, or brands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            inputProps={{ 'aria-label': 'search products' }}
          />
          <IconButton 
            type="submit" 
            sx={{ p: '10px', color: 'primary.main' }}
            aria-label="search"
          >
            <SearchIcon />
          </IconButton>
        </Paper>
      </Box>

      <Box sx={{ textAlign: 'center' }}>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ mb: 1.5 }}
        >
          Popular searches:
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
          {popularSearches.map((search) => (
            <Chip
              key={search.label}
              label={search.label}
              icon={search.icon}
              onClick={() => handleQuickSearch(search.label, search.type)}
              sx={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                },
              }}
            />
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default QuickSearch; 