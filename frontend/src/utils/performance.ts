/**
 * Performance optimization utilities
 */

// Preload critical components for better perceived performance
export const preloadCriticalComponents = () => {
  // Preload critical pages that users are likely to visit
  const criticalPaths = [
    '/products',
    '/cart',
    '/checkout'
  ];
  
  criticalPaths.forEach(path => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = path;
    document.head.appendChild(link);
  });
};

// Optimize MUI imports by using specific imports instead of barrel imports
export const optimizeMUIImports = () => {
  // This function serves as a reminder to use specific imports
  // Example: import Button from '@mui/material/Button' instead of import { Button } from '@mui/material'
  console.log('Use specific MUI imports for better tree-shaking');
};

// Debounce function for performance optimization
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function for performance optimization
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Intersection Observer for lazy loading
export const createIntersectionObserver = (
  callback: IntersectionObserverCallback,
  options: IntersectionObserverInit = {}
) => {
  return new IntersectionObserver(callback, {
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  });
};

// Performance monitoring
export const measurePerformance = (name: string, fn: () => void) => {
  const start = performance.now();
  fn();
  const end = performance.now();
  console.log(`${name} took ${end - start} milliseconds`);
};

// Memory usage monitoring
export const getMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return {
      used: Math.round(memory.usedJSHeapSize / 1048576 * 100) / 100,
      total: Math.round(memory.totalJSHeapSize / 1048576 * 100) / 100,
      limit: Math.round(memory.jsHeapSizeLimit / 1048576 * 100) / 100
    };
  }
  return null;
};