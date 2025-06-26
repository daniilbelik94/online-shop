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
import { AppDispatch } from '../store';
import { addToCart } from '../store/slices/cartSlice';
import { fetchWishlist } from '../store/slices/wishlistSlice';
import { selectIsAuthenticated } from '../store/slices/authSlice';
import { publicAPI, Product, Category, ProductsResponse } from '../lib/api';
import ProductCard from '../components/ProductCard';

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 12,
    total: 0,
    total_pages: 0,
  });

  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedBrand, setBrand] = useState(searchParams.get('brand') || '');
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'created_at_desc');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Available brands
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);

  // Load wishlist when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlist());
    }
  }, [isAuthenticated, dispatch]);

  const loadProducts = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      setError('');

      const params = {
        page,
        limit: pagination.per_page,
        ...(searchQuery && { search: searchQuery }),
        ...(selectedCategory && { category: selectedCategory }),
        ...(selectedBrand && { brand: selectedBrand }),
        ...(priceRange[0] > 0 && { min_price: priceRange[0] }),
        ...(priceRange[1] < 1000 && { max_price: priceRange[1] }),
        sort: sortBy,
      };

      const response = await publicAPI.getProducts(params);
      const data: ProductsResponse = response.data;

      const productsData = data?.data || [];
      const paginationData = data?.pagination || {
        current_page: 1,
        per_page: 12,
        total: 0,
        total_pages: 0,
      };

      setProducts(Array.isArray(productsData) ? productsData : []);
      setPagination(paginationData);

      // Extract unique brands
      const validProducts = Array.isArray(productsData) ? productsData : [];
      const brandsSet = new Set(validProducts.map(p => p.brand).filter(Boolean));
      const brands = Array.from(brandsSet) as string[];
      setAvailableBrands(brands);

    } catch (err) {
      setError('Error loading products');
      console.error('Error loading products:', err);
      setProducts([]);
      setAvailableBrands([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedBrand, priceRange, sortBy, pagination.per_page]);

  const loadCategories = useCallback(async () => {
    try {
      const response = await publicAPI.getCategories();
      const categoriesData = response.data?.data || response.data || [];
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (err) {
      console.error('Error loading categories:', err);
      setCategories([]);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Read URL params on mount
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    const urlCategory = searchParams.get('category') || '';
    const urlBrand = searchParams.get('brand') || '';
    const urlSort = searchParams.get('sort') || 'created_at_desc';
    
    if (urlSearch !== searchQuery) setSearchQuery(urlSearch);
    if (urlCategory !== selectedCategory) setSelectedCategory(urlCategory);
    if (urlBrand !== selectedBrand) setBrand(urlBrand);
    if (urlSort !== sortBy) setSortBy(urlSort);
  }, [searchParams]);

  useEffect(() => {
    loadProducts(1);
  }, [searchQuery, selectedCategory, selectedBrand, priceRange, sortBy]);

  useEffect(() => {
    // Update URL params
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory);
    if (selectedBrand) params.set('brand', selectedBrand);
    if (sortBy !== 'created_at_desc') params.set('sort', sortBy);
    
    setSearchParams(params);
  }, [searchQuery, selectedCategory, selectedBrand, sortBy, setSearchParams]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    loadProducts(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadProducts(1);
    if (isMobile) setMobileFiltersOpen(false);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setBrand('');
    setPriceRange([0, 1000]);
    setSortBy('created_at_desc');
    if (isMobile) setMobileFiltersOpen(false);
  };

  const handleAddToCart = async (product: Product) => {
    try {
      await dispatch(addToCart({ productId: product.id.toString(), quantity: 1 })).unwrap();
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
            onChange={(e) => setSearchQuery(e.target.value)}
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
            onChange={(e) => setSelectedCategory(e.target.value)}
            displayEmpty
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((category) => (
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
              onChange={(e) => setBrand(e.target.value)}
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
            onChange={(e) => setSortBy(e.target.value)}
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

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert 
          severity="error" 
          sx={{ mb: 4, borderRadius: 3 }}
          action={
            <Button color="inherit" size="small" onClick={() => loadProducts(1)}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
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
              {categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}
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
          {loading ? 'Loading...' : `Showing ${products.length} of ${pagination.total} products`}
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
                  onDelete={() => setSearchQuery('')}
                  size="small"
                  variant="outlined"
                />
              )}
              {selectedCategory && (
                <Chip
                  label={categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}
                  onDelete={() => setSelectedCategory('')}
                  size="small"
                  variant="outlined"
                />
              )}
              {selectedBrand && (
                <Chip
                  label={selectedBrand}
                  onDelete={() => setBrand('')}
                  size="small"
                  variant="outlined"
                />
              )}
              {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                <Chip
                  label={`Price: ${formatPrice(priceRange[0])} - ${formatPrice(priceRange[1])}`}
                  onDelete={() => setPriceRange([0, 1000])}
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
                onClick={() => loadProducts(pagination.current_page)}
                disabled={loading}
                sx={{ borderRadius: 2, ml: 1 }}
              >
                Refresh
              </Button>
            </Box>
          </Box>

          {/* Products Grid/List */}
          {loading ? (
            <Grid container spacing={3}>
              {Array.from({ length: 8 }).map((_, index) => (
                <Grid item xs={12} sm={6} md={viewMode === 'grid' ? 4 : 12} key={index}>
                  <Card sx={{ borderRadius: 3, height: viewMode === 'grid' ? 420 : 200 }}>
                    <Skeleton variant="rectangular" height={viewMode === 'grid' ? 240 : 200} />
                    {viewMode === 'grid' && (
                      <CardContent sx={{ height: 180 }}>
                        <Skeleton variant="text" width="60%" height={20} />
                        <Skeleton variant="text" width="80%" height={16} />
                        <Skeleton variant="text" width="40%" height={24} sx={{ mt: 2 }} />
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                          <Skeleton variant="rectangular" width={80} height={12} />
                          <Skeleton variant="text" width="30%" height={12} />
                        </Box>
                      </CardContent>
                    )}
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : products.length === 0 ? (
            <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 3, bgcolor: 'grey.50' }}>
              <Box
                sx={{
                  fontSize: '4rem',
                  mb: 2,
                  opacity: 0.5,
                }}
              >
                🔍
              </Box>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                No products found
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400, mx: 'auto' }}>
                We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
              </Typography>
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
            </Paper>
          ) : (
            <>
              {viewMode === 'grid' ? (
                <Grid container spacing={3}>
                  {products.map((product) => (
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
                  {products.map((product) => (
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
                      page={pagination.current_page}
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