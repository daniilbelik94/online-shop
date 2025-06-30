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
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Category,
  Folder,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminAPI } from '../../../lib/api';
import AdminLayout from '../components/AdminLayout';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  created_at: string;
  updated_at: string;
  children?: Category[];
  product_count?: number;
}

interface CategoryFormData {
  name: string;
  description: string;
  parent_id: string;
}

const CategoryManagePage: React.FC = () => {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    parent_id: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Fetch categories
  const { data: categories, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      // В реальном приложении здесь будет API вызов
      return [
        {
          id: '1',
          name: 'Smartphones',
          slug: 'smartphones',
          description: 'Mobile phones and accessories',
          parent_id: null,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          product_count: 25,
        },
        {
          id: '2',
          name: 'Laptops',
          slug: 'laptops',
          description: 'Portable computers and accessories',
          parent_id: null,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          product_count: 18,
        },
        {
          id: '3',
          name: 'Accessories',
          slug: 'accessories',
          description: 'Various tech accessories',
          parent_id: null,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          product_count: 45,
        },
        {
          id: '4',
          name: 'iPhone',
          slug: 'iphone',
          description: 'Apple iPhone models',
          parent_id: '1',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          product_count: 12,
        },
        {
          id: '5',
          name: 'Android',
          slug: 'android',
          description: 'Android smartphones',
          parent_id: '1',
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z',
          product_count: 13,
        },
      ] as Category[];
    },
  });

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: (data: CategoryFormData) => adminAPI.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setDialogOpen(false);
      resetForm();
      setSnackbar({ open: true, message: 'Category created successfully', severity: 'success' });
    },
    onError: (error: any) => {
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.error || 'Failed to create category', 
        severity: 'error' 
      });
    },
  });

  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CategoryFormData }) => 
      adminAPI.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setDialogOpen(false);
      setEditingCategory(null);
      resetForm();
      setSnackbar({ open: true, message: 'Category updated successfully', severity: 'success' });
    },
    onError: (error: any) => {
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.error || 'Failed to update category', 
        severity: 'error' 
      });
    },
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => adminAPI.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      setSnackbar({ open: true, message: 'Category deleted successfully', severity: 'success' });
    },
    onError: (error: any) => {
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.error || 'Failed to delete category', 
        severity: 'error' 
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      parent_id: '',
    });
  };

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
        parent_id: category.parent_id || '',
      });
    } else {
      setEditingCategory(null);
      resetForm();
    }
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      setSnackbar({ open: true, message: 'Category name is required', severity: 'error' });
      return;
    }

    if (editingCategory) {
      updateCategoryMutation.mutate({ id: editingCategory.id, data: formData });
    } else {
      createCategoryMutation.mutate(formData);
    }
  };

  const handleDelete = (category: Category) => {
    if (window.confirm(`Are you sure you want to delete "${category.name}"? This action cannot be undone.`)) {
      deleteCategoryMutation.mutate(category.id);
    }
  };

  const getParentCategoryName = (parentId: string | null) => {
    if (!parentId) return 'None';
    const parent = categories?.find(cat => cat.id === parentId);
    return parent?.name || 'Unknown';
  };

  const mainCategories = categories?.filter(cat => !cat.parent_id) || [];
  const subCategories = categories?.filter(cat => cat.parent_id) || [];

  return (
    <AdminLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Category Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Organize your products with categories and subcategories
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Add Category
          </Button>
        </Box>

        {/* Main Categories */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Folder color="primary" />
            Main Categories
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Products</TableCell>
                  <TableCell>Subcategories</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mainCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Category color="primary" />
                        <Typography variant="body1" fontWeight={500}>
                          {category.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {category.description || 'No description'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={category.product_count || 0} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={subCategories.filter(sub => sub.parent_id === category.id).length} 
                        size="small" 
                        color="secondary" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(category.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Edit Category">
                          <IconButton 
                            size="small"
                            onClick={() => handleOpenDialog(category)}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Category">
                          <IconButton 
                            size="small"
                            color="error"
                            onClick={() => handleDelete(category)}
                            disabled={deleteCategoryMutation.isPending}
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

        {/* Subcategories */}
        {subCategories.length > 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Category color="secondary" />
              Subcategories
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Parent Category</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Products</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <Typography variant="body1" fontWeight={500}>
                          {category.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={getParentCategoryName(category.parent_id)} 
                          size="small" 
                          color="info" 
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {category.description || 'No description'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={category.product_count || 0} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(category.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right">
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Edit Category">
                            <IconButton 
                              size="small"
                              onClick={() => handleOpenDialog(category)}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Category">
                            <IconButton 
                              size="small"
                              color="error"
                              onClick={() => handleDelete(category)}
                              disabled={deleteCategoryMutation.isPending}
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

        {/* Category Dialog */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingCategory ? 'Edit Category' : 'Add New Category'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                label="Category Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                fullWidth
                multiline
                rows={3}
              />
              <FormControl fullWidth>
                <InputLabel>Parent Category</InputLabel>
                <Select
                  value={formData.parent_id}
                  onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                  label="Parent Category"
                >
                  <MenuItem value="">None (Main Category)</MenuItem>
                  {mainCategories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained"
              disabled={createCategoryMutation.isPending || updateCategoryMutation.isPending}
            >
              {createCategoryMutation.isPending || updateCategoryMutation.isPending 
                ? 'Saving...' 
                : (editingCategory ? 'Update' : 'Create')
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

export default CategoryManagePage; 