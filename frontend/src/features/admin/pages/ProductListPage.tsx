import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Chip,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Add, Edit, Search } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../../lib/api';
import AdminLayout from '../components/AdminLayout';

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  stock_quantity: number;
  stock_status: string;
  is_active: boolean;
  is_featured: boolean;
  category_id: string;
  brand: string;
  created_at: string;
}

const ProductListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch products
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['admin-products', searchTerm],
    queryFn: () => adminAPI.getProducts({ search: searchTerm, limit: 100 }),
  });

  const handleEditProduct = (productId: string) => {
    navigate(`/admin/products/${productId}/edit`);
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Product Name', width: 200 },
    { field: 'sku', headerName: 'SKU', width: 120 },
    { 
      field: 'price', 
      headerName: 'Price', 
      width: 100,
      renderCell: (params) => `$${params.value?.toFixed(2) || '0.00'}`,
    },
    { 
      field: 'stock_quantity', 
      headerName: 'Stock', 
      width: 100,
      renderCell: (params) => (
        <Box sx={{ color: params.value < 10 ? 'red' : 'inherit' }}>
          {params.value}
        </Box>
      ),
    },
    { 
      field: 'stock_status', 
      headerName: 'Status', 
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'in_stock' ? 'success' : 'error'}
          size="small"
        />
      ),
    },
    { field: 'brand', headerName: 'Brand', width: 120 },
    { 
      field: 'is_active', 
      headerName: 'Active', 
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Yes' : 'No'}
          color={params.value ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    { 
      field: 'is_featured', 
      headerName: 'Featured', 
      width: 100,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Yes' : 'No'}
          color={params.value ? 'primary' : 'default'}
          size="small"
        />
      ),
    },
    { 
      field: 'created_at', 
      headerName: 'Created', 
      width: 120,
      renderCell: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Button
          size="small"
          startIcon={<Edit />}
          onClick={() => handleEditProduct(params.row.id)}
        >
          Edit
        </Button>
      ),
    },
  ];

  const products = productsData?.data?.data || [];

  return (
    <AdminLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            Product Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate('/admin/products/new')}
          >
            Add Product
          </Button>
        </Box>
        
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              placeholder="Search products..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{ flexGrow: 1 }}
            />
          </Box>
        </Paper>

        <Paper sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={products}
            columns={columns}
            loading={isLoading}
            pageSizeOptions={[25, 50, 100]}
            initialState={{
              pagination: { paginationModel: { pageSize: 25 } },
            }}
            disableRowSelectionOnClick
          />
        </Paper>
      </Box>
    </AdminLayout>
  );
};

export default ProductListPage; 