import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import { getMemoryUsage, measurePerformance } from '../utils/performance';

interface PerformanceMetrics {
  memory: {
    used: number;
    total: number;
    limit: number;
  } | null;
  loadTime: number;
  renderTime: number;
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    memory: null,
    loadTime: 0,
    renderTime: 0
  });

  useEffect(() => {
    // Only show in development mode
    if (process.env.NODE_ENV !== 'development') return;

    // Measure page load time
    const loadTime = performance.now();
    setMetrics(prev => ({ ...prev, loadTime }));

    // Update memory usage periodically
    const interval = setInterval(() => {
      const memory = getMemoryUsage();
      setMetrics(prev => ({ ...prev, memory }));
    }, 5000);

    // Measure render performance
    measurePerformance('Component Render', () => {
      setMetrics(prev => ({ ...prev, renderTime: performance.now() }));
    });

    return () => clearInterval(interval);
  }, []);

  // Only render in development mode
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        p: 2,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        minWidth: 200
      }}
    >
      <Typography variant="h6" gutterBottom>
        Performance Monitor
      </Typography>
      
      <Box sx={{ mb: 1 }}>
        <Typography variant="body2">
          Load Time: {metrics.loadTime.toFixed(2)}ms
        </Typography>
      </Box>

      {metrics.memory && (
        <Box sx={{ mb: 1 }}>
          <Typography variant="body2">
            Memory: {metrics.memory.used}MB / {metrics.memory.total}MB
          </Typography>
          <Chip
            label={`${Math.round((metrics.memory.used / metrics.memory.limit) * 100)}%`}
            size="small"
            color={metrics.memory.used / metrics.memory.limit > 0.8 ? 'error' : 'success'}
            sx={{ mt: 0.5 }}
          />
        </Box>
      )}

      <Box>
        <Typography variant="body2">
          Render Time: {metrics.renderTime.toFixed(2)}ms
        </Typography>
      </Box>
    </Paper>
  );
};

export default PerformanceMonitor;