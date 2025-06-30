import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PWAInstallPrompt from '../PWAInstallPrompt';
import * as pwaUtils from '../../utils/pwa';

// Mock PWA utilities
jest.mock('../../utils/pwa', () => ({
  isPWAInstalled: jest.fn(),
  installPWA: jest.fn(),
}));

describe('PWAInstallPrompt', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  test('should not render when PWA is already installed', () => {
    (pwaUtils.isPWAInstalled as jest.Mock).mockReturnValue(true);

    render(<PWAInstallPrompt />);
    
    expect(screen.queryByText('Install Online Shop App')).not.toBeInTheDocument();
  });

  test('should render install prompt when beforeinstallprompt event fires', () => {
    (pwaUtils.isPWAInstalled as jest.Mock).mockReturnValue(false);

    render(<PWAInstallPrompt />);

    // Simulate beforeinstallprompt event
    const beforeInstallPromptEvent = new Event('beforeinstallprompt');
    Object.defineProperty(beforeInstallPromptEvent, 'prompt', {
      value: jest.fn().mockResolvedValue({ outcome: 'accepted' }),
    });
    Object.defineProperty(beforeInstallPromptEvent, 'userChoice', {
      value: Promise.resolve({ outcome: 'accepted' }),
    });

    fireEvent(window, beforeInstallPromptEvent);

    expect(screen.getByText('Install Online Shop App')).toBeInTheDocument();
    expect(screen.getByText('Faster loading times')).toBeInTheDocument();
    expect(screen.getByText('Offline access to key features')).toBeInTheDocument();
    expect(screen.getByText('Push notifications for orders and deals')).toBeInTheDocument();
    expect(screen.getByText('App-like experience')).toBeInTheDocument();
  });

  test('should handle install button click', async () => {
    (pwaUtils.isPWAInstalled as jest.Mock).mockReturnValue(false);

    render(<PWAInstallPrompt />);

    // Simulate beforeinstallprompt event
    const beforeInstallPromptEvent = new Event('beforeinstallprompt');
    const mockPrompt = jest.fn().mockResolvedValue({ outcome: 'accepted' });
    Object.defineProperty(beforeInstallPromptEvent, 'prompt', {
      value: mockPrompt,
    });
    Object.defineProperty(beforeInstallPromptEvent, 'userChoice', {
      value: Promise.resolve({ outcome: 'accepted' }),
    });

    fireEvent(window, beforeInstallPromptEvent);

    const installButton = screen.getByText('Install App');
    fireEvent.click(installButton);

    await waitFor(() => {
      expect(mockPrompt).toHaveBeenCalled();
    });
  });

  test('should handle close button click', () => {
    (pwaUtils.isPWAInstalled as jest.Mock).mockReturnValue(false);

    render(<PWAInstallPrompt />);

    // Simulate beforeinstallprompt event
    const beforeInstallPromptEvent = new Event('beforeinstallprompt');
    fireEvent(window, beforeInstallPromptEvent);

    const closeButton = screen.getByText('Not Now');
    fireEvent.click(closeButton);

    expect(screen.queryByText('Install Online Shop App')).not.toBeInTheDocument();
  });

  test('should show correct benefits list', () => {
    (pwaUtils.isPWAInstalled as jest.Mock).mockReturnValue(false);

    render(<PWAInstallPrompt />);

    // Simulate beforeinstallprompt event
    const beforeInstallPromptEvent = new Event('beforeinstallprompt');
    fireEvent(window, beforeInstallPromptEvent);

    const benefits = [
      'Faster loading times',
      'Offline access to key features',
      'Push notifications for orders and deals',
      'App-like experience'
    ];

    benefits.forEach(benefit => {
      expect(screen.getByText(benefit)).toBeInTheDocument();
    });
  });
}); 