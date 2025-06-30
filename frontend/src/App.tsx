import React, { useEffect } from 'react';
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
// Components
import Header from './components/Header';
import Footer from './components/Footer';
import NotificationProvider from './components/NotificationProvider';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import OffersPage from './pages/OffersPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AuthPage from './pages/AuthPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import RefundPolicyPage from './pages/RefundPolicyPage';
import ShippingPolicyPage from './pages/ShippingPolicyPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactPage from './pages/ContactPage';
import HelpCenterPage from './pages/HelpCenterPage';
import AdminRoute from './components/AdminRoute';
import AdminDashboard from './features/admin/pages/AdminDashboard';
import AnalyticsPage from './features/admin/pages/AnalyticsPage';
import UserListPage from './features/admin/pages/UserListPage';
import ProductListPage from './features/admin/pages/ProductListPage';
import ProductManagePage from './features/admin/pages/ProductManagePage';
import CategoryManagePage from './features/admin/pages/CategoryManagePage';
import OrderListPage from './features/admin/pages/OrderListPage';
import OfferManagePage from './features/admin/pages/OfferManagePage';
import CouponManagePage from './features/admin/pages/CouponManagePage';
import SettingsPage from './features/admin/pages/SettingsPage';

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
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    } />
                    <Route path="/admin/analytics" element={
                      <AdminRoute>
                        <AnalyticsPage />
                      </AdminRoute>
                    } />
                    <Route path="/admin/users" element={
                      <AdminRoute>
                        <UserListPage />
                      </AdminRoute>
                    } />
                    <Route path="/admin/products" element={
                      <AdminRoute>
                        <ProductListPage />
                      </AdminRoute>
                    } />
                    <Route path="/admin/products/manage" element={
                      <AdminRoute>
                        <ProductManagePage />
                      </AdminRoute>
                    } />
                    <Route path="/admin/categories" element={
                      <AdminRoute>
                        <CategoryManagePage />
                      </AdminRoute>
                    } />
                    <Route path="/admin/orders" element={
                      <AdminRoute>
                        <OrderListPage />
                      </AdminRoute>
                    } />
                    <Route path="/admin/offers" element={
                      <AdminRoute>
                        <OfferManagePage />
                      </AdminRoute>
                    } />
                    <Route path="/admin/coupons" element={
                      <AdminRoute>
                        <CouponManagePage />
                      </AdminRoute>
                    } />
                    <Route path="/admin/settings" element={
                      <AdminRoute>
                        <SettingsPage />
                      </AdminRoute>
                    } />
                    
                    {/* Public Routes - With Header/Footer */}
                    <Route path="/*" element={
                      <>
                        <Header />
                        <main className="main-content">
                          <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/products" element={<ProductsPage />} />
                            <Route path="/products/:slug" element={<ProductDetailPage />} />
                            <Route path="/offers" element={<OffersPage />} />
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/checkout" element={<CheckoutPage />} />
                            <Route path="/auth" element={<AuthPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                            <Route path="/refund-policy" element={<RefundPolicyPage />} />
                            <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
                            <Route path="/cookie-policy" element={<CookiePolicyPage />} />
                            <Route path="/about-us" element={<AboutUsPage />} />
                            <Route path="/contact" element={<ContactPage />} />
                            <Route path="/help-center" element={<HelpCenterPage />} />
                          </Routes>
                        </main>
                        <Footer />
                      </>
                    } />
                  </Routes>
                </div>
                <NotificationProvider />
                <PWAInstallPrompt />
              </Router>
            </ToastProvider>
          </ThemeProvider>
        </HelmetProvider>
      </QueryClientProvider>
    </Provider>
  );
}

export default App; 