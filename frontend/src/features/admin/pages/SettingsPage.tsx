import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Settings,
  Security,
  Email,
  Payment,
  Storage,
  Backup,
  Notifications,
  Save,
  Edit,
  Delete,
  Add,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useMutation } from '@tanstack/react-query';
import AdminLayout from '../components/AdminLayout';

interface SettingsData {
  general: {
    site_name: string;
    site_description: string;
    admin_email: string;
    timezone: string;
    currency: string;
    language: string;
  };
  security: {
    session_timeout: number;
    max_login_attempts: number;
    require_2fa: boolean;
    password_min_length: number;
    enable_captcha: boolean;
  };
  email: {
    smtp_host: string;
    smtp_port: number;
    smtp_username: string;
    smtp_password: string;
    from_email: string;
    from_name: string;
    enable_ssl: boolean;
  };
  payment: {
    stripe_enabled: boolean;
    stripe_public_key: string;
    stripe_secret_key: string;
    paypal_enabled: boolean;
    paypal_client_id: string;
    paypal_secret: string;
  };
  notifications: {
    email_notifications: boolean;
    low_stock_alerts: boolean;
    new_order_alerts: boolean;
    new_user_alerts: boolean;
    system_alerts: boolean;
  };
}

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SettingsData>({
    general: {
      site_name: 'Online Shop',
      site_description: 'Your trusted online shopping destination',
      admin_email: 'admin@onlineshop.com',
      timezone: 'UTC',
      currency: 'USD',
      language: 'en',
    },
    security: {
      session_timeout: 30,
      max_login_attempts: 5,
      require_2fa: false,
      password_min_length: 8,
      enable_captcha: true,
    },
    email: {
      smtp_host: 'smtp.gmail.com',
      smtp_port: 587,
      smtp_username: '',
      smtp_password: '',
      from_email: 'noreply@onlineshop.com',
      from_name: 'Online Shop',
      enable_ssl: true,
    },
    payment: {
      stripe_enabled: true,
      stripe_public_key: '',
      stripe_secret_key: '',
      paypal_enabled: false,
      paypal_client_id: '',
      paypal_secret: '',
    },
    notifications: {
      email_notifications: true,
      low_stock_alerts: true,
      new_order_alerts: true,
      new_user_alerts: false,
      system_alerts: true,
    },
  });

  const [showPasswords, setShowPasswords] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [testEmailDialog, setTestEmailDialog] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState('');

  // Save settings mutation
  const saveSettingsMutation = useMutation({
    mutationFn: (data: SettingsData) => {
      // В реальном приложении здесь будет API вызов
      return new Promise((resolve) => {
        setTimeout(() => resolve(data), 1000);
      });
    },
    onSuccess: () => {
      setSnackbar({ open: true, message: 'Settings saved successfully', severity: 'success' });
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Failed to save settings', severity: 'error' });
    },
  });

  // Test email mutation
  const testEmailMutation = useMutation({
    mutationFn: (email: string) => {
      // В реальном приложении здесь будет API вызов для тестирования email
      return new Promise((resolve) => {
        setTimeout(() => resolve({ success: true }), 2000);
      });
    },
    onSuccess: () => {
      setSnackbar({ open: true, message: 'Test email sent successfully', severity: 'success' });
      setTestEmailDialog(false);
    },
    onError: () => {
      setSnackbar({ open: true, message: 'Failed to send test email', severity: 'error' });
    },
  });

  const handleSave = () => {
    saveSettingsMutation.mutate(settings);
  };

  const handleTestEmail = () => {
    if (testEmailAddress) {
      testEmailMutation.mutate(testEmailAddress);
    }
  };

  const updateSettings = (section: keyof SettingsData, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  return (
    <AdminLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              System Settings
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Configure your store settings and preferences
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
            disabled={saveSettingsMutation.isPending}
          >
            {saveSettingsMutation.isPending ? 'Saving...' : 'Save Settings'}
          </Button>
        </Box>

        <Grid container spacing={3}>
          {/* General Settings */}
          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Settings color="primary" />
                  <Typography variant="h6">General Settings</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    label="Site Name"
                    value={settings.general.site_name}
                    onChange={(e) => updateSettings('general', 'site_name', e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="Site Description"
                    value={settings.general.site_description}
                    onChange={(e) => updateSettings('general', 'site_description', e.target.value)}
                    fullWidth
                    multiline
                    rows={2}
                  />
                  <TextField
                    label="Admin Email"
                    value={settings.general.admin_email}
                    onChange={(e) => updateSettings('general', 'admin_email', e.target.value)}
                    fullWidth
                    type="email"
                  />
                  <FormControl fullWidth>
                    <InputLabel>Timezone</InputLabel>
                    <Select
                      value={settings.general.timezone}
                      onChange={(e) => updateSettings('general', 'timezone', e.target.value)}
                      label="Timezone"
                    >
                      <MenuItem value="UTC">UTC</MenuItem>
                      <MenuItem value="America/New_York">Eastern Time</MenuItem>
                      <MenuItem value="America/Chicago">Central Time</MenuItem>
                      <MenuItem value="America/Denver">Mountain Time</MenuItem>
                      <MenuItem value="America/Los_Angeles">Pacific Time</MenuItem>
                      <MenuItem value="Europe/London">London</MenuItem>
                      <MenuItem value="Europe/Paris">Paris</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Currency</InputLabel>
                    <Select
                      value={settings.general.currency}
                      onChange={(e) => updateSettings('general', 'currency', e.target.value)}
                      label="Currency"
                    >
                      <MenuItem value="USD">USD ($)</MenuItem>
                      <MenuItem value="EUR">EUR (€)</MenuItem>
                      <MenuItem value="GBP">GBP (£)</MenuItem>
                      <MenuItem value="CAD">CAD (C$)</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Security Settings */}
          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Security color="primary" />
                  <Typography variant="h6">Security Settings</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    label="Session Timeout (minutes)"
                    value={settings.security.session_timeout}
                    onChange={(e) => updateSettings('security', 'session_timeout', parseInt(e.target.value))}
                    fullWidth
                    type="number"
                  />
                  <TextField
                    label="Max Login Attempts"
                    value={settings.security.max_login_attempts}
                    onChange={(e) => updateSettings('security', 'max_login_attempts', parseInt(e.target.value))}
                    fullWidth
                    type="number"
                  />
                  <TextField
                    label="Password Min Length"
                    value={settings.security.password_min_length}
                    onChange={(e) => updateSettings('security', 'password_min_length', parseInt(e.target.value))}
                    fullWidth
                    type="number"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.security.require_2fa}
                        onChange={(e) => updateSettings('security', 'require_2fa', e.target.checked)}
                      />
                    }
                    label="Require 2FA for Admin"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.security.enable_captcha}
                        onChange={(e) => updateSettings('security', 'enable_captcha', e.target.checked)}
                      />
                    }
                    label="Enable CAPTCHA"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Email Settings */}
          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Email color="primary" />
                  <Typography variant="h6">Email Settings</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField
                    label="SMTP Host"
                    value={settings.email.smtp_host}
                    onChange={(e) => updateSettings('email', 'smtp_host', e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="SMTP Port"
                    value={settings.email.smtp_port}
                    onChange={(e) => updateSettings('email', 'smtp_port', parseInt(e.target.value))}
                    fullWidth
                    type="number"
                  />
                  <TextField
                    label="SMTP Username"
                    value={settings.email.smtp_username}
                    onChange={(e) => updateSettings('email', 'smtp_username', e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="SMTP Password"
                    value={settings.email.smtp_password}
                    onChange={(e) => updateSettings('email', 'smtp_password', e.target.value)}
                    fullWidth
                    type={showPasswords ? 'text' : 'password'}
                    InputProps={{
                      endAdornment: (
                        <IconButton
                          onClick={() => setShowPasswords(!showPasswords)}
                          edge="end"
                        >
                          {showPasswords ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      ),
                    }}
                  />
                  <TextField
                    label="From Email"
                    value={settings.email.from_email}
                    onChange={(e) => updateSettings('email', 'from_email', e.target.value)}
                    fullWidth
                    type="email"
                  />
                  <TextField
                    label="From Name"
                    value={settings.email.from_name}
                    onChange={(e) => updateSettings('email', 'from_name', e.target.value)}
                    fullWidth
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.email.enable_ssl}
                        onChange={(e) => updateSettings('email', 'enable_ssl', e.target.checked)}
                      />
                    }
                    label="Enable SSL/TLS"
                  />
                  <Button
                    variant="outlined"
                    onClick={() => setTestEmailDialog(true)}
                    startIcon={<Email />}
                  >
                    Test Email Configuration
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Payment Settings */}
          <Grid item xs={12} lg={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Payment color="primary" />
                  <Typography variant="h6">Payment Settings</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.payment.stripe_enabled}
                        onChange={(e) => updateSettings('payment', 'stripe_enabled', e.target.checked)}
                      />
                    }
                    label="Enable Stripe"
                  />
                  {settings.payment.stripe_enabled && (
                    <>
                      <TextField
                        label="Stripe Public Key"
                        value={settings.payment.stripe_public_key}
                        onChange={(e) => updateSettings('payment', 'stripe_public_key', e.target.value)}
                        fullWidth
                      />
                      <TextField
                        label="Stripe Secret Key"
                        value={settings.payment.stripe_secret_key}
                        onChange={(e) => updateSettings('payment', 'stripe_secret_key', e.target.value)}
                        fullWidth
                        type={showPasswords ? 'text' : 'password'}
                      />
                    </>
                  )}
                  <Divider />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.payment.paypal_enabled}
                        onChange={(e) => updateSettings('payment', 'paypal_enabled', e.target.checked)}
                      />
                    }
                    label="Enable PayPal"
                  />
                  {settings.payment.paypal_enabled && (
                    <>
                      <TextField
                        label="PayPal Client ID"
                        value={settings.payment.paypal_client_id}
                        onChange={(e) => updateSettings('payment', 'paypal_client_id', e.target.value)}
                        fullWidth
                      />
                      <TextField
                        label="PayPal Secret"
                        value={settings.payment.paypal_secret}
                        onChange={(e) => updateSettings('payment', 'paypal_secret', e.target.value)}
                        fullWidth
                        type={showPasswords ? 'text' : 'password'}
                      />
                    </>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Notification Settings */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Notifications color="primary" />
                  <Typography variant="h6">Notification Settings</Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.notifications.email_notifications}
                          onChange={(e) => updateSettings('notifications', 'email_notifications', e.target.checked)}
                        />
                      }
                      label="Email Notifications"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.notifications.low_stock_alerts}
                          onChange={(e) => updateSettings('notifications', 'low_stock_alerts', e.target.checked)}
                        />
                      }
                      label="Low Stock Alerts"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.notifications.new_order_alerts}
                          onChange={(e) => updateSettings('notifications', 'new_order_alerts', e.target.checked)}
                        />
                      }
                      label="New Order Alerts"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.notifications.new_user_alerts}
                          onChange={(e) => updateSettings('notifications', 'new_user_alerts', e.target.checked)}
                        />
                      }
                      label="New User Alerts"
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.notifications.system_alerts}
                          onChange={(e) => updateSettings('notifications', 'system_alerts', e.target.checked)}
                        />
                      }
                      label="System Alerts"
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Test Email Dialog */}
        <Dialog open={testEmailDialog} onClose={() => setTestEmailDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Test Email Configuration</DialogTitle>
          <DialogContent>
            <TextField
              label="Test Email Address"
              value={testEmailAddress}
              onChange={(e) => setTestEmailAddress(e.target.value)}
              fullWidth
              type="email"
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setTestEmailDialog(false)}>Cancel</Button>
            <Button 
              onClick={handleTestEmail} 
              variant="contained"
              disabled={testEmailMutation.isPending || !testEmailAddress}
            >
              {testEmailMutation.isPending ? 'Sending...' : 'Send Test Email'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </AdminLayout>
  );
};

export default SettingsPage; 