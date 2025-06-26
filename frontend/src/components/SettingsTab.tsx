import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slider,
  useTheme,
  useMediaQuery,
  RadioGroup,
  Radio,
  FormLabel,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  NotificationsNone as NotificationsIcon,
  Security as SecurityIcon,
  Language as LanguageIcon,
  Palette as ThemeIcon,
  ExpandMore as ExpandMoreIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Lock as LockIcon,
  Shield as ShieldIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Sms as SmsIcon,
  Devices as DevicesIcon,
  History as HistoryIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  CloudDownload as CloudIcon,
  Person as PersonIcon,
  CreditCard as PaymentIcon,
  LocationOn as LocationIcon,
  ShoppingCart as ShoppingIcon,
  Store as StoreIcon,
  Favorite as WishlistIcon,
  Star as ReviewIcon,
  Help as HelpIcon,
  Feedback as FeedbackIcon,
  BugReport as BugIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Refresh as RefreshIcon,
  VolumeUp as VolumeIcon,
  Brightness6 as BrightnessIcon,
  Accessibility as AccessibilityIcon,
  Cookie as CookieIcon,
} from '@mui/icons-material';

const SettingsTab: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State for all settings
  const [settings, setSettings] = useState({
    notifications: {
      emailMarketing: true,
      orderUpdates: true,
      securityAlerts: true,
      priceDrops: true,
      backInStock: true,
      newsletter: true,
      smsNotifications: false,
      pushNotifications: true,
    },
    privacy: {
      profileVisibility: 'private',
      showOnlineStatus: false,
      shareWishlist: false,
      allowRecommendations: true,
      cookiesAnalytics: true,
      cookiesMarketing: false,
      dataSharing: false,
    },
    appearance: {
      theme: 'auto',
      language: 'en',
      currency: 'USD',
      timeZone: 'auto',
      compactMode: false,
      animations: true,
      highContrast: false,
    },
    shopping: {
      saveForLater: true,
      autoAddToWishlist: false,
      oneClickBuy: false,
      rememberPayment: true,
      defaultShipping: 'standard',
      autoApplyDiscounts: true,
    },
    security: {
      twoFactorEnabled: false,
      loginAlerts: true,
      passwordExpiry: 90,
      secureCheckout: true,
      biometricAuth: false,
    }
  });

  const [activeDevices, setActiveDevices] = useState([
    { id: 1, name: 'iPhone 13', location: 'New York, NY', lastActive: '2024-01-15T10:30:00Z', current: true },
    { id: 2, name: 'MacBook Pro', location: 'New York, NY', lastActive: '2024-01-14T15:45:00Z', current: false },
    { id: 3, name: 'Chrome Browser', location: 'Boston, MA', lastActive: '2024-01-10T12:20:00Z', current: false },
  ]);

  const [deleteAccountDialog, setDeleteAccountDialog] = useState(false);
  const [exportDataDialog, setExportDataDialog] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      // TODO: API call to save settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setSuccess('Settings saved successfully!');
    } catch (err) {
      setError('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      setLoading(true);
      // TODO: API call to export user data
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess('Data export has been sent to your email!');
      setExportDataDialog(false);
    } catch (err) {
      setError('Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      // TODO: API call to delete account
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess('Account deletion request submitted');
      setDeleteAccountDialog(false);
    } catch (err) {
      setError('Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeDevice = (deviceId: number) => {
    setActiveDevices(prev => prev.filter(device => device.id !== deviceId));
    setSuccess('Device access revoked successfully');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Box sx={{ px: { xs: 2, sm: 4 } }}>
      {/* Success/Error Messages */}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" fontWeight="bold">
          ⚙️ Settings & Preferences
        </Typography>
        <Button
          variant="contained"
          onClick={handleSaveSettings}
          disabled={loading}
          startIcon={<SaveIcon />}
          sx={{ borderRadius: 2 }}
        >
          Save Changes
        </Button>
      </Box>

      {/* Notifications Settings */}
      <Accordion defaultExpanded sx={{ mb: 2, borderRadius: 2, '&:before': { display: 'none' } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <NotificationsIcon color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Notification Preferences
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                📧 Email Notifications
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Order Updates"
                    secondary="Notifications about your order status"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.notifications.orderUpdates}
                      onChange={(e) => handleSettingChange('notifications', 'orderUpdates', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Marketing Emails"
                    secondary="Promotional offers and deals"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.notifications.emailMarketing}
                      onChange={(e) => handleSettingChange('notifications', 'emailMarketing', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Security Alerts"
                    secondary="Account security notifications"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.notifications.securityAlerts}
                      onChange={(e) => handleSettingChange('notifications', 'securityAlerts', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Price Drop Alerts"
                    secondary="When items in your wishlist go on sale"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.notifications.priceDrops}
                      onChange={(e) => handleSettingChange('notifications', 'priceDrops', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                📱 Mobile & SMS
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="SMS Notifications"
                    secondary="Text messages for important updates"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.notifications.smsNotifications}
                      onChange={(e) => handleSettingChange('notifications', 'smsNotifications', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Push Notifications"
                    secondary="Browser and app notifications"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.notifications.pushNotifications}
                      onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Back in Stock"
                    secondary="When out-of-stock items are available"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.notifications.backInStock}
                      onChange={(e) => handleSettingChange('notifications', 'backInStock', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Newsletter"
                    secondary="Weekly newsletter with tips and trends"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.notifications.newsletter}
                      onChange={(e) => handleSettingChange('notifications', 'newsletter', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Privacy Settings */}
      <Accordion sx={{ mb: 2, borderRadius: 2, '&:before': { display: 'none' } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ShieldIcon color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Privacy & Data
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                👤 Profile Privacy
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Profile Visibility</InputLabel>
                <Select
                  value={settings.privacy.profileVisibility}
                  onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                  label="Profile Visibility"
                >
                  <MenuItem value="public">Public</MenuItem>
                  <MenuItem value="friends">Friends Only</MenuItem>
                  <MenuItem value="private">Private</MenuItem>
                </Select>
              </FormControl>
              
              <List>
                <ListItem>
                  <ListItemText
                    primary="Show Online Status"
                    secondary="Let others see when you're online"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.privacy.showOnlineStatus}
                      onChange={(e) => handleSettingChange('privacy', 'showOnlineStatus', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Share Wishlist"
                    secondary="Allow others to view your wishlist"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.privacy.shareWishlist}
                      onChange={(e) => handleSettingChange('privacy', 'shareWishlist', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                🍪 Data & Cookies
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Personalized Recommendations"
                    secondary="Use your data to suggest products"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.privacy.allowRecommendations}
                      onChange={(e) => handleSettingChange('privacy', 'allowRecommendations', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Analytics Cookies"
                    secondary="Help us improve the website"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.privacy.cookiesAnalytics}
                      onChange={(e) => handleSettingChange('privacy', 'cookiesAnalytics', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Marketing Cookies"
                    secondary="Personalized ads and content"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.privacy.cookiesMarketing}
                      onChange={(e) => handleSettingChange('privacy', 'cookiesMarketing', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Data Sharing"
                    secondary="Share data with trusted partners"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.privacy.dataSharing}
                      onChange={(e) => handleSettingChange('privacy', 'dataSharing', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Appearance Settings */}
      <Accordion sx={{ mb: 2, borderRadius: 2, '&:before': { display: 'none' } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ThemeIcon color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Appearance & Display
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Theme</InputLabel>
                <Select
                  value={settings.appearance.theme}
                  onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
                  label="Theme"
                >
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="dark">Dark</MenuItem>
                  <MenuItem value="auto">Auto (System)</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Language</InputLabel>
                <Select
                  value={settings.appearance.language}
                  onChange={(e) => handleSettingChange('appearance', 'language', e.target.value)}
                  label="Language"
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="es">Español</MenuItem>
                  <MenuItem value="fr">Français</MenuItem>
                  <MenuItem value="de">Deutsch</MenuItem>
                  <MenuItem value="it">Italiano</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Currency</InputLabel>
                <Select
                  value={settings.appearance.currency}
                  onChange={(e) => handleSettingChange('appearance', 'currency', e.target.value)}
                  label="Currency"
                >
                  <MenuItem value="USD">USD ($)</MenuItem>
                  <MenuItem value="EUR">EUR (€)</MenuItem>
                  <MenuItem value="GBP">GBP (£)</MenuItem>
                  <MenuItem value="CAD">CAD ($)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Compact Mode"
                    secondary="Show more content in less space"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.appearance.compactMode}
                      onChange={(e) => handleSettingChange('appearance', 'compactMode', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Animations"
                    secondary="Enable smooth transitions and effects"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.appearance.animations}
                      onChange={(e) => handleSettingChange('appearance', 'animations', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="High Contrast"
                    secondary="Improve readability for accessibility"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.appearance.highContrast}
                      onChange={(e) => handleSettingChange('appearance', 'highContrast', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Shopping Preferences */}
      <Accordion sx={{ mb: 2, borderRadius: 2, '&:before': { display: 'none' } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ShoppingIcon color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Shopping Preferences
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Default Shipping</InputLabel>
                <Select
                  value={settings.shopping.defaultShipping}
                  onChange={(e) => handleSettingChange('shopping', 'defaultShipping', e.target.value)}
                  label="Default Shipping"
                >
                  <MenuItem value="standard">Standard (5-7 days)</MenuItem>
                  <MenuItem value="express">Express (2-3 days)</MenuItem>
                  <MenuItem value="overnight">Overnight</MenuItem>
                </Select>
              </FormControl>

              <List>
                <ListItem>
                  <ListItemText
                    primary="Save for Later"
                    secondary="Keep items in cart between sessions"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.shopping.saveForLater}
                      onChange={(e) => handleSettingChange('shopping', 'saveForLater', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Auto Add to Wishlist"
                    secondary="Add viewed items to wishlist automatically"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.shopping.autoAddToWishlist}
                      onChange={(e) => handleSettingChange('shopping', 'autoAddToWishlist', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <List>
                <ListItem>
                  <ListItemText
                    primary="One-Click Buy"
                    secondary="Skip cart and buy immediately"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.shopping.oneClickBuy}
                      onChange={(e) => handleSettingChange('shopping', 'oneClickBuy', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Remember Payment Info"
                    secondary="Save payment methods securely"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.shopping.rememberPayment}
                      onChange={(e) => handleSettingChange('shopping', 'rememberPayment', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Auto Apply Discounts"
                    secondary="Automatically apply available coupons"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.shopping.autoApplyDiscounts}
                      onChange={(e) => handleSettingChange('shopping', 'autoApplyDiscounts', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Security & Login */}
      <Accordion sx={{ mb: 2, borderRadius: 2, '&:before': { display: 'none' } }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <SecurityIcon color="primary" />
            <Typography variant="h6" fontWeight="bold">
              Security & Login
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                🔐 Account Security
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Two-Factor Authentication"
                    secondary="Add an extra layer of security"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.security.twoFactorEnabled}
                      onChange={(e) => handleSettingChange('security', 'twoFactorEnabled', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Login Alerts"
                    secondary="Get notified of new login attempts"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.security.loginAlerts}
                      onChange={(e) => handleSettingChange('security', 'loginAlerts', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Biometric Authentication"
                    secondary="Use fingerprint or face recognition"
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={settings.security.biometricAuth}
                      onChange={(e) => handleSettingChange('security', 'biometricAuth', e.target.checked)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                📱 Active Devices
              </Typography>
              <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Device</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Last Active</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activeDevices.map((device) => (
                      <TableRow key={device.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <DevicesIcon fontSize="small" />
                            <Box>
                              <Typography variant="body2" fontWeight="bold">
                                {device.name}
                              </Typography>
                              {device.current && (
                                <Chip label="Current" size="small" color="success" />
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{device.location}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(device.lastActive)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          {!device.current && (
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleRevokeDevice(device.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Data Management */}
      <Paper sx={{ p: 3, borderRadius: 3, bgcolor: 'grey.50' }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          💾 Data Management
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <CloudIcon color="info" />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Export Your Data
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Download a copy of all your account data
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="outlined"
                onClick={() => setExportDataDialog(true)}
                fullWidth
                sx={{ borderRadius: 2 }}
              >
                Request Data Export
              </Button>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2, borderRadius: 2, borderColor: 'error.main', borderWidth: 1, borderStyle: 'solid' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <WarningIcon color="error" />
                <Box>
                  <Typography variant="h6" fontWeight="bold" color="error">
                    Delete Account
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Permanently delete your account and data
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setDeleteAccountDialog(true)}
                fullWidth
                sx={{ borderRadius: 2 }}
              >
                Delete Account
              </Button>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      {/* Export Data Dialog */}
      <Dialog open={exportDataDialog} onClose={() => setExportDataDialog(false)}>
        <DialogTitle>Export Your Data</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            We'll prepare a complete copy of your account data including:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon><PersonIcon /></ListItemIcon>
              <ListItemText primary="Profile information" />
            </ListItem>
            <ListItem>
              <ListItemIcon><ShoppingIcon /></ListItemIcon>
              <ListItemText primary="Order history" />
            </ListItem>
            <ListItem>
              <ListItemIcon><WishlistIcon /></ListItemIcon>
              <ListItemText primary="Wishlist items" />
            </ListItem>
            <ListItem>
              <ListItemIcon><ReviewIcon /></ListItemIcon>
              <ListItemText primary="Reviews and ratings" />
            </ListItem>
          </List>
          <Typography variant="body2" color="text.secondary">
            The export will be sent to your registered email address within 24 hours.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDataDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleExportData} variant="contained" disabled={loading}>
            {loading ? 'Processing...' : 'Export Data'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={deleteAccountDialog} onClose={() => setDeleteAccountDialog(false)}>
        <DialogTitle color="error">Delete Account</DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ mb: 2 }}>
            This action cannot be undone!
          </Alert>
          <Typography variant="body1" gutterBottom>
            Deleting your account will permanently remove:
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon><PersonIcon /></ListItemIcon>
              <ListItemText primary="All profile information" />
            </ListItem>
            <ListItem>
              <ListItemIcon><ShoppingIcon /></ListItemIcon>
              <ListItemText primary="Order history and data" />
            </ListItem>
            <ListItem>
              <ListItemIcon><WishlistIcon /></ListItemIcon>
              <ListItemText primary="Wishlist and saved items" />
            </ListItem>
            <ListItem>
              <ListItemIcon><ReviewIcon /></ListItemIcon>
              <ListItemText primary="Reviews and ratings" />
            </ListItem>
          </List>
          <Typography variant="body2" color="text.secondary">
            You will receive a confirmation email before the deletion is processed.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteAccountDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleDeleteAccount} color="error" variant="contained" disabled={loading}>
            {loading ? 'Processing...' : 'Delete Account'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SettingsTab; 