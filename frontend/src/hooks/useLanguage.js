import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setLang } from '@/store/slices/uiSlice';
import { t } from '@/i18n';

// Hook: returns the active translation function and language controls.
export default function useLanguage() {
  const lang = useSelector((s) => s.ui.lang);
  const dispatch = useDispatch();

  const tr = useCallback((key, vars) => t(key, lang, vars), [lang]);
  const changeLang = useCallback((code) => dispatch(setLang(code)), [dispatch]);

  return { lang, tr, changeLang };
}
