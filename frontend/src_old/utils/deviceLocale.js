export const SUPPORTED_LANGS = ['en', 'hi', 'mr'];

export const detectDeviceLanguage = () => {
  try {
    const saved = localStorage.getItem('animall_lang');
    if (saved && SUPPORTED_LANGS.includes(saved)) return saved;

    const nav = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if (nav.startsWith('mr')) return 'mr';
    if (nav.startsWith('hi')) return 'hi';
    return 'en';
  } catch {
    return 'en';
  }
};
