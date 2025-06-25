import React, { useState, useEffect } from 'react';
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
  MenuItem,
  Container,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
  AccountCircle as AccountIcon,
  Menu as MenuIcon,
  Home as HomeIcon,
  Storefront as ProductsIcon,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, selectUser, selectIsAuthenticated } from '../store/slices/authSlice';
import { 
  selectCartItemsCount, 
  selectCartNotification, 
  clearNotification,
  fetchCart
} from '../store/slices/cartSlice';
import CartDrawer from './Cart/CartDrawer';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const cartItemsCount = useSelector(selectCartItemsCount);
  const notification = useSelector(selectCartNotification);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [searchQuery, setSearchQuery] = useState('');
  const [accountMenuAnchor, setAccountMenuAnchor] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Load cart on component mount
  useEffect(() => {
    dispatch(fetchCart() as any);
  }, [dispatch]);

  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        dispatch(clearNotification());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    setAccountMenuAnchor(null);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const searchTerm = searchQuery.trim();
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
      // Don't clear search query to avoid "flashing"
      setMobileMenuOpen(false);
    }
  };

  const handleAccountMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAccountMenuAnchor(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAccountMenuAnchor(null);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleCartOpen = () => {
    setCartDrawerOpen(true);
    setMobileMenuOpen(false);
  };

  const handleCartClose = () => {
    setCartDrawerOpen(false);
  };

  const navigationItems = [
    { label: 'Home', path: '/', icon: <HomeIcon /> },
    { label: 'Products', path: '/products', icon: <ProductsIcon /> },
  ];

  const handleNavigationClick = (item: { label: string; path: string }) => {
    if (item.label === 'Cart') {
      handleCartOpen();
    } else {
      navigate(item.path);
      setMobileMenuOpen(false);
    }
  };

  return (
    <>
      {/* Notification Snackbar */}
      <Snackbar
        open={!!notification}
        autoHideDuration={3000}
        onClose={() => dispatch(clearNotification())}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => dispatch(clearNotification())} 
          severity={notification?.type === 'success' ? 'success' : 'error'}
        >
          {notification?.message}
        </Alert>
      </Snackbar>

      <AppBar position="static" elevation={1}>
        <Container maxWidth="xl">
          <Toolbar 
            sx={{ 
              px: { xs: 0, sm: 2 },
              gap: { xs: 1, sm: 2 },
              minHeight: { xs: 56, sm: 64 }
            }}
          >
            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                color="inherit"
                onClick={handleMobileMenuToggle}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo */}
            <Typography 
              variant={isMobile ? "h6" : "h5"} 
              component={Link} 
              to="/" 
              sx={{ 
                textDecoration: 'none', 
                color: 'inherit',
                fontWeight: 'bold',
                minWidth: 'fit-content',
                fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' }
              }}
            >
              E-Commerce
            </Typography>

            {/* Desktop Search Bar */}
            {!isMobile && (
              <Box 
                component="form" 
                onSubmit={handleSearch}
                sx={{ 
                  flexGrow: 1, 
                  maxWidth: 600,
                  mx: 3
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
            )}

            {/* Spacer for mobile */}
            <Box sx={{ flexGrow: 1 }} />

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                {navigationItems.map((item) => (
                  <Button 
                    key={item.path}
                    color="inherit" 
                    component={Link} 
                    to={item.path}
                  >
                    {item.label}
                  </Button>
                ))}
                
                {/* Cart Button */}
                <IconButton
                  color="inherit"
                  onClick={handleCartOpen}
                  sx={{ ml: 1 }}
                >
                  <Badge badgeContent={cartItemsCount} color="error">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
                
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
              </Box>
            )}

            {/* Mobile Account Button */}
            {isMobile && (
              <IconButton
                color="inherit"
                onClick={handleAccountMenuOpen}
              >
                <AccountIcon />
              </IconButton>
            )}

            {/* Account Menu */}
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
              {isAuthenticated ? (
                [
                  <MenuItem key="welcome" disabled>
                    Welcome, {user?.first_name}!
                  </MenuItem>,
                  <MenuItem key="profile" onClick={handleAccountMenuClose} component={Link} to="/profile">
                    Profile
                  </MenuItem>,
                  ...(user?.is_staff || user?.is_superuser ? [
                    <MenuItem key="admin" onClick={handleAccountMenuClose} component={Link} to="/admin">
                      Admin Panel
                    </MenuItem>
                  ] : []),
                  <MenuItem key="logout" onClick={handleLogout}>
                    Logout
                  </MenuItem>
                ]
              ) : (
                [
                  <MenuItem key="login" onClick={handleAccountMenuClose} component={Link} to="/login">
                    Login
                  </MenuItem>,
                  <MenuItem key="register" onClick={handleAccountMenuClose} component={Link} to="/register">
                    Sign Up
                  </MenuItem>
                ]
              )}
            </Menu>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={handleMobileMenuToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            pt: 2,
          },
        }}
      >
        {/* Mobile Search */}
        <Box sx={{ px: 2, mb: 2 }}>
          <Box component="form" onSubmit={handleSearch}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton type="submit" size="small">
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>

        {/* Mobile Navigation */}
        <List>
          {navigationItems.map((item) => (
            <ListItem 
              key={item.path}
              component={Link} 
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              sx={{ 
                color: 'inherit',
                textDecoration: 'none',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                }
              }}
            >
              <ListItemIcon sx={{ color: 'primary.main' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
          
          {/* Cart Item */}
          <ListItem 
            onClick={handleCartOpen}
            sx={{ 
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              }
            }}
          >
            <ListItemIcon sx={{ color: 'primary.main' }}>
              <Badge badgeContent={cartItemsCount} color="error">
                <ShoppingCartIcon />
              </Badge>
            </ListItemIcon>
            <ListItemText primary="Cart" />
          </ListItem>
          
          {isAuthenticated && (user?.is_staff || user?.is_superuser) && (
            <ListItem 
              component={Link} 
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              sx={{ 
                color: 'inherit',
                textDecoration: 'none',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                }
              }}
            >
              <ListItemIcon sx={{ color: 'primary.main' }}>
                <AccountIcon />
              </ListItemIcon>
              <ListItemText primary="Admin Panel" />
            </ListItem>
          )}
        </List>
      </Drawer>

      {/* Cart Drawer */}
      <CartDrawer open={cartDrawerOpen} onClose={handleCartClose} />
    </>
  );
};

export default Header; 