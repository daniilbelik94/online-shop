// PWA utilities
export const registerServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      });
      console.log('SW registered: ', registration);
      
      // Обработка обновлений SW
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('New SW installed, refresh to update');
            }
          });
        }
      });
    } catch (registrationError) {
      console.warn('SW registration failed: ', registrationError);
      // Не блокируем приложение при ошибке регистрации SW
    }
  }
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.warn('Failed to request notification permission:', error);
      return false;
    }
  }

  return false;
};

export const showNotification = (title: string, options?: NotificationOptions): void => {
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        icon: '/placeholder-product.jpg',
        badge: '/placeholder-product.jpg',
        ...options
      });
    } catch (error) {
      console.warn('Failed to show notification:', error);
    }
  }
};

export const isPWAInstalled = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true;
};

export const installPWA = async (): Promise<void> => {
  if ('beforeinstallprompt' in window) {
    const promptEvent = (window as any).deferredPrompt;
    if (promptEvent) {
      try {
        promptEvent.prompt();
        const result = await promptEvent.userChoice;
        if (result.outcome === 'accepted') {
          console.log('PWA installed successfully');
        }
        (window as any).deferredPrompt = null;
      } catch (error) {
        console.warn('Failed to install PWA:', error);
      }
    }
  }
}; 