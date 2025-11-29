'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegister() {
  useEffect(() => {
    // Only register in browser (client-side) and in production
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', async () => {
        try {
          const registration = await navigator.serviceWorker.register('/service-worker.js', {
            scope: '/',
          });

          console.log('✅ Service Worker registrado exitosamente:', registration.scope);

          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60000); // Check every minute

          // Listen for new service worker
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (
                  newWorker.state === 'installed' &&
                  navigator.serviceWorker.controller
                ) {
                  // New service worker available, prompt user
                  console.log('📦 Nueva versión disponible');
                  
                  // Optional: Show toast notification
                  const event = new CustomEvent('sw-update-available');
                  window.dispatchEvent(event);
                }
              });
            }
          });
        } catch (error) {
          console.error('❌ Error registrando Service Worker:', error);
        }
      });

      // Handle messages from service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        const { type, data } = event.data;
        
        if (type === 'CACHE_UPDATED') {
          console.log('📦 Caché actualizado:', data.cacheName);
        }
      });

      // Handle offline/online events
      window.addEventListener('offline', () => {
        console.log('📡 Modo offline activado');
      });

      window.addEventListener('online', () => {
        console.log('📡 Conexión restaurada');
      });
    }
  }, []);

  return null; // This component doesn't render anything
}
