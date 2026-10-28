import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GlobalErrorBoundary } from './components/GlobalErrorBoundary';
import './index.css';

// Register Service Worker for PWA (Progressive Web App)
if ('serviceWorker' in navigator && (import.meta.env.PROD || window.location.hostname === 'localhost')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        console.log('[PWA] Kalandra Service Worker registered:', reg.scope);
      })
      .catch((err) => {
        console.warn('[PWA] Service Worker registration failed:', err);
      });
  });
}

const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <GlobalErrorBoundary>
        <App />
      </GlobalErrorBoundary>
    </React.StrictMode>
  );
}
