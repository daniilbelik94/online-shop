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
  Collapse,
  IconButton,
  useMediaQuery,
  useTheme,
  Card,
  CardContent,
  Drawer,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Tune as TuneIcon,
} from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { addToCart } from '../store/slices/cartSlice';
import { publicAPI, Product, Category, ProductsResponse } from '../lib/api';
import ProductCard from '../components/ProductCard';

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const dispatch = useDispatch<AppDispatch>();
  
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
  const [priceRange, setPriceRange] = useState<number[]>([0, 100000]);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'created_at_desc');
  const [showFilters, setShowFilters] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Available brands (will be populated from products)
  const [availableBrands, setAvailableBrands] = useState<string[]>([]);

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
        ...(priceRange[1] < 100000 && { max_price: priceRange[1] }),
        sort: sortBy,
      };

      const response = await publicAPI.getProducts(params);
      const data: ProductsResponse = response.data;

      setProducts(data.data);
      setPagination(data.pagination);

      // Extract unique brands from products
      const brandsSet = new Set(data.data.map(p => p.brand).filter(Boolean));
      const brands = Array.from(brandsSet) as string[];
      setAvailableBrands(brands);

    } catch (err) {
      setError('Error loading products');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategory, selectedBrand, priceRange, sortBy, pagination.per_page]);

  const loadCategories = useCallback(async () => {
    try {
      const response = await publicAPI.getCategories();
      setCategories(response.data?.data || response.data || []);
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
    setPriceRange([0, 100000]);
    setSortBy('created_at_desc');
    if (isMobile) setMobileFiltersOpen(false);
  };

  const handleAddToCart = async (product: Product) => {
    try {
      await dispatch(addToCart({ productId: product.id.toString(), quantity: 1 })).unwrap();
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to add to cart:', error);
      // You could show an error message here
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

  const FiltersContent = () => (
    <Box sx={{ p: isMobile ? 2 : 0 }}>
      <Grid container spacing={2}>
        {/* Mobile Search - only show in mobile drawer */}
        {isMobile && (
          <Grid item xs={12}>
            <form onSubmit={handleSearchSubmit}>
              <TextField
                fullWidth
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                sx={{ mb: 2 }}
              />
              <Button
                fullWidth
                variant="contained"
                type="submit"
                sx={{ mb: 2 }}
              >
                Search
              </Button>
            </form>
            <Divider sx={{ mb: 2 }} />
          </Grid>
        )}

        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size={isMobile ? "medium" : "small"}>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              label="Category"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.slug}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size={isMobile ? "medium" : "small"}>
            <InputLabel>Brand</InputLabel>
            <Select
              value={selectedBrand}
              label="Brand"
              onChange={(e) => setBrand(e.target.value)}
            >
              <MenuItem value="">All Brands</MenuItem>
              {availableBrands.map((brand) => (
                <MenuItem key={brand} value={brand}>
                  {brand}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth size={isMobile ? "medium" : "small"}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="created_at_desc">Newest</MenuItem>
              <MenuItem value="created_at_asc">Oldest</MenuItem>
              <MenuItem value="price_asc">Price: Low to High</MenuItem>
              <MenuItem value="price_desc">Price: High to Low</MenuItem>
              <MenuItem value="name_asc">Name: A-Z</MenuItem>
              <MenuItem value="name_desc">Name: Z-A</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ px: 2 }}>
            <Typography gutterBottom variant={isMobile ? "body1" : "body2"}>
              Price: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
            </Typography>
            <Slider
              value={priceRange}
              onChange={(e, newValue) => setPriceRange(newValue as number[])}
              valueLabelDisplay="auto"
              min={0}
              max={100000}
              step={1000}
              valueLabelFormat={formatPrice}
              sx={{ mt: 1 }}
            />
          </Box>
        </Grid>
      </Grid>
      
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
        <Box>
          {(searchQuery || selectedCategory || selectedBrand || priceRange[0] > 0 || priceRange[1] < 100000) && (
            <Button
              startIcon={<ClearIcon />}
              onClick={clearFilters}
              variant="outlined"
              size="small"
            >
              Clear Filters
            </Button>
          )}
        </Box>
        <Typography variant="body2" color="text.secondary">
          Products found: {pagination.total}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 4 } }}>
      <Typography 
        variant={isMobile ? "h4" : "h3"} 
        component="h1" 
        gutterBottom
        sx={{ mb: { xs: 2, sm: 3 } }}
      >
        Product Catalog
      </Typography>

      {/* Desktop Search and Filters */}
      {!isMobile && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <form onSubmit={handleSearchSubmit}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
              <TextField
                fullWidth
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
              <Button
                variant="contained"
                type="submit"
                sx={{ minWidth: 120 }}
              >
                Search
              </Button>
              <IconButton
                onClick={() => setShowFilters(!showFilters)}
                color={showFilters ? 'primary' : 'default'}
              >
                <FilterIcon />
              </IconButton>
            </Box>
          </form>

          <Collapse in={showFilters}>
            <Box sx={{ mt: 2 }}>
              <FiltersContent />
            </Box>
          </Collapse>
        </Paper>
      )}

      {/* Mobile Filter Button */}
      {isMobile && (
        <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<TuneIcon />}
            onClick={() => setMobileFiltersOpen(true)}
            fullWidth
          >
            Filters & Search
          </Button>
        </Box>
      )}

      {/* Active Filters */}
      {(searchQuery || selectedCategory || selectedBrand) && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ mb: 1 }}>Active filters:</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {searchQuery && (
              <Chip
                label={`Search: ${searchQuery}`}
                onDelete={() => setSearchQuery('')}
                size="small"
              />
            )}
            {selectedCategory && (
              <Chip
                label={`Category: ${categories.find(c => c.slug === selectedCategory)?.name || selectedCategory}`}
                onDelete={() => setSelectedCategory('')}
                size="small"
              />
            )}
            {selectedBrand && (
              <Chip
                label={`Brand: ${selectedBrand}`}
                onDelete={() => setBrand('')}
                size="small"
              />
            )}
          </Box>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Products Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} />
        </Box>
      ) : products.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No products found
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Try adjusting your search criteria or filters
          </Typography>
          {(searchQuery || selectedCategory || selectedBrand || priceRange[0] > 0 || priceRange[1] < 100000) && (
            <Button
              variant="outlined"
              onClick={clearFilters}
              sx={{ mt: 2 }}
            >
              Clear All Filters
            </Button>
          )}
        </Paper>
      ) : (
        <>
          <Grid container spacing={{ xs: 2, sm: 3 }}>
            {products.map((product) => (
              <Grid 
                item 
                xs={12} 
                sm={6} 
                md={4} 
                lg={3} 
                key={product.id}
              >
                <ProductCard product={product} onAddToCart={handleAddToCart} />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {pagination.total_pages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={pagination.total_pages}
                page={pagination.current_page}
                onChange={handlePageChange}
                color="primary"
                size={isMobile ? "medium" : "large"}
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}

      {/* Mobile Filters Drawer */}
      <Drawer
        anchor="bottom"
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            maxHeight: '90vh',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Filters & Search</Typography>
            <IconButton onClick={() => setMobileFiltersOpen(false)}>
              <ClearIcon />
            </IconButton>
          </Box>
          <FiltersContent />
        </Box>
      </Drawer>
    </Container>
  );
};

export default ProductsPage; 