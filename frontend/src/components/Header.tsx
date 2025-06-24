import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
  AccountCircle as AccountIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/slices/authSlice';

const Header: React.FC = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [accountMenuAnchor, setAccountMenuAnchor] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    dispatch(logout());
    setAccountMenuAnchor(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); // Clear search after navigation
    }
  };

  const handleAccountMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAccountMenuAnchor(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAccountMenuAnchor(null);
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ gap: 2 }}>
        {/* Logo */}
        <Typography 
          variant="h6" 
          component={Link} 
          to="/" 
          sx={{ 
            textDecoration: 'none', 
            color: 'inherit',
            fontWeight: 'bold',
            minWidth: 'fit-content'
          }}
        >
          E-Commerce
        </Typography>

        {/* Search Bar */}
        <Box 
          component="form" 
          onSubmit={handleSearch}
          sx={{ 
            flexGrow: 1, 
            maxWidth: 600,
            mx: 2
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                },
                '&.Mui-focused': {
                  backgroundColor: 'rgba(255, 255, 255, 0.25)',
                },
                '& fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.7)',
                },
              },
              '& .MuiInputBase-input': {
                color: 'white',
                '&::placeholder': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  opacity: 1,
                },
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton 
                    type="submit"
                    sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Navigation Links */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/products">
            Products
          </Button>
          <Button color="inherit" component={Link} to="/cart">
            <ShoppingCartIcon />
          </Button>
          
          {isAuthenticated ? (
            <>
              {(user?.is_staff || user?.is_superuser) && (
                <Button color="inherit" component={Link} to="/admin">
                  Admin
                </Button>
              )}
              <IconButton
                color="inherit"
                onClick={handleAccountMenuOpen}
                sx={{ ml: 1 }}
              >
                <AccountIcon />
              </IconButton>
              <Menu
                anchorEl={accountMenuAnchor}
                open={Boolean(accountMenuAnchor)}
                onClose={handleAccountMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem disabled>
                  Welcome, {user?.first_name}!
                </MenuItem>
                <MenuItem onClick={handleAccountMenuClose} component={Link} to="/profile">
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Button 
              color="inherit" 
              onClick={handleAccountMenuOpen}
              startIcon={<AccountIcon />}
            >
              Account
            </Button>
          )}
          
          {/* Account Menu for non-authenticated users */}
          {!isAuthenticated && (
            <Menu
              anchorEl={accountMenuAnchor}
              open={Boolean(accountMenuAnchor)}
              onClose={handleAccountMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleAccountMenuClose} component={Link} to="/login">
                Login
              </MenuItem>
              <MenuItem onClick={handleAccountMenuClose} component={Link} to="/register">
                Sign Up
              </MenuItem>
            </Menu>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 