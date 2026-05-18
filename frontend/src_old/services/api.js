import axios from 'axios';

// Base URL: proxied via vite.config.js in dev, or set VITE_API_URL in production
const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Attach JWT token from localStorage on every request
api.interceptors.request.use((config) => {
  try {
    const auth = JSON.parse(localStorage.getItem('animall_auth') || 'null');
    if (auth?.token) config.headers.Authorization = `Bearer ${auth.token}`;
  } catch {}
  return config;
});

export default api;
