import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Alert,
  Skeleton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Tooltip,
  Badge,
  LinearProgress,
  useTheme,
  useMediaQuery,
  Fade,
  Zoom,
  Divider,
  Stack,
  InputAdornment,
  OutlinedInput,
  FormHelperText,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  VisibilityOff as HideIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  LocalOffer as OfferIcon,
  FlashOn as FlashIcon,
  Schedule as ScheduleIcon,
  School as StudentIcon,
  NewReleases as NewIcon,
  Clear as ClearanceIcon,
  Timer as TimerIcon,
  Percent as PercentIcon,
  AttachMoney as MoneyIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Info as InfoIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingIcon,
  LocalShipping as ShippingIcon,
  Verified as VerifiedIcon,
  Close as CloseIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { api, adminAPI } from '../../../lib/api';

interface Offer {
  id: string;
  title: string;
  description: string;
  type: 'flash' | 'weekend' | 'clearance' | 'student' | 'new';
  discount_percent: number;
  min_order_amount?: number;
  max_discount_amount?: number;
  product_id?: string;
  category_id?: string;
  is_active: boolean;
  is_limited: boolean;
  max_uses?: number;
  used_count: number;
  start_date?: string;
  end_date?: string;
  image_url?: string;
  conditions: any[];
  created_at: string;
  updated_at: string;
}

interface OfferFormData {
  title: string;
  description: string;
  type: string;
  discount_percent: number;
  min_order_amount: number | '';
  max_discount_amount: number | '';
  product_id: string;
  category_id: string;
  is_active: boolean;
  is_limited: boolean;
  max_uses: number | '';
  start_date: string;
  end_date: string;
  image_url: string;
  conditions: any;
}

const OfferManagePage: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [formData, setFormData] = useState<OfferFormData>({
    title: '',
    description: '',
    type: 'flash',
    discount_percent: 0,
    min_order_amount: '',
    max_discount_amount: '',
    product_id: '',
    category_id: '',
    is_active: true,
    is_limited: false,
    max_uses: '',
    start_date: '',
    end_date: '',
    image_url: '',
    conditions: {}
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    fetchOffers();
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getOffers();
      if (response.data.success) {
        setOffers(response.data.data);
      } else {
        setError('Failed to load offers');
      }
    } catch (err) {
      console.error('Error fetching offers:', err);
      setError('Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      if (response.data.success) {
        setCategories(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products');
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const handleOpenDialog = (offer?: Offer) => {
    if (offer) {
      setEditingOffer(offer);
      setFormData({
        title: offer.title,
        description: offer.description,
        type: offer.type,
        discount_percent: offer.discount_percent,
        min_order_amount: offer.min_order_amount || '',
        max_discount_amount: offer.max_discount_amount || '',
        product_id: offer.product_id || '',
        category_id: offer.category_id || '',
        is_active: offer.is_active,
        is_limited: offer.is_limited,
        max_uses: offer.max_uses || '',
        start_date: offer.start_date ? offer.start_date.split(' ')[0] : '',
        end_date: offer.end_date ? offer.end_date.split(' ')[0] : '',
        image_url: offer.image_url || '',
        conditions: offer.conditions || {}
      });
    } else {
      setEditingOffer(null);
      setFormData({
        title: '',
        description: '',
        type: 'flash',
        discount_percent: 0,
        min_order_amount: '',
        max_discount_amount: '',
        product_id: '',
        category_id: '',
        is_active: true,
        is_limited: false,
        max_uses: '',
        start_date: '',
        end_date: '',
        image_url: '',
        conditions: {}
      });
    }
    setFormErrors({});
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingOffer(null);
    setFormErrors({});
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }

    if (formData.discount_percent <= 0 || formData.discount_percent > 100) {
      errors.discount_percent = 'Discount must be between 1 and 100';
    }

    if (formData.is_limited && (!formData.max_uses || formData.max_uses <= 0)) {
      errors.max_uses = 'Max uses is required for limited offers';
    }

    if (formData.start_date && formData.end_date && new Date(formData.start_date) >= new Date(formData.end_date)) {
      errors.end_date = 'End date must be after start date';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const submitData = {
        ...formData,
        min_order_amount: formData.min_order_amount || null,
        max_discount_amount: formData.max_discount_amount || null,
        max_uses: formData.max_uses || null,
        product_id: formData.product_id || null,
        category_id: formData.category_id || null,
      };

      if (editingOffer) {
        await adminAPI.updateOffer(editingOffer.id, submitData);
      } else {
        await adminAPI.createOffer(submitData);
      }

      handleCloseDialog();
      fetchOffers();
    } catch (err) {
      console.error('Error saving offer:', err);
      setError('Failed to save offer');
    }
  };

  const handleDelete = async (offerId: string) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      try {
        await adminAPI.deleteOffer(offerId);
        fetchOffers();
      } catch (err) {
        console.error('Error deleting offer:', err);
        setError('Failed to delete offer');
      }
    }
  };

  const handleToggleStatus = async (offerId: string, currentStatus: boolean) => {
    try {
      await adminAPI.toggleOfferStatus(offerId);
      fetchOffers();
    } catch (err) {
      console.error('Error toggling offer status:', err);
      setError('Failed to update offer status');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'flash':
        return <FlashIcon sx={{ color: 'error.main' }} />;
      case 'weekend':
        return <ScheduleIcon sx={{ color: 'primary.main' }} />;
      case 'clearance':
        return <ClearanceIcon sx={{ color: 'success.main' }} />;
      case 'student':
        return <StudentIcon sx={{ color: 'secondary.main' }} />;
      case 'new':
        return <NewIcon sx={{ color: 'warning.main' }} />;
      default:
        return <OfferIcon sx={{ color: 'grey.500' }} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'flash':
        return 'error';
      case 'weekend':
        return 'primary';
      case 'clearance':
        return 'success';
      case 'student':
        return 'secondary';
      case 'new':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'flash':
        return 'Flash Sale';
      case 'weekend':
        return 'Weekend Special';
      case 'clearance':
        return 'Clearance';
      case 'student':
        return 'Student Discount';
      case 'new':
        return 'New Arrival';
      default:
        return 'Special Offer';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTimeRemaining = (endDate: string) => {
    const now = new Date().getTime();
    const end = new Date(endDate).getTime();
    const diff = end - now;

    if (diff <= 0) return 'Expired';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         offer.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || offer.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && offer.is_active) ||
                         (statusFilter === 'inactive' && !offer.is_active);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const paginatedOffers = filteredOffers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width="60%" height={60} />
          <Skeleton variant="text" width="40%" height={30} />
        </Box>
        
        <Grid container spacing={3}>
          {[...Array(6)].map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Card sx={{ height: '100%' }}>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" height={32} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" height={20} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
          Manage Offers
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Create, edit, and manage promotional offers and discounts
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" color="primary.main" fontWeight="bold">
              {offers.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Offers
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" color="success.main" fontWeight="bold">
              {offers.filter(o => o.is_active).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Offers
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" color="warning.main" fontWeight="bold">
              {offers.filter(o => o.type === 'flash').length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Flash Sales
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" color="info.main" fontWeight="bold">
              {offers.reduce((sum, o) => sum + o.used_count, 0)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Uses
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Controls */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search offers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                label="Type"
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="flash">Flash Sale</MenuItem>
                <MenuItem value="weekend">Weekend Special</MenuItem>
                <MenuItem value="clearance">Clearance</MenuItem>
                <MenuItem value="student">Student Discount</MenuItem>
                <MenuItem value="new">New Arrival</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={fetchOffers}
              >
                Refresh
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                  }
                }}
              >
                Add Offer
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Offers Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'grey.50' }}>
                <TableCell>Offer</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Discount</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Usage</TableCell>
                <TableCell>Dates</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedOffers.map((offer) => (
                <TableRow key={offer.id} hover>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {offer.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 200 }}>
                        {offer.description}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getTypeIcon(offer.type)}
                      label={getTypeLabel(offer.type)}
                      color={getTypeColor(offer.type) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold" color="error.main">
                      {offer.discount_percent}% OFF
                    </Typography>
                    {offer.min_order_amount && (
                      <Typography variant="caption" color="text.secondary">
                        Min: ${offer.min_order_amount}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={offer.is_active ? 'Active' : 'Inactive'}
                      color={offer.is_active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {offer.used_count} / {offer.max_uses || '∞'}
                      </Typography>
                      {offer.is_limited && offer.max_uses && (
                        <LinearProgress
                          variant="determinate"
                          value={((offer.max_uses - offer.used_count) / offer.max_uses) * 100}
                          color="warning"
                          sx={{ mt: 0.5, height: 4, borderRadius: 2 }}
                        />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {offer.start_date ? formatDate(offer.start_date) : 'No start'}
                      </Typography>
                      <Typography variant="body2">
                        {offer.end_date ? formatDate(offer.end_date) : 'No end'}
                      </Typography>
                      {offer.type === 'flash' && offer.end_date && (
                        <Typography variant="caption" color="warning.main" fontWeight="bold">
                          {getTimeRemaining(offer.end_date)}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <Tooltip title="Toggle Status">
                        <IconButton
                          size="small"
                          onClick={() => handleToggleStatus(offer.id, offer.is_active)}
                          color={offer.is_active ? 'success' : 'default'}
                        >
                          {offer.is_active ? <ViewIcon /> : <HideIcon />}
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(offer)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(offer.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredOffers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {editingOffer ? <EditIcon /> : <AddIcon />}
            {editingOffer ? 'Edit Offer' : 'Add New Offer'}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                error={!!formErrors.title}
                helperText={formErrors.title}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={3}
                error={!!formErrors.description}
                helperText={formErrors.description}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  label="Type"
                >
                  <MenuItem value="flash">Flash Sale</MenuItem>
                  <MenuItem value="weekend">Weekend Special</MenuItem>
                  <MenuItem value="clearance">Clearance</MenuItem>
                  <MenuItem value="student">Student Discount</MenuItem>
                  <MenuItem value="new">New Arrival</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Discount Percentage"
                type="number"
                value={formData.discount_percent}
                onChange={(e) => setFormData({ ...formData, discount_percent: Number(e.target.value) })}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
                error={!!formErrors.discount_percent}
                helperText={formErrors.discount_percent}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Minimum Order Amount"
                type="number"
                value={formData.min_order_amount}
                onChange={(e) => setFormData({ ...formData, min_order_amount: e.target.value ? Number(e.target.value) : '' })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Maximum Discount Amount"
                type="number"
                value={formData.max_discount_amount}
                onChange={(e) => setFormData({ ...formData, max_discount_amount: e.target.value ? Number(e.target.value) : '' })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                error={!!formErrors.end_date}
                helperText={formErrors.end_date}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </Grid>

            <Grid item xs={12} sm={6}>
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

            <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Maximum Uses"
                  type="number"
                  value={formData.max_uses}
                  onChange={(e) => setFormData({ ...formData, max_uses: e.target.value ? Number(e.target.value) : '' })}
                  error={!!formErrors.max_uses}
                  helperText={formErrors.max_uses}
                />
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Product (Optional)</InputLabel>
                <Select
                  value={formData.product_id}
                  onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                  label="Product (Optional)"
                >
                  <MenuItem value="">No specific product</MenuItem>
                  {products.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category (Optional)</InputLabel>
                <Select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  label="Category (Optional)"
                >
                  <MenuItem value="">No specific category</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              }
            }}
          >
            {editingOffer ? 'Update Offer' : 'Create Offer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OfferManagePage; 