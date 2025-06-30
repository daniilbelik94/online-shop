import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Slider,
  Button,
  IconButton,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Drawer,
  Divider,
  Badge,
  Breadcrumbs,
  Skeleton,
  Fab,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Tune as TuneIcon,
  GridView as GridViewIcon,
  ViewList as ListViewIcon,
  Sort as SortIcon,
  Home as HomeIcon,
  Category as CategoryIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useQueryClient } from '@tanstack/react-query';
import { AppDispatch } from '../store';
import { addToCart } from '../store/slices/cartSlice';
import { fetchWishlist } from '../store/slices/wishlistSlice';
import { selectIsAuthenticated } from '../store/slices/authSlice';
import { Product, Category, ProductsResponse } from '../lib/api';
import ProductCard from '../components/ProductCard';
import { useProducts, useCategories, useAddToCart, queryKeys } from '../hooks/useApi';
import { LoadingSpinner, ErrorState, EmptyState, ProductSkeleton } from '../components/LoadingStates';

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const queryClient = useQueryClient();
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedBrand, setBrand] = useState(searchParams.get('brand') || '');
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'created_at_desc');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);

  // React Query hooks
  const { data: productsData, isLoading: productsLoading, error: productsError } = useProducts({
    page: currentPage,
    limit: 12,
    search: searchQuery || undefined,
    category: selectedCategory || undefined,
    sort: sortBy,
  });

  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();
  const addToCartMutation = useAddToCart();

  // Debug logging
  console.log('ProductsPage Debug:', {
    searchQuery,
    selectedCategory,
    sortBy,
    currentPage,
    productsData,
    productsLoading,
    productsError,
    productsCount: productsData?.data?.length || 0
  });

  // Extract data from React Query responses
  const products = productsData?.data || [];
  const pagination = productsData?.pagination || {
    current_page: 1,
    per_page: 12,
    total: 0,
    total_pages: 0,
  };
  const categories = categoriesData?.data || [];

  // Load wishlist when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [isAuthenticated, dispatch]);

  // Extract unique brands from products
  useEffect(() => {
    const brandsSet = new Set(products.map((p: Product) => p.brand).filter(Boolean));
    const brands = Array.from(brandsSet) as string[];
    setAvailableBrands(brands);
  }, [products]);

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedBrand) params.set('brand', selectedBrand);
    if (sortBy !== 'created_at_desc') params.set('sort', sortBy);
    
    setSearchParams(params);
  }, [searchQuery, selectedCategory, selectedBrand, sortBy, setSearchParams]);

  // Update state when URL params change (only on mount or when URL changes externally)
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    const urlCategory = searchParams.get('category') || '';
    const urlBrand = searchParams.get('brand') || '';
    const urlSort = searchParams.get('sort') || 'created_at_desc';
    
    console.log('ProductsPage URL params changed:', {
      urlSearch,
      urlCategory,
      urlBrand,
      urlSort,
      currentSearchQuery: searchQuery,
      currentSelectedCategory: selectedCategory
    });
    
    setSearchQuery(urlSearch);
    setSelectedCategory(urlCategory);
    setBrand(urlBrand);
    setSortBy(urlSort);
  }, [searchParams]);

  // Принудительно обновить кэш при изменении фильтров
  useEffect(() => {
    console.log('Filters changed, invalidating cache:', {
      searchQuery,
      selectedCategory,
      selectedBrand,
      sortBy,
      currentPage
    });
    queryClient.invalidateQueries({ queryKey: queryKeys.products });
  }, [searchQuery, selectedCategory, selectedBrand, sortBy, currentPage, queryClient]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
    queryClient.invalidateQueries({ queryKey: queryKeys.products });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    queryClient.invalidateQueries({ queryKey: queryKeys.products });
    if (isMobile) setMobileFiltersOpen(false);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setBrand('');
    setPriceRange([0, 1000]);
    setSortBy('created_at_desc');
    queryClient.invalidateQueries({ queryKey: queryKeys.products });
    if (isMobile) setMobileFiltersOpen(false);
  };

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCartMutation.mutateAsync({ productId: product.id.toString(), quantity: 1 });
    } catch (error) {
      console.error('Failed to add to cart:', error);
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

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchQuery) count++;
    if (selectedCategory) count++;
    if (selectedBrand) count++;
    if (priceRange[0] > 0 || priceRange[1] < 1000) count++;
    return count;
  };

  const FiltersContent = () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TuneIcon />
        Filters
        {getActiveFiltersCount() > 0 && (
          <Chip 
            label={getActiveFiltersCount()} 
            color="primary" 
            size="small"
            sx={{ ml: 1 }}
          />
        )}
      </Typography>

      <Box sx={{ mb: 3 }}>
        <form onSubmit={handleSearchSubmit}>
          <TextField
            fullWidth
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              queryClient.invalidateQueries({ queryKey: queryKeys.products });
            }}
            InputProps={{
              endAdornment: (
                <IconButton type="submit" sx={{ borderRadius: 2 }}>
                  <SearchIcon />
                </IconButton>
              ),
            }}
            sx={{ 
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
        </form>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
          Category
        </Typography>
        <FormControl fullWidth>
          <Select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              queryClient.invalidateQueries({ queryKey: queryKeys.products });
            }}
            displayEmpty
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((category: Category) => (
              <MenuItem key={category.id} value={category.slug}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {availableBrands.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Brand
          </Typography>
          <FormControl fullWidth>
            <Select
              value={selectedBrand}
              onChange={(e) => {
                setBrand(e.target.value);
                queryClient.invalidateQueries({ queryKey: queryKeys.products });
              }}
              displayEmpty
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="">All Brands</MenuItem>
              {availableBrands.map((brand) => (
                <MenuItem key={brand} value={brand}>
                  {brand}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
          Price Range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
        </Typography>
        <Slider
          value={priceRange}
          onChange={(_, newValue) => setPriceRange(newValue as number[])}
          valueLabelDisplay="auto"
          min={0}
          max={1000}
          step={10}
          valueLabelFormat={(value) => formatPrice(value)}
          sx={{ mt: 2 }}
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
          Sort By
        </Typography>
        <FormControl fullWidth>
          <Select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              queryClient.invalidateQueries({ queryKey: queryKeys.products });
            }}
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="created_at_desc">Newest First</MenuItem>
            <MenuItem value="created_at_asc">Oldest First</MenuItem>
            <MenuItem value="price_asc">Price: Low to High</MenuItem>
            <MenuItem value="price_desc">Price: High to Low</MenuItem>
            <MenuItem value="name_asc">Name: A to Z</MenuItem>
            <MenuItem value="name_desc">Name: Z to A</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Button
        variant="outlined"
        fullWidth
        startIcon={<ClearIcon />}
        onClick={clearFilters}
        disabled={getActiveFiltersCount() === 0}
        sx={{ borderRadius: 2 }}
      >
        Clear All Filters
      </Button>
    </Box>
  );

  if (productsError) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <ErrorState 
          error={productsError} 
          onRetry={() => setCurrentPage(1)}
          title="Failed to load products"
        />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 4 } }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          to="/"
          style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 4 }}
        >
          <HomeIcon fontSize="small" />
          Home
        </Link>
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <CategoryIcon fontSize="small" />
          Products
          {selectedCategory && (
            <>
              <span style={{ margin: '0 4px' }}>→</span>
              {categories.find((c: Category) => c.slug === selectedCategory)?.name || selectedCategory}
            </>
          )}
        </Typography>
      </Breadcrumbs>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant={isMobile ? "h4" : "h3"} component="h1" gutterBottom fontWeight="bold">
          🛍️ Our Products
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          {productsLoading ? 'Loading...' : `Showing ${products.length} of ${pagination.total} products`}
        </Typography>
      </Box>

      {/* Active Filters */}
      {getActiveFiltersCount() > 0 && (
        <Box sx={{ mb: 3 }}>
          <Paper sx={{ p: 2, borderRadius: 3, bgcolor: 'grey.50' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography variant="body2" fontWeight="bold">Active Filters:</Typography>
              {searchQuery && (
                <Chip
                  label={`Search: ${searchQuery}`}
                  onDelete={() => {
                    setSearchQuery('');
                    queryClient.invalidateQueries({ queryKey: queryKeys.products });
                  }}
                  size="small"
                  variant="outlined"
                />
              )}
              {selectedCategory && (
                <Chip
                  label={categories.find((c: Category) => c.slug === selectedCategory)?.name || selectedCategory}
                  onDelete={() => {
                    setSelectedCategory('');
                    queryClient.invalidateQueries({ queryKey: queryKeys.products });
                  }}
                  size="small"
                  variant="outlined"
                />
              )}
              {selectedBrand && (
                <Chip
                  label={selectedBrand}
                  onDelete={() => {
                    setBrand('');
                    queryClient.invalidateQueries({ queryKey: queryKeys.products });
                  }}
                  size="small"
                  variant="outlined"
                />
              )}
              {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                <Chip
                  label={`Price: ${formatPrice(priceRange[0])} - ${formatPrice(priceRange[1])}`}
                  onDelete={() => {
                    setPriceRange([0, 1000]);
                    queryClient.invalidateQueries({ queryKey: queryKeys.products });
                  }}
                  size="small"
                  variant="outlined"
                />
              )}
              <Button
                size="small"
                startIcon={<ClearIcon />}
                onClick={clearFilters}
                sx={{ ml: 'auto' }}
              >
                Clear All
              </Button>
            </Box>
          </Paper>
        </Box>
      )}

      <Grid container spacing={3}>
        {/* Desktop Filters */}
        {!isMobile && (
          <Grid item xs={12} md={3}>
            <Paper sx={{ borderRadius: 3, position: 'sticky', top: 20 }}>
              <FiltersContent />
            </Paper>
          </Grid>
        )}

        {/* Products Grid */}
        <Grid item xs={12} md={isMobile ? 12 : 9}>
          {/* Toolbar */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 3,
            flexWrap: 'wrap',
            gap: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {isMobile && (
                <Badge badgeContent={getActiveFiltersCount()} color="primary">
                  <Button
                    variant="outlined"
                    startIcon={<FilterIcon />}
                    onClick={() => setMobileFiltersOpen(true)}
                    sx={{ borderRadius: 2 }}
                  >
                    Filters
                  </Button>
                </Badge>
              )}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ minWidth: 'fit-content' }}>
                {pagination.total} items
              </Typography>
              
              <Divider orientation="vertical" flexItem />
              
              <Tooltip title="Grid View">
                <IconButton
                  onClick={() => setViewMode('grid')}
                  color={viewMode === 'grid' ? 'primary' : 'default'}
                  size="small"
                >
                  <GridViewIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="List View">
                <IconButton
                  onClick={() => setViewMode('list')}
                  color={viewMode === 'list' ? 'primary' : 'default'}
                  size="small"
                >
                  <ListViewIcon />
                </IconButton>
              </Tooltip>

              <Button
                variant="outlined"
                size="small"
                startIcon={<RefreshIcon />}
                onClick={() => setCurrentPage(pagination.current_page)}
                disabled={productsLoading}
                sx={{ borderRadius: 2, ml: 1 }}
              >
                Refresh
              </Button>
            </Box>
          </Box>

          {/* Products Grid/List */}
          {productsLoading ? (
            <ProductSkeleton count={8} viewMode={viewMode} />
          ) : products.length === 0 ? (
            <EmptyState
              title="No products found"
              message="We couldn't find any products matching your criteria. Try adjusting your filters or search terms."
              icon={<SearchIcon sx={{ fontSize: 64, opacity: 0.5 }} />}
              action={
                <Button
                  variant="contained"
                  startIcon={<ClearIcon />}
                  onClick={clearFilters}
                  sx={{ 
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                    }
                  }}
                >
                  Clear All Filters
                </Button>
              }
            />
          ) : (
            <>
              {viewMode === 'grid' ? (
                <Grid container spacing={3}>
                  {products.map((product: Product) => (
                    <Grid 
                      item 
                      xs={12} 
                      sm={6} 
                      md={4} 
                      key={product.id}
                    >
                      <ProductCard 
                        product={product} 
                        viewMode="grid"
                        onAddToCart={handleAddToCart}
                      />
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box>
                  {products.map((product: Product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      viewMode="list"
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </Box>
              )}

              {/* Pagination */}
              {pagination.total_pages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                  <Paper sx={{ p: 2, borderRadius: 3 }}>
                    <Pagination
                      count={pagination.total_pages}
                      page={currentPage}
                      onChange={handlePageChange}
                      color="primary"
                      size={isMobile ? "small" : "medium"}
                      siblingCount={isMobile ? 0 : 1}
                      boundaryCount={1}
                    />
                  </Paper>
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>

      {/* Mobile Filters Drawer */}
      <Drawer
        anchor="bottom"
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        PaperProps={{
          sx: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            maxHeight: '80vh',
          },
        }}
      >
        <Box sx={{ position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1, p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight="bold">
              Filters
            </Typography>
            <Button
              variant="contained"
              onClick={() => setMobileFiltersOpen(false)}
              sx={{ borderRadius: 2 }}
            >
              Apply Filters
            </Button>
          </Box>
        </Box>
        <FiltersContent />
      </Drawer>

      {/* Floating Action Button for mobile filters */}
      {isMobile && !mobileFiltersOpen && (
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 1000,
          }}
          onClick={() => setMobileFiltersOpen(true)}
        >
          <Badge badgeContent={getActiveFiltersCount()} color="secondary">
            <FilterIcon />
          </Badge>
        </Fab>
      )}
    </Container>
  );
};

export default ProductsPage; 