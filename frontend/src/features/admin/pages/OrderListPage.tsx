import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Search } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { adminAPI } from '../../../lib/api';
import AdminLayout from '../components/AdminLayout';

interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: string;
  total_amount: number;
  payment_status: string;
  payment_method: string;
  shipping_method: string;
  created_at: string;
  updated_at: string;
}

const OrderListPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Fetch orders
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ['admin-orders', searchTerm, statusFilter],
    queryFn: () => adminAPI.getOrders({ 
      search: searchTerm, 
      status: statusFilter || undefined,
      limit: 100 
    }),
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'shipped': return 'primary';
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      case 'refunded': return 'default';
      default: return 'default';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'paid': return 'success';
      case 'failed': return 'error';
      case 'refunded': return 'default';
      default: return 'default';
    }
  };

  const columns: GridColDef[] = [
    { field: 'order_number', headerName: 'Order #', width: 120 },
    { field: 'user_id', headerName: 'Customer ID', width: 150 },
    { 
      field: 'status', 
      headerName: 'Status', 
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value) as any}
          size="small"
        />
      ),
    },
    { 
      field: 'total_amount', 
      headerName: 'Total', 
      width: 100,
      renderCell: (params) => `$${params.value?.toFixed(2) || '0.00'}`,
    },
    { 
      field: 'payment_status', 
      headerName: 'Payment', 
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getPaymentStatusColor(params.value) as any}
          size="small"
        />
      ),
    },
    { field: 'payment_method', headerName: 'Payment Method', width: 140 },
    { field: 'shipping_method', headerName: 'Shipping', width: 120 },
    { 
      field: 'created_at', 
      headerName: 'Created', 
      width: 120,
      renderCell: (params) => new Date(params.value).toLocaleDateString(),
    },
    { 
      field: 'updated_at', 
      headerName: 'Updated', 
      width: 120,
      renderCell: (params) => new Date(params.value).toLocaleDateString(),
    },
  ];

  const orders = ordersData?.data?.data || [];

  return (
    <AdminLayout>
      <Box>
        <Typography variant="h4" gutterBottom>
          Order Management
        </Typography>
        
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <TextField
              placeholder="Search orders..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{ flexGrow: 1 }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="processing">Processing</MenuItem>
                <MenuItem value="shipped">Shipped</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
                <MenuItem value="refunded">Refunded</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Paper>

        <Paper sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={orders}
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

export default OrderListPage; 