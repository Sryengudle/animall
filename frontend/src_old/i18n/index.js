import en from './en';
import mr from './mr';
import hi from './hi';

export const translations = { en, mr, hi };

export const LANG_OPTIONS = [
  { code: 'en', label: 'English',  short: 'EN' },
  { code: 'hi', label: 'हिंदी',     short: 'हि' },
  { code: 'mr', label: 'मराठी',     short: 'मर' },
];

// Return translation. Supports `{n}`-style interpolation: tr('count', 'en', { n: 5 })
export const t = (key, lang = 'en', vars) => {
  const dict = translations[lang] || translations.en;
  let value = dict[key] ?? translations.en[key] ?? key;
  if (vars && typeof value === 'string') {
    for (const [k, v] of Object.entries(vars)) {
      value = value.replaceAll(`{${k}}`, String(v));
    }
  }
  return value;
};

export default translations;
