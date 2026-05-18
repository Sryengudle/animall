// Vitest setup file — loaded once before every test file via vite.config.js
// `test.setupFiles`. Wires the jest-dom matchers in so tests can do
// `expect(el).toBeInTheDocument()`, `toHaveAttribute(...)`, etc.

import '@testing-library/jest-dom/vitest';

// jsdom doesn't implement IntersectionObserver, which framer-motion's `useInView`
// and a couple of PrimeVue-style sheet components hit. Stub it.
class IntersectionObserverStub {
  constructor(cb) { this.cb = cb; }
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
}
globalThis.IntersectionObserver = IntersectionObserverStub;

// matchMedia is missing in jsdom and some Tailwind/framer-motion helpers call it.
// Return a sane default that's "false" for all queries; tests can override per-spec
// if a particular query matters.
globalThis.matchMedia ??= (query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => false,
});

// PWA / service worker — not present in jsdom; some code paths read it.
globalThis.navigator.serviceWorker ??= { register: () => Promise.resolve() };

// jsdom's localStorage object can be lazily-shaped enough that
// `localStorage.setItem` throws inside Redux reducers. Reseat it with a
// plain in-memory implementation so tests are deterministic.
import { afterEach } from 'vitest';
const storage = new Map();
const memStorage = {
  getItem: (k) => (storage.has(k) ? storage.get(k) : null),
  setItem: (k, v) => { storage.set(k, String(v)); },
  removeItem: (k) => { storage.delete(k); },
  clear: () => { storage.clear(); },
  key: (i) => Array.from(storage.keys())[i] ?? null,
  get length() { return storage.size; },
};
Object.defineProperty(globalThis, 'localStorage', {
  value: memStorage,
  configurable: true,
  writable: false,
});

// Wipe storage between tests so persisted auth state doesn't leak.
afterEach(() => { storage.clear(); });
