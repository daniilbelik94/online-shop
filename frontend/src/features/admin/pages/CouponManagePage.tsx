import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Chip,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Grid,
  Card,
  CardContent,
  InputAdornment,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  LocalOffer,
  CalendarToday,
  AttachMoney,
  Percent,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../../../lib/api';
import AdminLayout from '../components/AdminLayout';

interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_order_amount?: number;
  max_discount_amount?: number;
  is_active: boolean;
  is_limited: boolean;
  max_uses?: number;
  current_uses: number;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

interface CouponFormData {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_order_amount?: number;
  max_discount_amount?: number;
  is_active: boolean;
  is_limited: boolean;
  max_uses?: number;
  start_date?: string;
  end_date?: string;
}

const CouponManagePage: React.FC = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState<CouponFormData>({
    code: '',
    type: 'percentage',
    value: 0,
    min_order_amount: 0,
    max_discount_amount: 0,
    is_active: true,
    is_limited: false,
    max_uses: 0,
    start_date: '',
    end_date: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Fetch coupons
  const { data: coupons, isLoading } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: async () => {
      // В реальном приложении здесь будет API вызов
      return [
        {
          id: '1',
          code: 'SAVE10',
          type: 'percentage',
          value: 10,
          min_order_amount: 50,
          max_discount_amount: 25,
          is_active: true,
          is_limited: true,
          max_uses: 100,
          current_uses: 45,
          start_date: '2024-01-01T00:00:00Z',
          end_date: '2024-12-31T23:59:59Z',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
        {
          id: '2',
          code: 'FREESHIP',
          type: 'fixed',
          value: 15,
          min_order_amount: 100,
          max_discount_amount: 15,
          is_active: true,
          is_limited: false,
          max_uses: 0,
          current_uses: 23,
          start_date: '2024-01-01T00:00:00Z',
          end_date: '2024-06-30T23:59:59Z',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
        {
          id: '3',
          code: 'WELCOME20',
          type: 'percentage',
          value: 20,
          min_order_amount: 0,
          max_discount_amount: 50,
          is_active: false,
          is_limited: true,
          max_uses: 50,
          current_uses: 50,
          start_date: '2024-01-01T00:00:00Z',
          end_date: '2024-03-31T23:59:59Z',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
        },
      ] as Coupon[];
    },
  });

  // Create coupon mutation
  const createCouponMutation = useMutation({
    mutationFn: (data: CouponFormData) => adminAPI.createCoupon(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
      setDialogOpen(false);
      resetForm();
      setSnackbar({ open: true, message: 'Coupon created successfully', severity: 'success' });
    },
    onError: (error: any) => {
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.error || 'Failed to create coupon', 
        severity: 'error' 
      });
    },
  });

  // Update coupon mutation
  const updateCouponMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CouponFormData }) => 
      adminAPI.updateCoupon(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
      setDialogOpen(false);
      setEditingCoupon(null);
      resetForm();
      setSnackbar({ open: true, message: 'Coupon updated successfully', severity: 'success' });
    },
    onError: (error: any) => {
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.error || 'Failed to update coupon', 
        severity: 'error' 
      });
    },
  });

  // Delete coupon mutation
  const deleteCouponMutation = useMutation({
    mutationFn: (id: string) => adminAPI.deleteCoupon(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
      setSnackbar({ open: true, message: 'Coupon deleted successfully', severity: 'success' });
    },
    onError: (error: any) => {
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.error || 'Failed to delete coupon', 
        severity: 'error' 
      });
    },
  });

  // Toggle coupon status mutation
  const toggleCouponMutation = useMutation({
    mutationFn: (id: string) => adminAPI.toggleCouponStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] });
      setSnackbar({ open: true, message: 'Coupon status updated', severity: 'success' });
    },
    onError: (error: any) => {
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.error || 'Failed to update coupon status', 
        severity: 'error' 
      });
    },
  });

  const resetForm = () => {
    setFormData({
      code: '',
      type: 'percentage',
      value: 0,
      min_order_amount: 0,
      max_discount_amount: 0,
      is_active: true,
      is_limited: false,
      max_uses: 0,
      start_date: '',
      end_date: '',
    });
  };

  const handleOpenDialog = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        min_order_amount: coupon.min_order_amount || 0,
        max_discount_amount: coupon.max_discount_amount || 0,
        is_active: coupon.is_active,
        is_limited: coupon.is_limited,
        max_uses: coupon.max_uses || 0,
        start_date: coupon.start_date ? coupon.start_date.split('T')[0] : '',
        end_date: coupon.end_date ? coupon.end_date.split('T')[0] : '',
      });
    } else {
      setEditingCoupon(null);
      resetForm();
    }
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.code.trim()) {
      setSnackbar({ open: true, message: 'Coupon code is required', severity: 'error' });
      return;
    }

    if (formData.value <= 0) {
      setSnackbar({ open: true, message: 'Coupon value must be greater than 0', severity: 'error' });
      return;
    }

    if (editingCoupon) {
      updateCouponMutation.mutate({ id: editingCoupon.id, data: formData });
    } else {
      createCouponMutation.mutate(formData);
    }
  };

  const handleDelete = (coupon: Coupon) => {
    if (window.confirm(`Are you sure you want to delete coupon "${coupon.code}"? This action cannot be undone.`)) {
      deleteCouponMutation.mutate(coupon.id);
    }
  };

  const handleToggleStatus = (coupon: Coupon) => {
    toggleCouponMutation.mutate(coupon.id);
  };

  const getCouponStatus = (coupon: Coupon) => {
    const now = new Date();
    const startDate = coupon.start_date ? new Date(coupon.start_date) : null;
    const endDate = coupon.end_date ? new Date(coupon.end_date) : null;

    if (!coupon.is_active) return 'inactive';
    if (startDate && now < startDate) return 'pending';
    if (endDate && now > endDate) return 'expired';
    if (coupon.is_limited && coupon.max_uses && coupon.current_uses >= coupon.max_uses) return 'exhausted';
    return 'active';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'pending': return 'warning';
      case 'expired': return 'error';
      case 'exhausted': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle />;
      case 'inactive': return <Cancel />;
      case 'pending': return <CalendarToday />;
      case 'expired': return <Cancel />;
      case 'exhausted': return <Cancel />;
      default: return <Cancel />;
    }
  };

  const activeCoupons = coupons?.filter(coupon => getCouponStatus(coupon) === 'active') || [];
  const inactiveCoupons = coupons?.filter(coupon => getCouponStatus(coupon) !== 'active') || [];

  return (
    <AdminLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Coupon Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Create and manage discount coupons for your customers
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Add Coupon
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Total Coupons
                    </Typography>
                    <Typography variant="h4" component="div">
                      {coupons?.length || 0}
                    </Typography>
                  </Box>
                  <LocalOffer color="primary" fontSize="large" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Active Coupons
                    </Typography>
                    <Typography variant="h4" component="div">
                      {activeCoupons.length}
                    </Typography>
                  </Box>
                  <CheckCircle color="success" fontSize="large" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Total Uses
                    </Typography>
                    <Typography variant="h4" component="div">
                      {coupons?.reduce((sum, coupon) => sum + coupon.current_uses, 0) || 0}
                    </Typography>
                  </Box>
                  <AttachMoney color="primary" fontSize="large" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      Expired Coupons
                    </Typography>
                    <Typography variant="h4" component="div">
                      {coupons?.filter(coupon => getCouponStatus(coupon) === 'expired').length || 0}
                    </Typography>
                  </Box>
                  <Cancel color="error" fontSize="large" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Active Coupons */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircle color="success" />
            Active Coupons
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Value</TableCell>
                  <TableCell>Min Order</TableCell>
                  <TableCell>Max Discount</TableCell>
                  <TableCell>Uses</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Expires</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activeCoupons.map((coupon) => (
                  <TableRow key={coupon.id}>
                    <TableCell>
                      <Typography variant="body1" fontWeight={600} fontFamily="monospace">
                        {coupon.code}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        icon={coupon.type === 'percentage' ? <Percent /> : <AttachMoney />}
                        label={coupon.type === 'percentage' ? 'Percentage' : 'Fixed'}
                        size="small"
                        color={coupon.type === 'percentage' ? 'primary' : 'secondary'}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value}`}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {coupon.min_order_amount ? `$${coupon.min_order_amount}` : 'No minimum'}
                    </TableCell>
                    <TableCell>
                      {coupon.max_discount_amount ? `$${coupon.max_discount_amount}` : 'No limit'}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2">
                          {coupon.current_uses}
                        </Typography>
                        {coupon.is_limited && coupon.max_uses && (
                          <Typography variant="caption" color="text.secondary">
                            / {coupon.max_uses}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(getCouponStatus(coupon))}
                        label={getCouponStatus(coupon)}
                        color={getStatusColor(getCouponStatus(coupon)) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {coupon.end_date ? new Date(coupon.end_date).toLocaleDateString() : 'No expiry'}
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Edit Coupon">
                          <IconButton 
                            size="small"
                            onClick={() => handleOpenDialog(coupon)}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Toggle Status">
                          <IconButton 
                            size="small"
                            onClick={() => handleToggleStatus(coupon)}
                            disabled={toggleCouponMutation.isPending}
                          >
                            {coupon.is_active ? <Cancel /> : <CheckCircle />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Coupon">
                          <IconButton 
                            size="small"
                            color="error"
                            onClick={() => handleDelete(coupon)}
                            disabled={deleteCouponMutation.isPending}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Inactive Coupons */}
        {inactiveCoupons.length > 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Cancel color="error" />
              Inactive Coupons
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Code</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>Uses</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Expires</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inactiveCoupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell>
                        <Typography variant="body1" fontWeight={600} fontFamily="monospace">
                          {coupon.code}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          icon={coupon.type === 'percentage' ? <Percent /> : <AttachMoney />}
                          label={coupon.type === 'percentage' ? 'Percentage' : 'Fixed'}
                          size="small"
                          color={coupon.type === 'percentage' ? 'primary' : 'secondary'}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>
                          {coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value}`}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2">
                            {coupon.current_uses}
                          </Typography>
                          {coupon.is_limited && coupon.max_uses && (
                            <Typography variant="caption" color="text.secondary">
                              / {coupon.max_uses}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getStatusIcon(getCouponStatus(coupon))}
                          label={getCouponStatus(coupon)}
                          color={getStatusColor(getCouponStatus(coupon)) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {coupon.end_date ? new Date(coupon.end_date).toLocaleDateString() : 'No expiry'}
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Edit Coupon">
                            <IconButton 
                              size="small"
                              onClick={() => handleOpenDialog(coupon)}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Toggle Status">
                            <IconButton 
                              size="small"
                              onClick={() => handleToggleStatus(coupon)}
                              disabled={toggleCouponMutation.isPending}
                            >
                              {coupon.is_active ? <Cancel /> : <CheckCircle />}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Coupon">
                            <IconButton 
                              size="small"
                              color="error"
                              onClick={() => handleDelete(coupon)}
                              disabled={deleteCouponMutation.isPending}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* Coupon Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Coupon Code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  fullWidth
                  required
                  helperText="Enter a unique coupon code"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'percentage' | 'fixed' })}
                    label="Type"
                  >
                    <MenuItem value="percentage">Percentage Discount</MenuItem>
                    <MenuItem value="fixed">Fixed Amount Discount</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label={formData.type === 'percentage' ? 'Discount Percentage' : 'Discount Amount'}
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })}
                  fullWidth
                  required
                  type="number"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">
                      {formData.type === 'percentage' ? '%' : '$'}
                    </InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Minimum Order Amount"
                  value={formData.min_order_amount}
                  onChange={(e) => setFormData({ ...formData, min_order_amount: parseFloat(e.target.value) || 0 })}
                  fullWidth
                  type="number"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Maximum Discount Amount"
                  value={formData.max_discount_amount}
                  onChange={(e) => setFormData({ ...formData, max_discount_amount: parseFloat(e.target.value) || 0 })}
                  fullWidth
                  type="number"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Start Date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  fullWidth
                  type="date"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="End Date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  fullWidth
                  type="date"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    />
                  }
                  label="Active"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.is_limited}
                      onChange={(e) => setFormData({ ...formData, is_limited: e.target.checked })}
                    />
                  }
                  label="Limited Uses"
                />
              </Grid>
              {formData.is_limited && (
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Maximum Uses"
                    value={formData.max_uses}
                    onChange={(e) => setFormData({ ...formData, max_uses: parseInt(e.target.value) || 0 })}
                    fullWidth
                    type="number"
                  />
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained"
              disabled={createCouponMutation.isPending || updateCouponMutation.isPending}
            >
              {createCouponMutation.isPending || updateCouponMutation.isPending 
                ? 'Saving...' 
                : (editingCoupon ? 'Update' : 'Create')
              }
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

export default CouponManagePage; 