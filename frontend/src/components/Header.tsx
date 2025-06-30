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
  Avatar,
  Divider,
  Paper,
  ListItemButton,
  Chip,
  LinearProgress,
  Card,
  CardContent,
  Popper,
  ClickAwayListener,
  Grow,
  MenuList,
  Stack,
  Tooltip,
  Link as MuiLink,
} from '@mui/material';
import {
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
  AccountCircle as AccountIcon,
  Menu as MenuIcon,
  Home as HomeIcon,
  Storefront as ProductsIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  NotificationsNone as NotificationsIcon,
  LocalOffer as OffersIcon,
  Help as HelpIcon,
  Close as CloseIcon,
  TrendingUp as TrendingIcon,
  Category as CategoryIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
  Brightness6 as ThemeIcon,
  History as HistoryIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
  // Category icons
  Computer as ElectronicsIcon,
  Checkroom as ClothingIcon,
  MenuBook as BooksIcon,
  HomeOutlined as HomeGardenIcon,
  SportsBasketball as SportsIcon,
  Toys as ToysIcon,
  Build as ToolsIcon,
  Kitchen as KitchenIcon,
  FitnessCenter as FitnessIcon,
  Pets as PetsIcon,
  DirectionsCar as AutomotiveIcon,
  Palette as ArtIcon,
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, selectUser, selectIsAuthenticated } from '../store/slices/authSlice';
import { 
  selectCartItemsCount, 
  selectCartNotification, 
  clearNotification,
  fetchCart
} from '../store/slices/cartSlice';
import { selectWishlistCount } from '../store/slices/wishlistSlice';
import { selectNotifications } from '../store/slices/notificationSlice';
import CartDrawer from './Cart/CartDrawer';
import WishlistDrawer from './WishlistDrawer';
import { publicAPI, api } from '../lib/api';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const cartItemsCount = useSelector(selectCartItemsCount);
  const wishlistCount = useSelector(selectWishlistCount);
  const notification = useSelector(selectCartNotification);
  const notifications = useSelector(selectNotifications);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [accountMenuAnchor, setAccountMenuAnchor] = useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [wishlistDrawerOpen, setWishlistDrawerOpen] = useState(false);
  const [guestMenuAnchor, setGuestMenuAnchor] = useState<null | HTMLElement>(null);
  const [categoriesMenuAnchor, setCategoriesMenuAnchor] = useState<null | HTMLElement>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [userStats, setUserStats] = useState({ orders: 0, spent: 0, points: 0 });

  // Load initial data
  useEffect(() => {
    dispatch(fetchCart() as any);
    loadCategories();
    if (isAuthenticated) {
      loadUserStats();
    }
  }, [dispatch, isAuthenticated]);

  // Auto-hide notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        dispatch(clearNotification());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification, dispatch]);

  // Search suggestions debounced
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length > 2) {
        loadSearchSuggestions();
      } else {
        setSearchSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadCategories = async () => {
    try {
      const response = await publicAPI.getCategories();
      setCategories(response.data?.data || []);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadUserStats = async () => {
    if (!isAuthenticated) {
      setUserStats({ orders: 0, spent: 0, points: 0 });
      return;
    }

    try {
      // Load user orders to calculate stats
      const ordersResponse = await api.get('/orders/my');
      const orders = ordersResponse.data?.data?.data || [];
      
      const totalOrders = orders.length;
      const totalSpent = Math.round(orders.reduce((sum: number, order: any) => {
        return sum + (order.total_amount || order.total || 0);
      }, 0) * 100) / 100; // Round to 2 decimal places
      const loyaltyPoints = Math.floor(totalSpent); // 1 point per dollar spent
      
      setUserStats({
        orders: totalOrders,
        spent: totalSpent,
        points: loyaltyPoints,
      });
    } catch (error) {
      console.error('Failed to load user stats:', error);
      // Keep default values on error
      setUserStats({ orders: 0, spent: 0, points: 0 });
    }
  };

  const loadSearchSuggestions = async () => {
    try {
      const response = await publicAPI.getProducts({ 
        search: searchQuery, 
        limit: 5 
      });
      setSearchSuggestions(response.data?.data || []);
    } catch (error) {
      console.error('Failed to load search suggestions:', error);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setAccountMenuAnchor(null);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const handleSearchSuggestionClick = (product: any) => {
    navigate(`/products/${product.slug || product.id}`);
    setSearchOpen(false);
    setSearchQuery('');
    setSearchSuggestions([]);
  };

  const getCategoryIcon = (categorySlug: string) => {
    const iconProps = { fontSize: 'small' as const };
    
    switch (categorySlug?.toLowerCase()) {
      case 'electronics':
      case 'computers':
      case 'technology':
        return <ElectronicsIcon {...iconProps} />;
      case 'clothing':
      case 'fashion':
      case 'apparel':
        return <ClothingIcon {...iconProps} />;
      case 'books':
      case 'literature':
      case 'reading':
        return <BooksIcon {...iconProps} />;
      case 'home-garden':
      case 'home':
      case 'garden':
      case 'furniture':
        return <HomeGardenIcon {...iconProps} />;
      case 'sports':
      case 'fitness':
      case 'outdoor':
        return <SportsIcon {...iconProps} />;
      case 'toys':
      case 'games':
      case 'kids':
        return <ToysIcon {...iconProps} />;
      case 'tools':
      case 'hardware':
      case 'diy':
        return <ToolsIcon {...iconProps} />;
      case 'kitchen':
      case 'appliances':
      case 'cooking':
        return <KitchenIcon {...iconProps} />;
      case 'health':
      case 'beauty':
      case 'wellness':
        return <FitnessIcon {...iconProps} />;
      case 'pets':
      case 'animals':
        return <PetsIcon {...iconProps} />;
      case 'automotive':
      case 'cars':
      case 'vehicles':
        return <AutomotiveIcon {...iconProps} />;
      case 'art':
      case 'crafts':
      case 'creative':
        return <ArtIcon {...iconProps} />;
      default:
        return <CategoryIcon {...iconProps} />;
    }
  };

  const navigationItems = [
    { label: 'Home', path: '/', icon: <HomeIcon /> },
    { label: 'Products', path: '/products', icon: <ProductsIcon /> },
    { label: 'Categories', onClick: (e: any) => setCategoriesMenuAnchor(e.currentTarget), icon: <CategoryIcon /> },
    { label: 'Offers', path: '/offers', icon: <OffersIcon /> },
  ];

  const userMenuItems = [
    { label: 'My Profile', path: '/profile', icon: <PersonIcon /> },
    { label: 'My Orders', path: '/profile?tab=1', icon: <HistoryIcon /> },
    { label: 'Wishlist', onClick: () => { setWishlistDrawerOpen(true); setAccountMenuAnchor(null); }, icon: <FavoriteIcon /> },
    { label: 'Settings', path: '/profile?tab=4', icon: <SettingsIcon /> },
    { divider: true },
    { label: 'Help & Support', path: '/help', icon: <HelpIcon /> },
    { label: 'Logout', onClick: handleLogout, icon: <LogoutIcon />, color: 'error' },
  ];

  return (
    <>
      {/* Top Bar */}
      <Box sx={{ 
        bgcolor: 'grey.900', 
        color: 'white', 
        py: 0.5,
        display: { xs: 'none', md: 'block' }
      }}>
        <Container maxWidth="xl">
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            fontSize: '0.875rem'
          }}>
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <PhoneIcon fontSize="small" />
                <Typography variant="caption">+1 (555) 123-4567</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <EmailIcon fontSize="small" />
                <Typography variant="caption">support@ecommerce.com</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <ScheduleIcon fontSize="small" />
                <Typography variant="caption">Mon-Fri 9AM-6PM</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography variant="caption">🚚 Free shipping on orders $50+</Typography>
              <Typography variant="caption">🎁 Special offers available</Typography>
            </Box>
          </Box>
        </Container>
      </Box>

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

      {/* Main Header */}
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderBottom: '3px solid rgba(255,255,255,0.1)'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ 
            px: { xs: 0, sm: 2 },
            gap: { xs: 1, sm: 2 },
            minHeight: { xs: 64, sm: 80 },
            py: { xs: 1, sm: 2 }
          }}>
            {/* Mobile Menu Button */}
            {isMobile && (
              <IconButton
                color="inherit"
                onClick={() => setMobileMenuOpen(true)}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}

            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
              }}>
                🛍️
              </Box>
              <Typography 
                variant={isMobile ? "h6" : "h4"} 
                component={Link} 
                to="/" 
                sx={{ 
                  textDecoration: 'none', 
                  color: 'inherit',
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #fff, #f0f0f0)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '2rem' }
                }}
              >
                ShopHub
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 1, ml: 4 }}>
                {navigationItems.map((item) => (
                  <Button
                    key={item.label}
                    color="inherit"
                    component={item.path ? Link : 'button'}
                    to={item.path}
                    onClick={item.onClick}
                    startIcon={item.icon}
                    endIcon={item.label === 'Categories' ? <ArrowDownIcon /> : undefined}
                    sx={{
                      fontWeight: 'bold',
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.2)' : 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        transform: 'translateY(-1px)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}

            <Box sx={{ flexGrow: 1 }} />

            {/* Search Bar */}
            <Box sx={{ 
              position: 'relative',
              width: { xs: '100%', sm: 400, md: 500 },
              maxWidth: { xs: 200, sm: 400, md: 500 },
              mx: { xs: 1, sm: 2 }
            }}>
              <Box component="form" onSubmit={handleSearch}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search products, brands, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: 3,
                      fontSize: '0.9rem',
                      '&:hover': {
                        backgroundColor: 'white',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'primary.main',
                          borderWidth: 2,
                        }
                      }
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: searchQuery && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSearchQuery('');
                            setSearchSuggestions([]);
                          }}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Box>

              {/* Search Suggestions */}
              {searchOpen && searchSuggestions.length > 0 && (
                <ClickAwayListener onClickAway={() => setSearchOpen(false)}>
                  <Paper
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      zIndex: 1300,
                      mt: 1,
                      borderRadius: 2,
                      boxShadow: 3,
                      maxHeight: 300,
                      overflow: 'auto'
                    }}
                  >
                    <List dense>
                      <ListItem>
                        <ListItemText
                          primary={`Found ${searchSuggestions.length} suggestions`}
                          sx={{ '& .MuiListItemText-primary': { fontSize: '0.875rem', fontWeight: 'bold' } }}
                        />
                      </ListItem>
                      {searchSuggestions.map((product) => (
                        <ListItemButton
                          key={product.id}
                          onClick={() => handleSearchSuggestionClick(product)}
                        >
                          <ListItemIcon>
                            <TrendingIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText
                            primary={product.name}
                            secondary={`$${product.price}`}
                          />
                        </ListItemButton>
                      ))}
                    </List>
                  </Paper>
                </ClickAwayListener>
              )}
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Notifications */}
              {isAuthenticated && (
                <Tooltip title="Notifications">
                  <IconButton color="inherit">
                    <Badge badgeContent={notifications.length} color="error">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>
              )}

              {/* Wishlist */}
              {isAuthenticated && (
                <Tooltip title="Wishlist">
                  <IconButton 
                    color="inherit"
                    onClick={() => setWishlistDrawerOpen(true)}
                  >
                    <Badge badgeContent={wishlistCount} color="error">
                      <FavoriteBorderIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>
              )}

              {/* Cart */}
              <Tooltip title="Shopping Cart">
                <IconButton
                  color="inherit"
                  onClick={() => setCartDrawerOpen(true)}
                >
                  <Badge badgeContent={cartItemsCount} color="secondary">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
              </Tooltip>

              {/* User Account */}
              {isAuthenticated ? (
                <Box>
                  <Button
                    color="inherit"
                    onClick={(e) => setAccountMenuAnchor(e.currentTarget)}
                    startIcon={
                      <Avatar sx={{ 
                        width: 32, 
                        height: 32, 
                        fontSize: '0.875rem',
                        backgroundColor: 'rgba(255,255,255,0.2)'
                      }}>
                        {user?.first_name?.[0]?.toUpperCase() || 'U'}
                      </Avatar>
                    }
                    endIcon={<ArrowDownIcon />}
                    sx={{
                      fontWeight: 'bold',
                      px: 2,
                      py: 1,
                      borderRadius: 2,
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                      }
                    }}
                  >
                    {!isMobile && (
                      <Box sx={{ textAlign: 'left', ml: 1 }}>
                        <Typography variant="body2" sx={{ lineHeight: 1.2 }}>
                          {user?.first_name || 'User'}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          {userStats.points} pts
                        </Typography>
                      </Box>
                    )}
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                  <Tooltip title="Login / Sign Up">
                    <Button
                      color="inherit"
                      onClick={(e) => setGuestMenuAnchor(e.currentTarget)}
                      startIcon={<AccountIcon />}
                      sx={{
                        fontWeight: 'bold',
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        border: '1px solid rgba(255,255,255,0.3)',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.1)',
                          borderColor: 'rgba(255,255,255,0.7)',
                        }
                      }}
                    >
                      Account
                    </Button>
                  </Tooltip>
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* User Account Menu */}
      <Menu
        anchorEl={accountMenuAnchor}
        open={Boolean(accountMenuAnchor)}
        onClose={() => setAccountMenuAnchor(null)}
        PaperProps={{
          sx: {
            width: 280,
            borderRadius: 2,
            mt: 1,
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1,
              borderRadius: 1,
              mx: 1,
              my: 0.5,
            }
          }
        }}
      >
        {/* User Info Header */}
        <Box sx={{ p: 2, pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar sx={{ 
              width: 48, 
              height: 48,
              backgroundColor: 'primary.main'
            }}>
              {user?.first_name?.[0]?.toUpperCase() || 'U'}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                {user?.first_name} {user?.last_name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
          </Box>
          
          {/* User Stats */}
          <Box sx={{ 
            display: 'flex', 
            gap: 1,
            p: 1.5,
            bgcolor: 'grey.50',
            borderRadius: 1,
          }}>
            <Box sx={{ textAlign: 'center', flex: 1 }}>
              <Typography variant="h6" fontWeight="bold" color="primary">
                {userStats.orders}
              </Typography>
              <Typography variant="caption">Orders</Typography>
            </Box>
            <Box sx={{ textAlign: 'center', flex: 1 }}>
              <Typography variant="h6" fontWeight="bold" color="primary">
                ${userStats.spent}
              </Typography>
              <Typography variant="caption">Spent</Typography>
            </Box>
            <Box sx={{ textAlign: 'center', flex: 1 }}>
              <Typography variant="h6" fontWeight="bold" color="primary">
                {userStats.points}
              </Typography>
              <Typography variant="caption">Points</Typography>
            </Box>
          </Box>
        </Box>

        <Divider />

        {/* Menu Items */}
        {userMenuItems.map((item, index) => (
          item.divider ? (
            <Divider key={index} sx={{ my: 1 }} />
          ) : (
            <MenuItem
              key={item.label}
              component={item.path ? Link : 'div'}
              to={item.path}
              onClick={item.onClick || (() => setAccountMenuAnchor(null))}
              sx={{
                color: item.color === 'error' ? 'error.main' : 'inherit',
                '&:hover': {
                  backgroundColor: item.color === 'error' ? 'error.light' : 'primary.light',
                  color: item.color === 'error' ? 'error.contrastText' : 'primary.contrastText',
                }
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </MenuItem>
          )
        ))}
      </Menu>

      {/* Guest Menu */}
      <Menu
        anchorEl={guestMenuAnchor}
        open={Boolean(guestMenuAnchor)}
        onClose={() => setGuestMenuAnchor(null)}
        PaperProps={{
          sx: {
            width: 200,
            borderRadius: 2,
            mt: 1,
            '& .MuiMenuItem-root': {
              px: 2,
              py: 1.5,
            }
          }
        }}
      >
        <MenuItem component={Link} to="/login" onClick={() => setGuestMenuAnchor(null)}>
          <ListItemIcon>
            <LoginIcon />
          </ListItemIcon>
          <ListItemText>Sign In</ListItemText>
        </MenuItem>
        <MenuItem component={Link} to="/register" onClick={() => setGuestMenuAnchor(null)}>
          <ListItemIcon>
            <PersonAddIcon />
          </ListItemIcon>
          <ListItemText>Sign Up</ListItemText>
        </MenuItem>
      </Menu>

      {/* Categories Menu */}
      <Menu
        anchorEl={categoriesMenuAnchor}
        open={Boolean(categoriesMenuAnchor)}
        onClose={() => setCategoriesMenuAnchor(null)}
        PaperProps={{
          sx: {
            width: 250,
            borderRadius: 2,
            mt: 1,
          }
        }}
      >
        <MenuItem sx={{ fontWeight: 'bold', color: 'primary.main' }} disabled>
          Browse Categories
        </MenuItem>
        <Divider />
        {categories.map((category) => (
          <MenuItem
            key={category.id}
            component={Link}
            to={`/products?category=${category.slug || category.id}`}
            onClick={() => setCategoriesMenuAnchor(null)}
          >
            <ListItemIcon>
              {getCategoryIcon(category.slug || category.name)}
            </ListItemIcon>
            <ListItemText primary={category.name} />
          </MenuItem>
        ))}
      </Menu>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: { width: 280 }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <Box sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem'
            }}>
              🛍️
            </Box>
            <Typography variant="h6" fontWeight="bold">
              ShopHub
            </Typography>
          </Box>

          {/* Search in mobile */}
          <Box component="form" onSubmit={handleSearch} sx={{ mb: 3 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
          </Box>

          {/* Navigation Items */}
          <List>
            {navigationItems.map((item) => (
              <ListItemButton
                key={item.label}
                component={item.path ? Link : 'div'}
                to={item.path}
                onClick={() => {
                  if (item.onClick) item.onClick({} as any);
                  setMobileMenuOpen(false);
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          {/* User Section */}
          {isAuthenticated ? (
            <List>
              {userMenuItems.map((item, index) => (
                item.divider ? (
                  <Divider key={index} sx={{ my: 1 }} />
                ) : (
                  <ListItemButton
                    key={item.label}
                    component={item.path ? Link : 'div'}
                    to={item.path}
                    onClick={() => {
                      if (item.onClick) item.onClick();
                      setMobileMenuOpen(false);
                    }}
                    sx={{
                      color: item.color === 'error' ? 'error.main' : 'inherit'
                    }}
                  >
                    <ListItemIcon sx={{ color: 'inherit' }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                )
              ))}
            </List>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                variant="outlined"
                component={Link}
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                fullWidth
              >
                Login
              </Button>
              <Button
                variant="contained"
                component={Link}
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                fullWidth
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>

      {/* Cart Drawer */}
      <CartDrawer
        open={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        open={wishlistDrawerOpen}
        onClose={() => setWishlistDrawerOpen(false)}
      />
    </>
  );
};

export default Header; 