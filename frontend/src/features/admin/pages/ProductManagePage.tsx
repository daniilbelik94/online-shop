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
import { adminAPI, Product, Category, ProductStats } from '../../../lib/api';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category_id: number;
  brand: string;
  stock_quantity: number;
  sku: string;
  image_url: string;
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

  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: 0,
    category_id: 0,
    brand: '',
    stock_quantity: 0,
    sku: '',
    image_url: '',
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
      });
      
      const data = response.data;
      setProducts(data.data);
      setTotalProducts(data.pagination.total);
    } catch (err) {
      setError('Error loading products');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  const loadCategories = useCallback(async () => {
    try {
      const response = await adminAPI.getCategories?.() || { data: [] };
      setCategories(response.data || []);
    } catch (err) {
      console.error('Error loading categories:', err);
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
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category_id: product.category_id,
        brand: product.brand || '',
        stock_quantity: product.stock_quantity,
        sku: product.sku,
        image_url: product.image_url || '',
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        category_id: 0,
        brand: '',
        stock_quantity: 0,
        sku: '',
        image_url: '',
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
    if (formData.price <= 0) errors.price = 'Price must be greater than 0';
    if (!formData.category_id) errors.category_id = 'Please select a category';
    if (formData.stock_quantity < 0) errors.stock_quantity = 'Quantity cannot be negative';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      setSubmitting(true);
      
      if (editingProduct) {
        await adminAPI.updateProduct(editingProduct.id.toString(), formData);
      } else {
        await adminAPI.createProduct(formData);
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
    }).format(price);
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
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Products
                </Typography>
                <Typography variant="h4">
                  {stats.total_products}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Active Products
                </Typography>
                <Typography variant="h4">
                  {stats.active_products}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Нет в наличии
                </Typography>
                <Typography variant="h4" color="error">
                  {stats.out_of_stock}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Общая стоимость
                </Typography>
                <Typography variant="h4">
                  {formatPrice(stats.total_value)}
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

      {/* Products Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Название</TableCell>
                <TableCell>Категория</TableCell>
                <TableCell>Бренд</TableCell>
                <TableCell>Цена</TableCell>
                <TableCell>Склад</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Товары не найдены
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
                        {product.category?.name || 'Не указана'}
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
                        <Tooltip title="Редактировать">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(product)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Удалить">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(product)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
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
          {editingProduct ? 'Редактировать товар' : 'Добавить товар'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Название"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                error={!!formErrors.name}
                helperText={formErrors.name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Бренд"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                error={!!formErrors.brand}
                helperText={formErrors.brand}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Описание"
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                error={!!formErrors.description}
                helperText={formErrors.description}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth error={!!formErrors.category_id}>
                <InputLabel>Категория</InputLabel>
                <Select
                  value={formData.category_id}
                  label="Категория"
                  onChange={(e) => setFormData({ ...formData, category_id: Number(e.target.value) })}
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
                label="Цена"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                error={!!formErrors.price}
                helperText={formErrors.price}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Количество на складе"
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: Number(e.target.value) })}
                error={!!formErrors.stock_quantity}
                helperText={formErrors.stock_quantity}
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
                placeholder="Оставьте пустым для автогенерации"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="URL изображения"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                error={!!formErrors.image_url}
                helperText={formErrors.image_url}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting}
          >
            {submitting ? <CircularProgress size={20} /> : editingProduct ? 'Обновить' : 'Создать'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProductManagePage; 