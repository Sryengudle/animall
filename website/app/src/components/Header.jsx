import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';
import Button from './ui/Button';

export default function Header() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 8); }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const nav = [
    { to: '/how-it-works', label: t('nav.howItWorks') },
    { to: '/features',     label: t('nav.features') },
    { to: '/about',        label: t('nav.about') },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-colors ${
        scrolled ? 'glass shadow-card' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden md:flex items-center gap-1">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? 'text-brand-700 bg-brand-50' : 'text-ink hover:bg-brand-50/60'
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <LanguageSwitcher compact />
          <Button to="/download" size="sm">
            {t('nav.download')}
          </Button>
        </div>

        <button
          type="button"
          className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-white/80"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
          aria-expanded={open}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            {open ? (
              <path d="M5 5l12 12M17 5L5 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            ) : (
              <>
                <path d="M3 6h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M3 11h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M3 16h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </>
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-white">
          <div className="mx-auto max-w-7xl px-5 py-4 flex flex-col gap-1">
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-xl text-base font-medium ${
                    isActive ? 'text-brand-700 bg-brand-50' : 'text-ink hover:bg-brand-50/60'
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
            <div className="flex items-center gap-3 pt-3 mt-1 border-t border-border">
              <LanguageSwitcher />
              <Button to="/download" size="sm" onClick={() => setOpen(false)} className="flex-1">
                {t('nav.download')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
