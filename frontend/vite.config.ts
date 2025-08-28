import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    })
  ],
  // Uncomment for GitHub Pages deployment
  // base: '/online-shop/',
  server: {
    host: true,
    port: 5173,
    strictPort: true, // Принудительно использовать указанный порт
    watch: {
      usePolling: true
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn']
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React chunks
          'react-core': ['react', 'react-dom'],
          'react-router': ['react-router-dom'],
          
          // MUI chunks - split by functionality
          'mui-core': ['@mui/material'],
          'mui-icons': ['@mui/icons-material'],
          'mui-data-grid': ['@mui/x-data-grid'],
          
          // State management
          'redux': ['@reduxjs/toolkit', 'react-redux'],
          
          // Forms and validation
          'forms': ['react-hook-form', '@hookform/resolvers', 'yup'],
          
          // API and utilities
          'api': ['axios', '@tanstack/react-query'],
          
          // UI components
          'ui': ['swiper', 'react-icons'],
          
          // Payment
          'stripe': ['@stripe/react-stripe-js', '@stripe/stripe-js'],
          
          // PWA
          'pwa': ['react-helmet-async']
        },
        // Optimize chunk naming
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
          return `js/[name]-[hash].js`;
        },
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `images/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        }
      }
    },
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 1000,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Optimize dependencies
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@mui/material',
      '@mui/icons-material',
      '@reduxjs/toolkit',
      'react-redux'
    ],
    exclude: ['@mui/x-data-grid'] // Exclude heavy components
  }
}) 