import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
  Tooltip,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  TrendingUp as StatsIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import { adminAPI, publicAPI, Product, Category, ProductStats } from '../../../lib/api';
import ImageUpload from '../../../components/ImageUpload';

interface UploadedImage {
  url: string;
  filename: string;
  size: number;
  type: string;
}

interface ProductFormData {
  name: string;
  description: string;
  short_description: string;
  price: number;
  category_id: string | number;
  brand: string;
  stock_quantity: number;
  sku: string;
  image_url: string;
  images: UploadedImage[];
}

const ProductManagePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalProducts, setTotalProducts] = useState(0);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    short_description: '',
    price: 0,
    category_id: 0,
    brand: '',
    stock_quantity: 0,
    sku: '',
    image_url: '',
    images: [],
  });
  const [formErrors, setFormErrors] = useState<Partial<ProductFormData>>({});
  const [submitting, setSubmitting] = useState(false);

  // Check if we should open edit dialog on page load
  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId && products.length > 0) {
      const productToEdit = products.find(p => p.id.toString() === editId);
      if (productToEdit) {
        handleOpenDialog(productToEdit);
        // Remove the edit parameter from URL
        setSearchParams({});
      }
    }
  }, [searchParams, products, setSearchParams]);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await adminAPI.getProducts({
        page: page + 1,
        limit: rowsPerPage,
        search: searchTerm,
        category_id: filterCategory || undefined,
      });
      
      const data = response.data;
      console.log('Products response:', data); // Debug log
      
      // Safe array handling - ensure we always get an array
      const productsData = data?.data || data || [];
      let filteredProducts = Array.isArray(productsData) ? productsData : [];
      
      // Apply client-side filtering for status since API might not support it
      if (filterStatus) {
        filteredProducts = filteredProducts.filter((product: Product) => {
          switch (filterStatus) {
            case 'in_stock':
              return product.stock_quantity > 5;
            case 'low_stock':
              return product.stock_quantity > 0 && product.stock_quantity <= 5;
            case 'out_of_stock':
              return product.stock_quantity === 0;
            default:
              return true;
          }
        });
      }
      
      setProducts(filteredProducts);
      setTotalProducts(data?.pagination?.total || filteredProducts.length);
    } catch (err) {
      setError('Error loading products');
      console.error('Error loading products:', err);
      // Set empty arrays on error to prevent crashes
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchTerm, filterCategory, filterStatus]);

  const loadCategories = useCallback(async () => {
    try {
      // Use public API directly since admin categories endpoint doesn't exist
      const response = await publicAPI.getCategories();
      console.log('Categories response:', response.data); // Debug log
      const categoriesData = response.data?.data || [];
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (err) {
      console.error('Error loading categories:', err);
      setCategories([]);
    }
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const response = await adminAPI.getProductStats();
      setStats(response.data);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    loadCategories();
    loadStats();
  }, [loadCategories, loadStats]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      // Convert existing images to UploadedImage format
      const images: UploadedImage[] = product.images ? product.images.map(img => {
        // Handle both string URLs and object with image_url property
        const imageUrl = typeof img === 'string' ? img : (img.image_url || '');
        console.log('Original image URL:', imageUrl); // Debug log
        
        // If the image URL starts with /uploads/, prepend the backend URL
        const fullUrl = imageUrl.startsWith('/uploads/') 
          ? `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}${imageUrl}`
          : imageUrl;
        
        console.log('Full image URL:', fullUrl); // Debug log
        
        return {
          url: fullUrl,
          filename: imageUrl ? imageUrl.split('/').pop() || 'image' : 'image',
          size: 0,
          type: imageUrl.startsWith('/uploads/') ? 'image/uploaded' : 'image/url',
        };
      }) : [];
      
      console.log('Converted images:', images); // Debug log
      
      console.log('Editing product:', product); // Debug log
      console.log('Product category:', product.category); // Debug log
      console.log('Product category_id:', product.category_id); // Debug log
      
      setFormData({
        name: product.name,
        description: product.description,
        short_description: product.short_description || '',
        price: product.price || 0,
        category_id: product.category_id || product.category?.id || '',
        brand: product.brand || '',
        stock_quantity: product.stock_quantity || 0,
        sku: product.sku,
        image_url: product.image_url || '',
        images: images,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        short_description: '',
        price: 0,
        category_id: '',
        brand: '',
        stock_quantity: 0,
        sku: '',
        image_url: '',
        images: [],
      });
    }
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: Partial<ProductFormData> = {};
    
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.price || formData.price <= 0) errors.price = 'Price must be greater than 0';
    if (!formData.category_id) errors.category_id = 'Please select a category';
    if (formData.stock_quantity < 0) errors.stock_quantity = 'Quantity cannot be negative';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      setSubmitting(true);
      
      // Prepare form data with proper types
      const submitData = {
        ...formData,
        category_id: formData.category_id, // Keep as string (UUID)
        price: Number(formData.price),
        stock_quantity: Number(formData.stock_quantity),
        // Convert UploadedImage objects to URL strings (only if images exist)
        images: formData.images && formData.images.length > 0 ? formData.images.map(img => img.url) : [],
      };
      
      console.log('Submitting product data:', submitData); // Debug log
      console.log('Form images before conversion:', formData.images); // Debug log
      console.log('Category ID being sent:', formData.category_id, typeof formData.category_id); // Debug log
      
      if (editingProduct) {
        await adminAPI.updateProduct(editingProduct.id.toString(), submitData);
      } else {
        await adminAPI.createProduct(submitData);
      }
      
      handleCloseDialog();
      loadProducts();
      loadStats();
    } catch (err) {
      setError(`Error ${editingProduct ? 'updating' : 'creating'} product`);
      console.error('Error submitting product:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (product: Product, type: 'active' | 'featured') => {
    try {
      // Only send the specific field that needs to be updated
      const updateData = {
        name: product.name,
        description: product.description,
        short_description: product.short_description,
        price: product.price,
        category_id: product.category_id || product.category?.id,
        brand: product.brand,
        stock_quantity: product.stock_quantity,
        sku: product.sku,
        image_url: product.image_url,
        images: product.images || [],
        is_active: type === 'active' ? !product.is_active : product.is_active,
        is_featured: type === 'featured' ? !product.is_featured : product.is_featured,
      };
      
      console.log('Toggle status update data:', updateData); // Debug log
      
      await adminAPI.updateProduct(product.id.toString(), updateData);
      loadProducts();
      loadStats();
    } catch (err) {
      setError(`Error updating product ${type} status`);
      console.error(`Error updating product ${type} status:`, err);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!window.confirm(`Are you sure you want to delete product "${product.name}"?`)) {
      return;
    }
    
    try {
      await adminAPI.deleteProduct(product.id.toString());
      loadProducts();
      loadStats();
    } catch (err) {
      setError('Error deleting product');
      console.error('Error deleting product:', err);
    }
  };

  const formatPrice = (price: number | undefined | null) => {
    if (price == null || isNaN(Number(price))) {
      return '$0.00';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Number(price));
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { label: 'Out of Stock', color: 'error' as const };
    if (quantity <= 5) return { label: 'Low Stock', color: 'warning' as const };
    return { label: 'In Stock', color: 'success' as const };
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Product Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Product
        </Button>
      </Box>

      {/* Stats Cards */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ textAlign: 'center', p: 1 }}>
              <CardContent sx={{ pb: '16px !important' }}>
                <Typography color="textSecondary" gutterBottom sx={{ fontSize: '0.875rem' }}>
                  Total Products
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {stats.total_products}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ textAlign: 'center', p: 1 }}>
              <CardContent sx={{ pb: '16px !important' }}>
                <Typography color="textSecondary" gutterBottom sx={{ fontSize: '0.875rem' }}>
                  Active Products
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                  {stats.active_products}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ textAlign: 'center', p: 1 }}>
              <CardContent sx={{ pb: '16px !important' }}>
                <Typography color="textSecondary" gutterBottom sx={{ fontSize: '0.875rem' }}>
                  Out of Stock
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                  {stats.out_of_stock}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ textAlign: 'center', p: 1 }}>
              <CardContent sx={{ pb: '16px !important' }}>
                <Typography color="textSecondary" gutterBottom sx={{ fontSize: '0.875rem' }}>
                  Low Stock
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                  {products.filter(p => p.stock_quantity > 0 && p.stock_quantity <= 5).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card sx={{ textAlign: 'center', p: 1 }}>
              <CardContent sx={{ pb: '16px !important' }}>
                <Typography color="textSecondary" gutterBottom sx={{ fontSize: '0.875rem' }}>
                  Total Value
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                  {formatPrice(stats.total_value || 0)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Filters and Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search products..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                    <StatsIcon color="action" />
                  </Box>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter by Category</InputLabel>
              <Select
                value={filterCategory}
                label="Filter by Category"
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Filter by Status</InputLabel>
              <Select
                value={filterStatus}
                label="Filter by Status"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="in_stock">In Stock</MenuItem>
                <MenuItem value="low_stock">Low Stock</MenuItem>
                <MenuItem value="out_of_stock">Out of Stock</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setSearchTerm('');
                setFilterCategory('');
                setFilterStatus('');
              }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Products Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Brand</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Stock Status</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>Featured</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No products found
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => {
                  const stockStatus = getStockStatus(product.stock_quantity);
                  return (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="subtitle2">{product.name}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            SKU: {product.sku}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {product.category?.name || 'Not specified'}
                      </TableCell>
                      <TableCell>{product.brand || '-'}</TableCell>
                      <TableCell>{formatPrice(product.price)}</TableCell>
                      <TableCell>{product.stock_quantity}</TableCell>
                      <TableCell>
                        <Chip
                          label={stockStatus.label}
                          color={stockStatus.color}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={product.is_active ? 'Yes' : 'No'}
                          color={product.is_active ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={product.is_featured ? 'Yes' : 'No'}
                          color={product.is_featured ? 'warning' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog(product)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={product.is_active ? "Deactivate" : "Activate"}>
                            <IconButton
                              size="small"
                              color={product.is_active ? "success" : "default"}
                              onClick={() => handleToggleStatus(product, 'active')}
                            >
                              <StatsIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={product.is_featured ? "Remove from Featured" : "Add to Featured"}>
                            <IconButton
                              size="small"
                              color={product.is_featured ? "warning" : "default"}
                              onClick={() => handleToggleStatus(product, 'featured')}
                            >
                              <WarningIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(product)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalProducts}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* Product Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingProduct ? 'Edit Product' : 'Add Product'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Product Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={!!formErrors.name}
                helperText={formErrors.name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                error={!!formErrors.brand}
                helperText={formErrors.brand}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                error={!!formErrors.description}
                helperText={formErrors.description}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Short Description"
                multiline
                rows={2}
                value={formData.short_description}
                onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                error={!!formErrors.short_description}
                helperText={formErrors.short_description || "Brief description for product card"}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!formErrors.category_id}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category_id || ''}
                  label="Category"
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={formData.price || ''}
                onChange={(e) => {
                  const value = e.target.value === '' ? 0 : Number(e.target.value);
                  setFormData({ ...formData, price: isNaN(value) ? 0 : value });
                }}
                error={!!formErrors.price}
                helperText={formErrors.price}
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Stock Quantity"
                type="number"
                value={formData.stock_quantity || ''}
                onChange={(e) => {
                  const value = e.target.value === '' ? 0 : Number(e.target.value);
                  setFormData({ ...formData, stock_quantity: isNaN(value) ? 0 : value });
                }}
                error={!!formErrors.stock_quantity}
                helperText={formErrors.stock_quantity}
                inputProps={{ min: 0, step: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="SKU"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                error={!!formErrors.sku}
                helperText={formErrors.sku}
                placeholder="Leave empty for auto-generation"
              />
            </Grid>
            <Grid item xs={12}>
              <ImageUpload
                images={formData.images}
                onImagesChange={(images) => setFormData({ ...formData, images })}
                maxImages={10}
                maxSize={5}
                label="Product Images"
                multiple={true}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Main Image URL"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                error={!!formErrors.image_url}
                helperText={formErrors.image_url || "Additional field for main image URL"}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={20} /> : editingProduct ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProductManagePage; 