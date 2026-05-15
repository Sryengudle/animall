import { createSlice } from '@reduxjs/toolkit';
import { detectDeviceLanguage, SUPPORTED_LANGS } from '@/utils/deviceLocale';
import { readInitialTheme, applyTheme, THEME_MODES } from '@/utils/theme';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    lang: detectDeviceLanguage(),
    theme: readInitialTheme(),
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    showFilters: false,
    activeCategory: 'all',
    priceRange: [0, 200000],
    sortBy: 'newest',
    searchQuery: '',
  },
  reducers: {
    setLang(state, action) {
      if (!SUPPORTED_LANGS.includes(action.payload)) return;
      state.lang = action.payload;
      try { localStorage.setItem('animall_lang', action.payload); } catch {}
      try { document.documentElement.lang = action.payload; } catch {}
    },
    setTheme(state, action) {
      if (!THEME_MODES.includes(action.payload)) return;
      state.theme = action.payload;
      try { localStorage.setItem('animall_theme', action.payload); } catch {}
      applyTheme(action.payload);
    },
    setOnline(state, action) {
      state.isOnline = action.payload;
    },
    toggleFilters(state) {
      state.showFilters = !state.showFilters;
    },
    setShowFilters(state, action) {
      state.showFilters = action.payload;
    },
    setActiveCategory(state, action) {
      state.activeCategory = action.payload;
    },
    setPriceRange(state, action) {
      state.priceRange = action.payload;
    },
    setSortBy(state, action) {
      state.sortBy = action.payload;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    clearFilters(state) {
      state.activeCategory = 'all';
      state.priceRange = [0, 200000];
      state.sortBy = 'newest';
      state.searchQuery = '';
    },
  },
});

export const {
  setLang, setTheme, setOnline,
  toggleFilters, setShowFilters,
  setActiveCategory, setPriceRange, setSortBy, setSearchQuery,
  clearFilters,
} = uiSlice.actions;

export default uiSlice.reducer;
