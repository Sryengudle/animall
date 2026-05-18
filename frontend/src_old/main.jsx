import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';
import './index.css';
import { applyTheme, readInitialTheme, subscribeSystemTheme } from './utils/theme';
import { setTheme } from './store/slices/uiSlice';
import api from './services/api';

// Apply the persisted/system theme before React mounts so there's no flash.
applyTheme(readInitialTheme());

// If the user's mode is 'system', follow OS preference changes live.
subscribeSystemTheme(() => {
  const mode = store.getState().ui.theme;
  if (mode === 'system') store.dispatch(setTheme('system'));
});

// Register PWA service worker (handled by vite-plugin-pwa automatically)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
  navigator.serviceWorker.register('/custom-worker.js')
    .then(reg => console.log('Service Worker registered', reg))
    .catch(err => console.error('Service Worker blocked', err));
}

// Utility function to convert VAPID public key for the browser
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function subscribeUser() {
  const registration = await navigator.serviceWorker.ready;
  
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return;

  const convertedVapidKey = urlBase64ToUint8Array('BGMva1OQmm184ZXKvUHX590epgiahdvZHYmZjJvmZMwBOyBZWjlPa2HzDIS8oMWO8LgmOEPosQsYQ2vvV-a-HEU');

  // 1. The browser generates a unique subscription object (JSON)
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: convertedVapidKey
  });

  // Send the subscription to your Node backend via the shared api service
  await api.post('/subscribe', subscription);

  // alert('Notifications enabled successfully!');
}
subscribeUser()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
