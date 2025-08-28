import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';

import { store } from './store';
import { ToastProvider } from './components/ToastNotifications';
import { registerServiceWorker } from './utils/pwa';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import NotificationProvider from './components/NotificationProvider';
import PerformanceMonitor from './components/PerformanceMonitor';

// Lazy load all page components for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const OffersPage = lazy(() => import('./pages/OffersPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const AuthPage = lazy(() => import('./pages/AuthPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'));
const RefundPolicyPage = lazy(() => import('./pages/RefundPolicyPage'));
const ShippingPolicyPage = lazy(() => import('./pages/ShippingPolicyPage'));
const CookiePolicyPage = lazy(() => import('./pages/CookiePolicyPage'));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const HelpCenterPage = lazy(() => import('./pages/HelpCenterPage'));

// Lazy load admin pages
const AdminRoute = lazy(() => import('./components/AdminRoute'));
const AdminDashboard = lazy(() => import('./features/admin/pages/AdminDashboard'));
const AnalyticsPage = lazy(() => import('./features/admin/pages/AnalyticsPage'));
const UserListPage = lazy(() => import('./features/admin/pages/UserListPage'));
const ProductListPage = lazy(() => import('./features/admin/pages/ProductListPage'));
const ProductManagePage = lazy(() => import('./features/admin/pages/ProductManagePage'));
const CategoryManagePage = lazy(() => import('./features/admin/pages/CategoryManagePage'));
const OrderListPage = lazy(() => import('./features/admin/pages/OrderListPage'));
const OfferManagePage = lazy(() => import('./features/admin/pages/OfferManagePage'));
const CouponManagePage = lazy(() => import('./features/admin/pages/CouponManagePage'));
const SettingsPage = lazy(() => import('./features/admin/pages/SettingsPage'));

// Lazy load layout components
const Header = lazy(() => import('./components/Header'));
const Footer = lazy(() => import('./components/Footer'));

// Loading component for Suspense fallback
const PageLoading = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '200px',
    fontSize: '18px',
    color: '#666'
  }}>
    Loading...
  </div>
);

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 минут
      gcTime: 10 * 60 * 1000, // 10 минут (бывший cacheTime)
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Create Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  useEffect(() => {
    // Register service worker for PWA
    registerServiceWorker();
  }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <ToastProvider>
              <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <div className="App">
                  <Routes>
                    {/* Admin Routes - No Header/Footer */}
                    <Route path="/admin" element={
                      <Suspense fallback={<PageLoading />}>
                        <AdminRoute>
                          <AdminDashboard />
                        </AdminRoute>
                      </Suspense>
                    } />
                    <Route path="/admin/analytics" element={
                      <Suspense fallback={<PageLoading />}>
                        <AdminRoute>
                          <AnalyticsPage />
                        </AdminRoute>
                      </Suspense>
                    } />
                    <Route path="/admin/users" element={
                      <Suspense fallback={<PageLoading />}>
                        <AdminRoute>
                          <UserListPage />
                        </AdminRoute>
                      </Suspense>
                    } />
                    <Route path="/admin/products" element={
                      <Suspense fallback={<PageLoading />}>
                        <AdminRoute>
                          <ProductListPage />
                        </AdminRoute>
                      </Suspense>
                    } />
                    <Route path="/admin/products/manage" element={
                      <Suspense fallback={<PageLoading />}>
                        <AdminRoute>
                          <ProductManagePage />
                        </AdminRoute>
                      </Suspense>
                    } />
                    <Route path="/admin/categories" element={
                      <Suspense fallback={<PageLoading />}>
                        <AdminRoute>
                          <CategoryManagePage />
                        </AdminRoute>
                      </Suspense>
                    } />
                    <Route path="/admin/orders" element={
                      <Suspense fallback={<PageLoading />}>
                        <AdminRoute>
                          <OrderListPage />
                        </AdminRoute>
                      </Suspense>
                    } />
                    <Route path="/admin/offers" element={
                      <Suspense fallback={<PageLoading />}>
                        <AdminRoute>
                          <OfferManagePage />
                        </AdminRoute>
                      </Suspense>
                    } />
                    <Route path="/admin/coupons" element={
                      <Suspense fallback={<PageLoading />}>
                        <AdminRoute>
                          <CouponManagePage />
                        </AdminRoute>
                      </Suspense>
                    } />
                    <Route path="/admin/settings" element={
                      <Suspense fallback={<PageLoading />}>
                        <AdminRoute>
                          <SettingsPage />
                        </AdminRoute>
                      </Suspense>
                    } />
                    
                    {/* Public Routes - With Header/Footer */}
                    <Route path="/*" element={
                      <>
                        <Suspense fallback={<PageLoading />}>
                          <Header />
                        </Suspense>
                        <main className="main-content">
                          <Routes>
                            <Route path="/" element={
                              <Suspense fallback={<PageLoading />}>
                                <HomePage />
                              </Suspense>
                            } />
                            <Route path="/products" element={
                              <Suspense fallback={<PageLoading />}>
                                <ProductsPage />
                              </Suspense>
                            } />
                            <Route path="/products/:slug" element={
                              <Suspense fallback={<PageLoading />}>
                                <ProductDetailPage />
                              </Suspense>
                            } />
                            <Route path="/offers" element={
                              <Suspense fallback={<PageLoading />}>
                                <OffersPage />
                              </Suspense>
                            } />
                            <Route path="/cart" element={
                              <Suspense fallback={<PageLoading />}>
                                <CartPage />
                              </Suspense>
                            } />
                            <Route path="/checkout" element={
                              <Suspense fallback={<PageLoading />}>
                                <CheckoutPage />
                              </Suspense>
                            } />
                            <Route path="/auth" element={
                              <Suspense fallback={<PageLoading />}>
                                <AuthPage />
                              </Suspense>
                            } />
                            <Route path="/login" element={
                              <Suspense fallback={<PageLoading />}>
                                <LoginPage />
                              </Suspense>
                            } />
                            <Route path="/register" element={
                              <Suspense fallback={<PageLoading />}>
                                <RegisterPage />
                              </Suspense>
                            } />
                            <Route path="/profile" element={
                              <Suspense fallback={<PageLoading />}>
                                <ProfilePage />
                              </Suspense>
                            } />
                            <Route path="/privacy-policy" element={
                              <Suspense fallback={<PageLoading />}>
                                <PrivacyPolicyPage />
                              </Suspense>
                            } />
                            <Route path="/terms-of-service" element={
                              <Suspense fallback={<PageLoading />}>
                                <TermsOfServicePage />
                              </Suspense>
                            } />
                            <Route path="/refund-policy" element={
                              <Suspense fallback={<PageLoading />}>
                                <RefundPolicyPage />
                              </Suspense>
                            } />
                            <Route path="/shipping-policy" element={
                              <Suspense fallback={<PageLoading />}>
                                <ShippingPolicyPage />
                              </Suspense>
                            } />
                            <Route path="/cookie-policy" element={
                              <Suspense fallback={<PageLoading />}>
                                <CookiePolicyPage />
                              </Suspense>
                            } />
                            <Route path="/about-us" element={
                              <Suspense fallback={<PageLoading />}>
                                <AboutUsPage />
                              </Suspense>
                            } />
                            <Route path="/contact" element={
                              <Suspense fallback={<PageLoading />}>
                                <ContactPage />
                              </Suspense>
                            } />
                            <Route path="/help-center" element={
                              <Suspense fallback={<PageLoading />}>
                                <HelpCenterPage />
                              </Suspense>
                            } />
                          </Routes>
                        </main>
                        <Suspense fallback={<PageLoading />}>
                          <Footer />
                        </Suspense>
                      </>
                    } />
                  </Routes>
                </div>
                <NotificationProvider />
                <PWAInstallPrompt />
                <PerformanceMonitor />
              </Router>
            </ToastProvider>
          </ThemeProvider>
        </HelmetProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App; 