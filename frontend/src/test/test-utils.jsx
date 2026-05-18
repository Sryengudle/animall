// Small helpers used across the component tests. Keeps the test files focused
// on behavior rather than wiring up Providers in every spec.

import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

import authReducer from '@/store/slices/authSlice';
import animalsReducer from '@/store/slices/animalsSlice';
import uiReducer from '@/store/slices/uiSlice';

/**
 * Build a fresh Redux store with optional slice-level preloaded state. Each
 * test gets its own isolated store so tests don't leak through the singleton
 * exported from `src/store/index.js`.
 *
 * Usage:
 *   makeStore({ auth: { user: { name: 'Suresh', phone: '9999999999' } } })
 */
export function makeStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      auth: authReducer,
      animals: animalsReducer,
      ui: uiReducer,
    },
    preloadedState: {
      auth: {
        user: null,
        token: null,
        isAuthenticated: false,
        pendingPhone: null,
        demoOtp: null,
        loading: false,
        error: null,
        ...(preloadedState.auth || {}),
      },
      animals: { list: [], loading: false, error: null, myListings: [], ...(preloadedState.animals || {}) },
      ui:      { lang: 'en', ...(preloadedState.ui || {}) },
    },
  });
}

/**
 * Render a component wrapped in Router + Redux Provider. Returns the RTL
 * helpers plus the store so a test can read state after interaction.
 */
export function renderWithProviders(
  ui,
  { route = '/', preloadedState = {}, store = makeStore(preloadedState) } = {},
) {
  const result = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </Provider>,
  );
  return { ...result, store };
}
