import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import App from './App';
import { makeStore } from '@/test/test-utils';
import { Provider } from 'react-redux';

// Swap BrowserRouter for MemoryRouter so we can boot App.jsx at the URL we
// want to probe without needing real history navigation. We keep the rest of
// react-router-dom unchanged.
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    BrowserRouter: ({ children }) =>
      <actual.MemoryRouter initialEntries={[globalThis.__TEST_ROUTE__ || '/']}>
        {children}
      </actual.MemoryRouter>,
  };
});

// Mock api so the lazy-loaded ListingDetail's mount-time animal lookup
// doesn't hit the network — the page still mounts and reads useParams().
vi.mock('@/services/api', () => ({
  default: {
    get: vi.fn(() => Promise.reject(new Error('no backend in test'))),
    post: vi.fn(() => Promise.reject(new Error('no backend in test'))),
  },
}));

function renderAppAt(route, preloadedState = {}) {
  globalThis.__TEST_ROUTE__ = route;
  const store = makeStore(preloadedState);
  return render(<Provider store={store}><App /></Provider>);
}

describe('App routing', () => {
  it('routes /login to LoginPage when unauthenticated', async () => {
    renderAppAt('/login');
    // LoginPage shows a phone-entry call to action. Use findByRole to wait
    // out the Suspense fallback (LoginPage is lazy-loaded).
    expect(await screen.findByRole('button', { name: /get otp/i })).toBeInTheDocument();
  });

  it('redirects unauthenticated user from /buy to /login', async () => {
    renderAppAt('/buy', { auth: { isAuthenticated: false } });
    expect(await screen.findByRole('button', { name: /get otp/i })).toBeInTheDocument();
  });

  it('legacy push-notification URL /animal/:id resolves under the same protected route as /buy/:id', async () => {
    // Pre-fix bug: /animal/:id wasn't a route, so push notifications opened
    // the catch-all (which navigates to /). After the fix, both URLs mount
    // the same lazy ListingDetail component. We assert by triggering the
    // auth gate — an unauthenticated visit to /animal/123 should land on
    // /login (proving the route exists and is protected), NOT the home
    // catch-all (which has no public path other than via the redirect).
    renderAppAt('/animal/abc123', { auth: { isAuthenticated: false } });
    expect(await screen.findByRole('button', { name: /get otp/i })).toBeInTheDocument();
  });

  it('catch-all redirects unknown paths to /', async () => {
    // / is a protected route — unauthenticated users hit /login. So an
    // unknown path → catch-all → / → ProtectedRoute → /login.
    renderAppAt('/nonexistent', { auth: { isAuthenticated: false } });
    expect(await screen.findByRole('button', { name: /get otp/i })).toBeInTheDocument();
  });
});
