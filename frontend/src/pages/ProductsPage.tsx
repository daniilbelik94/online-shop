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
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { useSearchParams } from 'react-router-dom';
import { publicAPI, Product, Category, ProductsResponse } from '../lib/api';
import ProductCard from '../components/ProductCard';

const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
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
      setCategories(response.data);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

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
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setBrand('');
    setPriceRange([0, 100000]);
    setSortBy('created_at_desc');
  };

  const handleAddToCart = (product: Product) => {
    // TODO: Implement cart functionality
    console.log('Add to cart:', product);
    alert(`Product "${product.name}" added to cart!`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
    }).format(price);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Product Catalog
      </Typography>

      {/* Search and Filters */}
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
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
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
              <FormControl fullWidth>
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
              <FormControl fullWidth>
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
                <Typography gutterBottom>
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
                />
              </Box>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
        </Collapse>
      </Paper>

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
                label={`Category: ${categories.find(c => c.slug === selectedCategory)?.name}`}
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

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Products Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : products.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
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
                size="large"
              />
            </Box>
          )}
        </>
      ) : (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No products found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Try adjusting your search criteria or clear filters
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default ProductsPage; 