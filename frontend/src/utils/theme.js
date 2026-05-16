// Theme controller — toggles the `.dark` class on <html>, watches OS preference
// when mode === 'system', and keeps the PWA <meta theme-color> in sync.

export const THEME_MODES = ['light', 'dark', 'system'];

const META_THEME_COLOR = {
  light: '#047857', // emerald-700
  dark:  '#022c22', // deep emerald
};

const mql = () =>
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : null;

const resolveEffective = (mode) => {
  if (mode === 'dark') return 'dark';
  // For launch: default to light. System-preference auto-detect is disabled —
  // anything that isn't an explicit 'dark' selection resolves to light. Restore
  // by uncommenting the line below if the OS-watching behaviour is needed.
  // return mql()?.matches ? 'dark' : 'light';
  return 'light';
};

const setMetaThemeColor = (effective) => {
  if (typeof document === 'undefined') return;
  const tag = document.querySelector('meta[name="theme-color"]');
  if (tag) tag.setAttribute('content', META_THEME_COLOR[effective]);
};

export const applyTheme = (mode = 'system') => {
  if (typeof document === 'undefined') return;
  const effective = resolveEffective(mode);
  document.documentElement.classList.toggle('dark', effective === 'dark');
  setMetaThemeColor(effective);
};

// Subscribe to OS theme changes. The returned function removes the listener.
// Only invokes the callback when the user has selected 'system'.
let unsubscribe = null;
export const subscribeSystemTheme = (callback) => {
  const m = mql();
  if (!m) return () => {};
  if (unsubscribe) unsubscribe();
  const handler = () => callback();
  m.addEventListener('change', handler);
  unsubscribe = () => m.removeEventListener('change', handler);
  return unsubscribe;
};

// Eagerly-read initial mode, used to set up the DOM before React mounts.
// Default is now 'light' — auto-detecting the OS preference is disabled.
// Users can still pick 'dark' explicitly via the in-app ThemeToggle.
export const readInitialTheme = () => {
  try {
    const saved = localStorage.getItem('animall_theme');
    if (saved === 'dark' || saved === 'light') return saved;
  } catch { /* localStorage blocked */ }
  return 'light';
};
