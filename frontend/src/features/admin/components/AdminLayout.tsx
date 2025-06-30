import React from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Dashboard,
  People,
  Inventory,
  ShoppingCart,
  AccountCircle,
  ExitToApp,
  LocalOffer,
  Category,
  Settings,
  Notifications,
  Store,
  Analytics,
  Discount,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { logout } from '../../../store/slices/authSlice';

const drawerWidth = 280;

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenu = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    handleClose();
  };

  const menuItems = [
    { 
      text: 'Dashboard', 
      icon: <Dashboard />, 
      path: '/admin',
      description: 'Overview and analytics'
    },
    { 
      text: 'Analytics', 
      icon: <Analytics />, 
      path: '/admin/analytics',
      description: 'Sales and performance metrics'
    },
    { 
      text: 'Users', 
      icon: <People />, 
      path: '/admin/users',
      description: 'Manage user accounts'
    },
    { 
      text: 'Products', 
      icon: <Inventory />, 
      path: '/admin/products',
      description: 'Product catalog management'
    },
    { 
      text: 'Categories', 
      icon: <Category />, 
      path: '/admin/categories',
      description: 'Product categories'
    },
    { 
      text: 'Orders', 
      icon: <ShoppingCart />, 
      path: '/admin/orders',
      description: 'Order management'
    },
    { 
      text: 'Offers', 
      icon: <LocalOffer />, 
      path: '/admin/offers',
      description: 'Promotional offers'
    },
    { 
      text: 'Coupons', 
      icon: <Discount />, 
      path: '/admin/coupons',
      description: 'Discount coupons'
    },
    { 
      text: 'Settings', 
      icon: <Settings />, 
      path: '/admin/settings',
      description: 'System settings'
    },
  ];

  // Mock notifications - в реальном приложении это будет из API
  const notifications = [
    { id: 1, message: 'New order #1234 received', time: '2 min ago', type: 'order' },
    { id: 2, message: 'Low stock alert: iPhone 15', time: '15 min ago', type: 'stock' },
    { id: 3, message: 'New user registered: john@example.com', time: '1 hour ago', type: 'user' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{ 
          width: `calc(100% - ${drawerWidth}px)`, 
          ml: `${drawerWidth}px`,
          backgroundColor: '#1a237e',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Admin Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Notifications">
              <IconButton
                size="large"
                onClick={handleNotificationMenu}
                color="inherit"
              >
                <Badge badgeContent={notifications.length} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={notificationAnchorEl}
              open={Boolean(notificationAnchorEl)}
              onClose={handleNotificationClose}
              PaperProps={{
                sx: { width: 350, maxHeight: 400 }
              }}
            >
              <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
                <Typography variant="h6">Notifications</Typography>
              </Box>
              {notifications.map((notification) => (
                <MenuItem key={notification.id} onClick={handleNotificationClose}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <Typography variant="body2">{notification.message}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {notification.time}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Menu>
            
            <Typography variant="body2" sx={{ mr: 1, display: { xs: 'none', sm: 'block' } }}>
              {user?.first_name} {user?.last_name}
            </Typography>
            <Tooltip title="Account settings">
              <IconButton
                size="large"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Tooltip>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => { navigate('/'); handleClose(); }}>
                <Store sx={{ mr: 1 }} />
                Go to Store
              </MenuItem>
              <MenuItem onClick={() => { navigate('/admin/settings'); handleClose(); }}>
                <Settings sx={{ mr: 1 }} />
                Settings
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ExitToApp sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#f8f9fa',
            borderRight: '1px solid #e0e0e0',
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar sx={{ 
          backgroundColor: '#1a237e', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <Store />
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
            Online Shop Admin
          </Typography>
        </Toolbar>
        <Divider />
        <Box sx={{ overflow: 'auto', mt: 1 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <Tooltip title={item.description} placement="right">
                  <ListItemButton
                    selected={location.pathname === item.path}
                    onClick={() => navigate(item.path)}
                    sx={{
                      mx: 1,
                      borderRadius: 1,
                      '&.Mui-selected': {
                        backgroundColor: '#e3f2fd',
                        color: '#1976d2',
                        '&:hover': {
                          backgroundColor: '#bbdefb',
                        },
                      },
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ 
                      color: location.pathname === item.path ? '#1976d2' : 'inherit',
                      minWidth: 40 
                    }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text} 
                      primaryTypographyProps={{
                        fontSize: '0.9rem',
                        fontWeight: location.pathname === item.path ? 600 : 400,
                      }}
                    />
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          bgcolor: '#fafafa', 
          minHeight: '100vh',
          p: 3,
          pt: 4
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout; 