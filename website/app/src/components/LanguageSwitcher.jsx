import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';

const LANGS = [
  { code: 'mr', label: 'मराठी',  short: 'MR' },
  { code: 'hi', label: 'हिंदी',   short: 'HI' },
  { code: 'en', label: 'English', short: 'EN' },
];

export default function LanguageSwitcher({ compact = false }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = LANGS.find((l) => l.code === i18n.language) || LANGS[0];

  useEffect(() => {
    function onClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  function pick(code) {
    i18n.changeLanguage(code);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-white/80 px-3 py-2 text-sm font-medium text-ink hover:bg-white transition-colors min-h-[40px]"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span aria-hidden="true">🌐</span>
        <span>{compact ? current.short : current.label}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 mt-2 w-36 overflow-hidden rounded-2xl border border-border bg-white shadow-card z-50"
        >
          {LANGS.map((l) => (
            <li key={l.code}>
              <button
                type="button"
                onClick={() => pick(l.code)}
                className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-brand-50 ${
                  l.code === current.code ? 'bg-brand-50 text-brand-700 font-semibold' : 'text-ink'
                }`}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
